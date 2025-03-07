from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class VenueBase(BaseModel):
    venue_name: str
    address: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    description: Optional[str] = None
    size_sqm: Optional[float] = None
    price: Optional[float] = None
    maximum_capacity: Optional[int] = None
    currency: Optional[str] = "GBP"             # 新增字段，默认英镑
    facilities: Optional[List] = []               # 新增字段，存放设施信息（列表）
    availability: Optional[List] = []             # 新增字段，存放可用性信息（列表）
    user_has_saved :Optional[bool]= False  # <-- 新增字段
    status: Optional[str] = "ACTIVE"              # 新增字段，默认状态
    user_has_saved: Optional[bool] = False        # 新增字段，用户是否收藏

class VenueCreate(VenueBase):
    pass

class VenueUpdate(VenueBase):
    pass

class VenueInDB(VenueBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
