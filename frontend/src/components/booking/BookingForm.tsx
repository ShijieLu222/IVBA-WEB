import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Select, Button, Space } from 'antd';
import type { BookingCreate, Booking } from '../../types/booking';
import moment from 'moment';

interface BookingFormProps {
  visible: boolean;
  onCancel: () => void;
  /**
   * 表单提交后的回调，父组件可以在这里 dispatch(createBooking)
   * 或直接调用后端 API
   */
  onSubmit: (values: Partial<BookingCreate>) => void;
  initialValues?: Booking;
}

const BookingForm: React.FC<BookingFormProps> = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  // 当initialValues变化时重置表单数据
  useEffect(() => {
    if (visible) {
      if (initialValues) {
        // 设置表单初始值
        form.setFieldsValue({
          venue_id: initialValues.venue_id,
          booking_date: initialValues.booking_date ? moment(initialValues.booking_date) : null,
          start_time: initialValues.start_time ? moment(initialValues.start_time, 'HH:mm:ss') : null,
          end_time: initialValues.end_time ? moment(initialValues.end_time, 'HH:mm:ss') : null,
          user_name: initialValues.user_name,
          contact_info: initialValues.contact_info,
          status: initialValues.status
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

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
        // status: values.status, // 移除status字段，因为它不在BookingCreate类型中
      };

      onSubmit(bookingData);
      form.resetFields();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title={initialValues ? "编辑预订" : "添加预订"}
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

        <Form.Item
          name="status"
          label="预订状态"
          rules={[{ required: true, message: '请选择预订状态' }]}
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
