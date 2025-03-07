from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from ..database import get_db
from ..models import booking as booking_model
from ..schemas import booking as booking_schema
from sqlalchemy import and_, or_

router = APIRouter(prefix="/api/bookings", tags=["bookings"])

@router.get("/", response_model=List[booking_schema.BookingInDB])
def get_bookings(
    skip: int = 0, 
    limit: int = 100, 
    venue_id: Optional[int] = None,
    booking_date: Optional[date] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    获取预订列表 支持按场地ID、日期和状态筛选
    """
    # 断言 db 不会是 None，让 Pyright 知道 db 是一个有效的 Session
    assert db is not None, "db should never be None here"

    query = db.query(booking_model.Booking)
    
    if venue_id:
        query = query.filter(booking_model.Booking.venue_id == venue_id) # pyright: ignore[reportOptionalCall]
    if booking_date:
        query = query.filter(booking_model.Booking.booking_date == booking_date)# pyright: ignore[reportOptionalCall]
    if status:
        query = query.filter(booking_model.Booking.status == booking_model.BookingStatus(status))# pyright: ignore[reportOptionalCall]
    
    bookings = query.offset(skip).limit(limit).all() # pyright: ignore[reportOptionalCall]
    return bookings


@router.get("/{booking_id}", response_model=booking_schema.BookingInDB)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    """获取单个预订详情"""
    assert db is not None, "db should never be None here"
    
    booking = db.query(booking_model.Booking).filter(booking_model.Booking.id == booking_id).first()# pyright: ignore[reportOptionalCall]
    if booking is None:
        raise HTTPException(status_code=404, detail="预订不存在")
    return booking

@router.post("/", response_model=booking_schema.BookingInDB, status_code=201)
def create_booking(booking: booking_schema.BookingCreate, db: Session = Depends(get_db)):
    """创建新预订，需检查时间冲突"""
    assert db is not None, "db should never be None here"
    
    # 检查时间冲突
    conflicts = check_booking_conflicts(
        db=db,
        venue_id=booking.venue_id,
        booking_date=booking.booking_date,
        start_time=booking.start_time,
        end_time=booking.end_time,
        booking_id=None  # 新预订，没有ID
    )
    
    if conflicts:
        raise HTTPException(
            status_code=400, 
            detail="该时间段已被预订，请选择其他时间"
        )
    
    # 创建新预订
    db_booking = booking_model.Booking(
        venue_id=booking.venue_id,
        booking_date=booking.booking_date,
        start_time=booking.start_time,
        end_time=booking.end_time,
        user_name=booking.user_name,
        contact_info=booking.contact_info,
        status=booking_model.BookingStatus.pending
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.put("/{booking_id}", response_model=booking_schema.BookingInDB)
def update_booking(booking_id: int, booking: booking_schema.BookingUpdate, db: Session = Depends(get_db)):
    """更新预订信息"""
    assert db is not None, "db should never be None here"
    
    db_booking = db.query(booking_model.Booking).filter(booking_model.Booking.id == booking_id).first()# pyright: ignore[reportOptionalCall]
    if db_booking is None:
        raise HTTPException(status_code=404, detail="预订不存在")
    
    # 如果更新了日期或时间，需要检查冲突
    update_data = booking.dict(exclude_unset=True)
    if any(field in update_data for field in ["booking_date", "start_time", "end_time"]):
        # 获取更新后的值或使用现有值
        booking_date = update_data.get("booking_date", db_booking.booking_date)
        start_time = update_data.get("start_time", db_booking.start_time)
        end_time = update_data.get("end_time", db_booking.end_time)
        
        conflicts = check_booking_conflicts(
            db=db,
            venue_id=db_booking.venue_id,
            booking_date=booking_date,
            start_time=start_time,
            end_time=end_time,
            booking_id=booking_id  # 排除当前预订
        )
        
        if conflicts:
            raise HTTPException(
                status_code=400, 
                detail="该时间段已被预订，请选择其他时间"
            )
    
    # 更新提供的字段
    if "status" in update_data:
        update_data["status"] = booking_model.BookingStatus(update_data["status"])
    
    for key, value in update_data.items():
        setattr(db_booking, key, value)
    
    db.commit()
    db.refresh(db_booking)
    return db_booking

@router.delete("/{booking_id}", status_code=204)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    """取消或删除预订"""
    assert db is not None, "db should never be None here"
    
    db_booking = db.query(booking_model.Booking).filter(booking_model.Booking.id == booking_id).first()# pyright: ignore[reportOptionalCall]
    if db_booking is None:
        raise HTTPException(status_code=404, detail="预订不存在")
    
    db.delete(db_booking)
    db.commit()
    return None

# 辅助函数：检查预订时间冲突
def check_booking_conflicts(db: Session, venue_id: int, booking_date: date, 
                          start_time, end_time, booking_id: Optional[int] = None) -> bool:
    """检查指定场地在给定日期和时间段是否有冲突的预订"""
    assert db is not None, "db should never be None here"
    
    query = db.query(booking_model.Booking).filter(
        booking_model.Booking.venue_id == venue_id,
        booking_model.Booking.booking_date == booking_date,
        booking_model.Booking.status != booking_model.BookingStatus.cancelled,
        or_(
            and_(booking_model.Booking.start_time <= start_time, booking_model.Booking.end_time > start_time),
            and_(booking_model.Booking.start_time < end_time, booking_model.Booking.end_time >= end_time),
            and_(booking_model.Booking.start_time >= start_time, booking_model.Booking.end_time <= end_time)
        )
    )# pyright: ignore[reportOptionalCall]
    
    # 如果是更新现有预订，排除自身
    if booking_id is not None:
        query = query.filter(booking_model.Booking.id != booking_id)
    
    return query.first() is not None