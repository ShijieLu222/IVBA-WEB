from sqlalchemy import Column, Integer, String
from ..database import Base
from passlib.context import CryptContext

# 创建密码哈希工具
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))
    is_admin = Column(Integer, default=0)  # 0: 普通用户, 1: 管理员

    def __init__(self, username: str, hashed_password: str, is_admin: int = 0):
        self.username = username
        self.hashed_password = hashed_password
        self.is_admin = is_admin

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)