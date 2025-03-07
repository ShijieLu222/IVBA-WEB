from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date, time
from enum import Enum

class BookingStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"

class BookingBase(BaseModel):
    venue_id: int
    booking_date: date
    start_time: time
    end_time: time
    user_name: Optional[str] = None
    contact_info: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    booking_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    status: Optional[BookingStatus] = None
    user_name: Optional[str] = None
    contact_info: Optional[str] = None

class BookingInDB(BookingBase):
    id: int
    status: BookingStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        use_enum_values = True  # 使用枚举的原始值（字符串）
