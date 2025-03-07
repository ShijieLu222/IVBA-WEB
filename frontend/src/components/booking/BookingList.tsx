import React, { useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchBookings, deleteBooking, Booking } from '../../store/bookingSlice';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

const BookingList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { bookings, status, error } = useAppSelector((state) => state.bookings);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBookings());
    }
  }, [status, dispatch]);

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteBooking(id)).unwrap();
      message.success('预订删除成功');
    } catch (err) {
      message.error('删除失败：' + (err instanceof Error ? err.message : '未知错误'));
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      confirmed: { color: '#000000', text: '已确认' },
      pending: { color: '#666666', text: '待确认' },
      cancelled: { color: '#999999', text: '已取消' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Tag color={config.color} style={{ borderColor: config.color }}>
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: '预订人',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '预订日期',
      dataIndex: 'booking_date',
      key: 'booking_date',
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Booking) => (
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
            title="确定要删除这个预订吗？"
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
          onClick={() => console.log('新增预订')}
        >
          新增预订
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={bookings}
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

export default BookingList;