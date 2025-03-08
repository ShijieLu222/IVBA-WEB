import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchVenues, deleteVenue, createVenue, updateVenue } from '../../store/venueSlice';
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import VenueForm from './VenueForm';
import VenueView from './VenueView';
import { Venue } from '../../types/venue';

const VenueList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { venues, status, error } = useAppSelector((state) => state.venues);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [viewingVenue, setViewingVenue] = useState<Venue | null>(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);

  useEffect(() => {
    // 发起API请求获取场地数据
    dispatch(fetchVenues())
      .unwrap()
      .then(() => {
        if (status === 'failed' && error) {
          message.error(`加载场地数据失败: ${error}`);
        }
      })
      .catch((err) => {
        message.error(`加载场地数据失败: ${err instanceof Error ? err.message : '未知错误'}`);
      });
  }, [dispatch]);
  
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteVenue(id)).unwrap();
      message.success('Venue deleted successfully');
    } catch (err) {
      message.error('Delete failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleAddVenue = (values: any) => {
    dispatch(createVenue(values))
      .unwrap()
      .then(() => {
        message.success('Venue created successfully');
        setIsModalVisible(false);
        dispatch(fetchVenues());
      })
      .catch((error: { message: any; }) => {
        message.error('Venue creation failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      });
  };

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue);
    setIsModalVisible(true);
  };

  const handleView = (venue: Venue) => {
    setViewingVenue(venue);
    setIsViewModalVisible(true);
  };

  const handleSubmit = (values: Partial<Venue>) => {
    if (editingVenue) {
      dispatch(updateVenue({ id: editingVenue.id, venue: values }))
        .unwrap()
        .then(() => {
          message.success('Venue updated successfully');
          setIsModalVisible(false);
          setEditingVenue(null);
          dispatch(fetchVenues());
        })
        .catch((error) => {
          message.error('Venue update failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        });
    } else {
      handleAddVenue(values);
    }
  };

  const columns = [
    {
      title: 'Venue Name',
      dataIndex: 'venue_name',
      key: 'venue_name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Capacity',
      dataIndex: 'maximum_capacity',
      key: 'maximum_capacity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `£${price}`,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: Venue) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            style={{ color: '#1890ff' }}
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Button 
            type="text" 
            icon={<EditOutlined />}
            style={{ color: '#000000' }}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this venue?"
            onConfirm={() => handleDelete(record.id)}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
            >
              Delete
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
          onClick={() => {
            setEditingVenue(null);
            setIsModalVisible(true);
          }}
        >
          Add Venue
        </Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={venues} 
        rowKey="id"
        loading={status === 'loading'}
      />
      <VenueForm
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingVenue(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingVenue || undefined}
      />
      <VenueView
        visible={isViewModalVisible}
        venue={viewingVenue}
        onClose={() => {
          setIsViewModalVisible(false);
          setViewingVenue(null);
        }}
      />
    </div>
  );
};

export default VenueList;
