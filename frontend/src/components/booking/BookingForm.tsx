import React from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Select, Button, Space } from 'antd';
import type { BookingCreate } from '../../types/booking';

interface BookingFormProps {
  visible: boolean;
  onCancel: () => void;
  /**
   * 表单提交后的回调，父组件可以在这里 dispatch(createBooking)
   * 或直接调用后端 API
   */
  onSubmit: (values: Partial<BookingCreate>) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 整理表单数据为后端或 Redux 所需的格式
      const bookingData: Partial<BookingCreate> = {
        venue_id: Number(values.venue_id),
        booking_date: values.booking_date?.format('YYYY-MM-DD'),
        start_time: values.start_time?.format('HH:mm:ss'),
        end_time: values.end_time?.format('HH:mm:ss'),
        user_name: values.user_name,
        contact_info: values.contact_info,
        // 如果需要状态，可以取消注释下面代码
        // status: values.status,
      };

      onSubmit(bookingData);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title="添加预订"
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
          name="venue_id"
          label="场地ID"
          rules={[{ required: true, message: '请输入场地ID' }]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="booking_date"
          label="预订日期"
          rules={[{ required: true, message: '请选择预订日期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="start_time"
          label="开始时间"
          rules={[{ required: true, message: '请选择开始时间' }]}
        >
          <TimePicker format="HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="end_time"
          label="结束时间"
          rules={[{ required: true, message: '请选择结束时间' }]}
        >
          <TimePicker format="HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="user_name"
          label="预订人姓名"
          rules={[{ required: true, message: '请输入预订人姓名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="contact_info"
          label="联系方式"
          rules={[{ required: true, message: '请输入联系方式' }]}
        >
          <Input />
        </Form.Item>

        {/** 如果需要让用户手动选择状态，可以取消下面代码的注释 */}
        <Form.Item
          name="status"
          label="预订状态"
          rules={[{ required: false }]}
          initialValue="pending"
        >
          <Select>
            <Select.Option value="pending">待确认</Select.Option>
            <Select.Option value="confirmed">已确认</Select.Option>
            <Select.Option value="cancelled">已取消</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#000000' }}>
              提交
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BookingForm;
