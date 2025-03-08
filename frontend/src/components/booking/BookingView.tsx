import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { Booking } from '../../types/booking';
import { getVenue } from '../../api/venue';

interface BookingViewProps {
  visible: boolean;
  booking: Booking | null;
  onClose: () => void;
}

const BookingView: React.FC<BookingViewProps> = ({ visible, booking, onClose }) => {
  const [venueName, setVenueName] = useState<string>('');
  
  useEffect(() => {
    if (booking && booking.venue_id) {
      const fetchVenueName = async () => {
        try {
          const venueData = await getVenue(booking.venue_id.toString());
          setVenueName(venueData.venue_name);
        } catch (error) {
          console.error('Failed to fetch venue details:', error);
          setVenueName('Unknown Venue');
        }
      };
      
      fetchVenueName();
    }
  }, [booking]);
  
  if (!booking) return null;

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

  return (
    <Modal
      title="Booking Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Booking ID">{booking.id}</Descriptions.Item>
        <Descriptions.Item label="Venue ID">{booking.venue_id}</Descriptions.Item>
        <Descriptions.Item label="Venue Name">{venueName || 'Loading...'}</Descriptions.Item>
        <Descriptions.Item label="Booker Name">{booking.user_name}</Descriptions.Item>
        <Descriptions.Item label="Contact Info">{booking.contact_info}</Descriptions.Item>
        <Descriptions.Item label="Booking Date">{booking.booking_date}</Descriptions.Item>
        <Descriptions.Item label="Status">{getStatusTag(booking.status)}</Descriptions.Item>
        <Descriptions.Item label="Start Time">{booking.start_time}</Descriptions.Item>
        <Descriptions.Item label="End Time">{booking.end_time}</Descriptions.Item>
        <Descriptions.Item label="Created At">{booking.created_at}</Descriptions.Item>
        <Descriptions.Item label="Updated At">{booking.updated_at}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default BookingView;