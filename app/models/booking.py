from sqlalchemy import Column, Integer, String, DateTime, Date, Time, ForeignKey, Enum
from sqlalchemy.sql import func
from typing import Optional
from datetime import date, time
from ..database import Base
from .enums import BookingStatus

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    venue_id = Column(Integer, ForeignKey("venues.id"), nullable=False)
    booking_date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.pending)
    user_name = Column(String(255))
    contact_info = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    def __init__(
        self,
        venue_id: int,
        booking_date: date,
        start_time: time,
        end_time: time,
        status: BookingStatus = BookingStatus.pending,
        user_name: Optional[str] = None,
        contact_info: Optional[str] = None
    ):
        self.venue_id = venue_id
        self.booking_date = booking_date
        self.start_time = start_time
        self.end_time = end_time
        self.status = status
        self.user_name = user_name
        self.contact_info = contact_info

    def __repr__(self):
        return f"<Booking {self.id} for venue {self.venue_id}>"
