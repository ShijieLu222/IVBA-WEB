from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.user import User
from ..schemas.user import UserCreate, UserInDB
from .auth import get_current_active_user

router = APIRouter(prefix="/api/users", tags=["users"])

# 创建新用户（仅管理员可用）
@router.post("/", response_model=UserInDB, status_code=201)
async def create_user(
    user: UserCreate, 
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """创建新用户（仅管理员可用）"""
    # 检查当前用户是否为管理员
    if current_user.is_admin != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足，只有管理员可以创建用户"
        )
    
    # 检查用户名是否已存在
    db_user = db.query(User).filter(User.username == user.username).first() # pyright: ignore[reportOptionalCall]
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="用户名已存在"
        )
    
    # 创建新用户
    hashed_password = User.get_password_hash(user.password)
    db_user = User(
        username=user.username,
        hashed_password=hashed_password,
        is_admin=0  # 默认创建普通用户
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# 获取所有用户（仅管理员可用）
@router.get("/", response_model=List[UserInDB])
async def get_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: UserInDB = Depends(get_current_active_user)
):
    """获取所有用户（仅管理员可用）"""
    # 检查当前用户是否为管理员
    if current_user.is_admin != 1:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足，只有管理员可以查看所有用户"
        )
    
    users = db.query(User).offset(skip).limit(limit).all() # pyright: ignore[reportOptionalCall]
    return users