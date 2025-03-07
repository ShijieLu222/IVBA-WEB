from app.database import SessionLocal
from app.models.user import User

# 创建数据库会话
db = SessionLocal()

# 删除现有的管理员用户
existing_admin = db.query(User).filter(User.username == 'admin').first()# pyright: ignore[reportOptionalCall]

if existing_admin:
    print('正在删除现有的管理员用户...')
    db.delete(existing_admin)
    db.commit()
    print('管理员用户已删除')

# 创建新的管理员用户
admin = User(
    username='admin',
    hashed_password=User.get_password_hash('123456'),
    is_admin=1  # 1表示管理员
)

# 添加到数据库并提交
db.add(admin)
db.commit()
print('新的管理员用户已创建，用户名: admin，密码: 123456')

# 关闭数据库会话
db.close()