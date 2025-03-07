export interface Booking {
  id: number;
  venue_id: number;
  booking_date: string; // 格式: YYYY-MM-DD
  start_time: string; // 格式: HH:MM:SS
  end_time: string; // 格式: HH:MM:SS
  user_name: string;
  contact_info: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface BookingCreate {
  venue_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  user_name: string;
  contact_info: string;
}

export interface BookingUpdate {
  booking_date?: string;
  start_time?: string;
  end_time?: string;
  user_name?: string;
  contact_info?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
} 