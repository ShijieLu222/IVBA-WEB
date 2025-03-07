from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import venue as venue_model
from ..schemas import venue as venue_schema

router = APIRouter(prefix="/api/venues", tags=["venues"])

@router.get("/", response_model=List[venue_schema.VenueInDB])
def get_venues(
    skip: int = 0, 
    limit: int = 100, 
    name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """获取场地列表，支持分页和按名称搜索"""
    # 断言 db 不会是 None，让 Pyright 知道 db 是一个有效的 Session
    assert db is not None, "db should never be None here"
    
    query = db.query(venue_model.Venue)
    
    # 如果提供了名称参数，进行模糊搜索
    if name:
        query = query.filter(venue_model.Venue.venue_name.ilike(f"%{name}%"))# pyright: ignore[reportOptionalCall]
    
    venues = query.offset(skip).limit(limit).all()# pyright: ignore[reportOptionalCall]
    return venues

@router.get("/{venue_id}", response_model=venue_schema.VenueInDB)
def get_venue(venue_id: int, db: Session = Depends(get_db)):
    """获取单个场地详情"""
    # 断言 db 不会是 None
    assert db is not None, "db should never be None here"
    
    venue = db.query(venue_model.Venue).filter(venue_model.Venue.id == venue_id).first()# pyright: ignore[reportOptionalCall]
    if venue is None:
        raise HTTPException(status_code=404, detail="场地不存在")
    return venue

@router.post("/", response_model=venue_schema.VenueInDB, status_code=201)
def create_venue(venue: venue_schema.VenueCreate, db: Session = Depends(get_db)):
    """创建新场地"""
    # 断言 db 不会是 None
    assert db is not None, "db should never be None here"
    
    db_venue = venue_model.Venue(**venue.dict())
    db.add(db_venue)
    db.commit()
    db.refresh(db_venue)
    return db_venue

@router.put("/{venue_id}", response_model=venue_schema.VenueInDB)
def update_venue(venue_id: int, venue: venue_schema.VenueUpdate, db: Session = Depends(get_db)):
    """更新场地信息"""
    # 断言 db 不会是 None
    assert db is not None, "db should never be None here"
    
    db_venue = db.query(venue_model.Venue).filter(venue_model.Venue.id == venue_id).first()# pyright: ignore[reportOptionalCall]
    if db_venue is None:
        raise HTTPException(status_code=404, detail="场地不存在")
    
    # 更新提供的字段
    update_data = venue.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_venue, key, value)
    
    db.commit()
    db.refresh(db_venue)
    return db_venue

@router.delete("/{venue_id}", status_code=204)
def delete_venue(venue_id: int, db: Session = Depends(get_db)):
    """删除场地"""
    # 断言 db 不会是 None
    assert db is not None, "db should never be None here"
    
    db_venue = db.query(venue_model.Venue).filter(venue_model.Venue.id == venue_id).first()# pyright: ignore[reportOptionalCall]
    if db_venue is None:
        raise HTTPException(status_code=404, detail="场地不存在")
    
    db.delete(db_venue)
    db.commit()
    return None