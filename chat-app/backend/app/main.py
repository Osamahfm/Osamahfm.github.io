from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.routers import auth_router, users_router, messages_router, chat_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: runs on startup and shutdown."""
    # Startup: create tables if they don't exist
    await init_db()
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title="Chat App API",
    description="Real-time chat application backend with WebSocket support",
    version="1.0.0",
    lifespan=lifespan,
)

# ─── CORS Middleware ────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register Routers ──────────────────────────────────────────
app.include_router(auth_router.router)
app.include_router(users_router.router)
app.include_router(messages_router.router)
app.include_router(chat_router.router)


@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "ok", "message": "Chat App API is running"}
