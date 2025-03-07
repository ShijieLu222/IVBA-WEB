import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, Space } from 'antd';
import { Venue } from '../../types/venue';

interface VenueFormProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: Partial<Venue>) => void;
    initialValues?: Venue;
}

const VenueForm: React.FC<VenueFormProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
    const [form] = Form.useForm();

    // Reset form data when initialValues change
    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue({
                    venue_name: initialValues.venue_name,
                    description: initialValues.description,
                    address: initialValues.address,
                    contact_name: initialValues.contact_name,
                    contact_email: initialValues.contact_email,
                    contact_phone: initialValues.contact_phone,
                    size_sqm: initialValues.size_sqm,
                    price: initialValues.price,
                    maximum_capacity: initialValues.maximum_capacity
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const venueData: Partial<Venue> = {
                venue_name: values.venue_name,
                description: values.description,
                address: values.address,
                contact_name: values.contact_name,
                contact_email: values.contact_email,
                contact_phone: values.contact_phone,
                size_sqm: values.size_sqm,
                price: values.price,
                currency: 'USD',
                maximum_capacity: values.maximum_capacity,
                facilities: [],
                availability: []
            };
            onSubmit(venueData);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title={initialValues ? "Edit Venue" : "Add New Venue"}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="venue_name"
                    label="Venue Name"
                    rules={[{ required: true, message: 'Please input venue name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please input description' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: 'Please input address' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="size_sqm"
                    label="Size (Square Meters)"
                    rules={[{ required: true, message: 'Please input size' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price per Hour"
                    rules={[{ required: true, message: 'Please input price' }]}
                >
                    <InputNumber
                        min={0}
                        step={0.01}
                        style={{ width: '100%' }}
                        formatter={(value) =>
                            value !== undefined
                                ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                : ''
                        }
                        parser={(value: string | undefined): number => {
                            if (!value) return 0;
                            return parseFloat(value.replace(/\$\s?|(,*)/g, ''));
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="maximum_capacity"
                    label="Maximum Capacity"
                    rules={[{ required: true, message: 'Please input maximum capacity' }]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="contact_name"
                    label="Contact Name"
                    rules={[{ required: true, message: 'Please input contact name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="contact_email"
                    label="Contact Email"
                    rules={[{ required: true, message: 'Please input contact email' }, { type: 'email' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="contact_phone"
                    label="Contact Phone"
                    rules={[{ required: true, message: 'Please input contact phone' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Button onClick={onCancel}>Cancel</Button>
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#000000' }}>
                            {initialValues ? 'Update' : 'Submit'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default VenueForm;