from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import venue, booking
from .models.venue import Venue
from .models.booking import Booking  # 导入所有模型

# 创建数据库表
Base.metadata.create_all(bind=engine)  # type: ignore

# 创建FastAPI应用
app = FastAPI(
    title="场地预订系统API",
    description="场地预订系统的后端API服务",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 允许所有来源，您可以根据需要限制
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(venue.router)
app.include_router(booking.router)

@app.get("/")
async def root():
    return {"message": "欢迎使用场地预订系统API"}