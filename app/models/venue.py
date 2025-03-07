from sqlalchemy import Column, Boolean,Integer, String, Text, DateTime, Float, Enum, JSON
from sqlalchemy.sql import func
from ..database import Base

class Venue(Base):
    __tablename__ = "venues"

    id = Column(Integer, primary_key=True, index=True)
    venue_name = Column(String(255), nullable=False)
    address = Column(String(255))
    contact_name = Column(String(255))
    contact_email = Column(String(255))
    contact_phone = Column(String(50))
    description = Column(Text)
    size_sqm = Column(Float)
    price = Column(Float)
    currency = Column(String(10), default="GDB")  # 新增字段
    maximum_capacity = Column(Integer)
    facilities = Column(JSON, default=[])  # 新增字段
    availability = Column(JSON, default=[])  # 新增字段
    user_has_saved = Column(Boolean, default=False)  # 新增字段
    status = Column(Enum("ACTIVE", "INACTIVE", "PENDING"), default="ACTIVE")  # 新增字段
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<Venue {self.venue_name}>"
