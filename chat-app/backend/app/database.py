from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

# SQLite requires check_same_thread=False for async usage
connect_args = {}
if "sqlite" in settings.DATABASE_URL:
    connect_args["check_same_thread"] = False

engine = create_async_engine(
    settings.DATABASE_URL, echo=False, future=True, connect_args=connect_args
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    """Base class for all ORM models."""
    pass


async def get_db():
    """FastAPI dependency — yields an async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Create all tables (used for development; Alembic handles production)."""
    async with engine.begin() as conn:
        from app import models  # noqa: F401 — ensure models are imported
        await conn.run_sync(Base.metadata.create_all)
