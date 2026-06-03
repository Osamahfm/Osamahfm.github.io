from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_user
from app.models import User
from app.schemas import UserOut, UserBrief

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get the currently authenticated user's profile."""
    return current_user


@router.get("", response_model=list[UserBrief])
async def get_users(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get all registered users (contact list).
    Excludes the currently authenticated user.
    """
    result = await db.execute(
        select(User)
        .where(User.id != current_user.id)
        .order_by(User.username)
    )
    users = result.scalars().all()
    return users
