# 场地预订管理系统

## 项目简介
本项目是一个基于现代Web技术栈开发的场地预订管理系统，提供场地信息管理和预订服务管理功能。

## 技术栈
### 前端
- React + TypeScript
- Redux (Redux Toolkit)
- Axios
- Ant Design

### 后端
- Python FastAPI
- SQLAlchemy ORM
- MySQL 数据库

## 主要功能
- 场地管理（CRUD操作）
- 预订管理（CRUD操作）
- 数据验证与错误处理
- API文档（Swagger UI）

## 项目结构
```
├── frontend/          # 前端React项目
└── backend/           # 后端FastAPI项目
```

## 开发环境要求
- Node.js >= 16
- Python >= 3.8
- MySQL >= 8.0

## 启动说明
### 前端
```bash
cd frontend
npm install
npm run dev
```

### 后端
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```