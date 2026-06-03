import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_user
from app.models import User, Message
from app.schemas import MessageOut

router = APIRouter(prefix="/api/messages", tags=["Messages"])


@router.get("/{user_id}", response_model=list[MessageOut])
async def get_message_history(
    user_id: uuid.UUID,
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get message history between the current user and another user.
    Returns messages ordered by creation time (oldest first),
    with pagination support.
    """
    result = await db.execute(
        select(Message)
        .where(
            or_(
                and_(
                    Message.sender_id == current_user.id,
                    Message.receiver_id == user_id,
                ),
                and_(
                    Message.sender_id == user_id,
                    Message.receiver_id == current_user.id,
                ),
            )
        )
        .order_by(Message.created_at.asc())
        .offset(offset)
        .limit(limit)
    )
    messages = result.scalars().all()

    # Mark received messages as read
    for msg in messages:
        if msg.receiver_id == current_user.id and not msg.is_read:
            msg.is_read = True

    return messages
