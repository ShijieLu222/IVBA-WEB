import api from './config';
import { Venue } from '../types/venue';

// 获取所有场地
export const getVenues = async () => {
  const response = await api.get('/venues');
  return response.data;
};

// 获取单个场地
export const getVenue = async (id: string) => {
  const response = await api.get(`/venues/${id}`);
  return response.data;
};

// 创建场地
export const createVenue = async (venue: Omit<Venue, 'id' | 'createdAt' | 'lastModified'>) => {
  const response = await api.post('/venues', venue);
  return response.data;
};

// 更新场地
export const updateVenue = async (id: string, venue: Partial<Venue>) => {
  const response = await api.put(`/venues/${id}`, venue);
  return response.data;
};

// 删除场地
export const deleteVenue = async (id: string) => {
  await api.delete(`/venues/${id}`);
  return id;
};