from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

# ✅ 修复：明确告诉 FastAPI 服务器是 HTTPS
app = FastAPI(
    title="场地预订系统API",
    description="场地预订系统的后端API服务",
    version="1.0.0",
    servers=[  # 确保 FastAPI 知道它运行在 HTTPS
        {"url": "https://ivba-web-production.up.railway.app", "description": "Production server"}
    ]
)

# ✅ 修复：确保 CORS 允许 Vercel 访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ivba-web.vercel.app"],  # 确保 Vercel 可以访问
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 修复：确保 FastAPI 识别 HTTPS 代理请求
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

@app.get("/")
async def root():
    return {"message": "欢迎使用场地预订系统API"}

# ✅ 修复：确保 Uvicorn 运行时正确识别代理
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, forwarded_allow_ips="*", proxy_headers=True)
