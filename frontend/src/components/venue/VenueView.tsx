import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { Venue, VenueStatus } from '../../types/venue';

interface VenueViewProps {
  visible: boolean;
  venue: Venue | null;
  onClose: () => void;
}

const VenueView: React.FC<VenueViewProps> = ({ visible, venue, onClose }) => {
  if (!venue) return null;

  const getStatusTag = (status: string) => {
    const statusConfig: Record<string, { color: string; text: string }> = {
      ACTIVE: { color: '#52c41a', text: 'Active' },
      INACTIVE: { color: '#f5222d', text: 'Inactive' },
      PENDING: { color: '#faad14', text: 'Pending' },
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
      title="Venue Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Venue ID">{venue.id}</Descriptions.Item>
        <Descriptions.Item label="Venue Name">{venue.venue_name}</Descriptions.Item>
        <Descriptions.Item label="Description" span={2}>{venue.description}</Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>{venue.address}</Descriptions.Item>
        <Descriptions.Item label="Area (sqm)">{venue.size_sqm}</Descriptions.Item>
        <Descriptions.Item label="Price">{`${venue.price} ${venue.currency}`}</Descriptions.Item>
        <Descriptions.Item label="Maximum Capacity">{venue.maximum_capacity}</Descriptions.Item>
        <Descriptions.Item label="Status">{getStatusTag(venue.status)}</Descriptions.Item>
        <Descriptions.Item label="Contact Person">{venue.contact_name}</Descriptions.Item>
        <Descriptions.Item label="Contact Email">{venue.contact_email}</Descriptions.Item>
        <Descriptions.Item label="Contact Phone">{venue.contact_phone}</Descriptions.Item>
        <Descriptions.Item label="Created At">{venue.created_at}</Descriptions.Item>
        <Descriptions.Item label="Updated At">{venue.updated_at}</Descriptions.Item>
        <Descriptions.Item label="Facilities" span={2}>
          {venue.facilities.map((facility, index) => (
            <div key={index}>
              <strong>{facility.display_name}</strong>: {facility.facility_information.join(', ')}
            </div>
          ))}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default VenueView;