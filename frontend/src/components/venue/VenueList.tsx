import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchVenues, deleteVenue, createVenue, updateVenue } from '../../store/venueSlice';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import VenueForm from './VenueForm';
import { Venue } from '../../types/venue';

const VenueList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { venues, status } = useAppSelector((state) => state.venues);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  useEffect(() => {
    dispatch(fetchVenues());
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
    </div>
  );
};

export default VenueList;
