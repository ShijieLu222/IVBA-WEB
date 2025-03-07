from app.database import SessionLocal
from app.models.user import User

# 创建数据库会话
db = SessionLocal()

# 检查管理员用户是否已存在
existing_admin = db.query(User).filter(User.username == 'admin').first()# pyright: ignore[reportOptionalCall]

if existing_admin:
    print('管理员用户已存在')
else:
    # 创建管理员用户
    admin = User(
        username='admin',
        hashed_password=User.get_password_hash('123456'),
        is_admin=1  # 1表示管理员
    )
    
    # 添加到数据库并提交
    db.add(admin)
    db.commit()
    print('管理员用户已创建')

# 关闭数据库会话
db.close()