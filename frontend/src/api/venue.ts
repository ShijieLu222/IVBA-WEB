import api from './config';
import { Venue } from '../types/venue';

// Get all venues
export const getVenues = async () => {
  const response = await api.get('/venues');
  return response.data;
};

// Get single venue
export const getVenue = async (id: string) => {
  const response = await api.get(`/venues/${id}`);
  return response.data;
};

// Create venue
export const createVenue = async (venue: Omit<Venue, 'id' | 'createdAt' | 'lastModified'>) => {
  const response = await api.post('/venues', venue);
  return response.data;
};

// Update venue
export const updateVenue = async (id: string, venue: Partial<Venue>) => {
  const response = await api.put(`/venues/${id}`, venue);
  return response.data;
};

// Delete venue
export const deleteVenue = async (id: string) => {
  await api.delete(`/venues/${id}`);
  return id;
};