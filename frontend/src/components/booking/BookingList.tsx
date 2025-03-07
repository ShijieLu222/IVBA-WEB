import React, { useEffect } from 'react';
import { Table, Button, Space, message, Popconfirm, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchBookings, deleteBooking } from '../../store/bookingSlice';
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
      message.success('Booking deleted successfully');
    } catch (err) {
      message.error(
        'Delete failed: ' + (err instanceof Error ? err.message : 'Unknown error')
      );
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      confirmed: { color: '#000000', text: 'Confirmed' },
      pending: { color: '#666666', text: 'Pending' },
      cancelled: { color: '#999999', text: 'Cancelled' },
    };
    const config = statusConfig[status] || { color: '#cccccc', text: status };
    return (
      <Tag color={config.color} style={{ borderColor: config.color }}>
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Booker',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Contact',
      dataIndex: 'contact_info',
      key: 'contact_info',
    },
    {
      title: 'Booking Date',
      dataIndex: 'booking_date',
      key: 'booking_date',
    },
    {
      title: 'Start Time',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
      title: 'End Time',
      dataIndex: 'end_time',
      key: 'end_time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            style={{ color: '#000000' }}
            onClick={() => console.log('Edit', record.id)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this booking?"
            onConfirm={() => handleDelete(record.id)}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
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
          style={{
            backgroundColor: '#000000',
            borderColor: '#000000',
          }}
          onClick={() => console.log('Add Booking')}
        >
          Add Booking
        </Button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
