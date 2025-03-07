import api from './config';
import { Booking } from '../types/booking';

// 获取所有预订
export const getBookings = async () => {
  const response = await api.get('/api/bookings');
  return response.data;
};

// 获取单个预订
export const getBooking = async (id: number) => {
  const response = await api.get(`/api/bookings/${id}`);
  return response.data;
};

// 创建预订
export const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
  const response = await api.post('/api/bookings', booking);
  return response.data;
};

// 更新预订
export const updateBooking = async (id: number, booking: Partial<Booking>) => {
  const response = await api.put(`/api/bookings/${id}`, booking);
  return response.data;
};

// 删除预订
export const deleteBooking = async (id: number) => {
  await api.delete(`/api/bookings/${id}`);
  return id;
}; 