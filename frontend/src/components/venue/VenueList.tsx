import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchVenues, deleteVenue, createVenue } from '../../store/venueSlice';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import VenueForm from './VenueForm';
import { Venue } from '../../types/venue';

const VenueList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { venues, status } = useAppSelector((state) => state.venues);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchVenues());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteVenue(id)).unwrap();
      message.success('场地删除成功');
    } catch (err) {
      message.error('删除失败: ' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  const handleAddVenue = (values: any) => {
    // 调用创建场地的异步 action
    dispatch(createVenue(values))
      .unwrap()
      .then(() => {
        message.success('场地创建成功');
        setIsModalVisible(false);
        dispatch(fetchVenues()); // 刷新列表
      })
      .catch((error: { message: any; }) => {
        message.error('场地创建失败: ' + (error instanceof Error ? error.message : '未知错误'));
      });
  };

  const columns = [
    {
      title: '场地名称',
      dataIndex: 'venue_name', // 使用后端返回的字段名
      key: 'venue_name',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '容量',
      dataIndex: 'maximum_capacity', // 使用后端返回的字段名
      key: 'maximum_capacity',
    },
    {
      title: '价格',
      dataIndex: 'price', // 使用后端返回的字段名
      key: 'price',
      render: (price: number) => `£${price}`, // 根据需求显示英镑符号
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Venue) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />}
            style={{ color: '#000000' }}
            onClick={() => console.log('编辑', record.id)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个场地吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          style={{ 
            backgroundColor: '#000000',
            borderColor: '#000000',
          }}
          onClick={() => setIsModalVisible(true)}
        >
          添加场地
        </Button>
      </div>
      <VenueForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleAddVenue}
      />
      <Table
        columns={columns}
        dataSource={venues}
        rowKey="id"
        loading={status === 'loading'}
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #d9d9d9',
        }}
      />
    </div>
  );
};

export default VenueList;
