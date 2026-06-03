import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ─── Auth Schemas ───────────────────────────────────────────────

class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_]+$")
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: Optional[uuid.UUID] = None


# ─── User Schemas ───────────────────────────────────────────────

class UserOut(BaseModel):
    id: uuid.UUID
    username: str
    email: EmailStr
    avatar_url: Optional[str] = None
    is_online: bool = False
    created_at: datetime
    last_seen: Optional[datetime] = None

    model_config = {"from_attributes": True}


class UserBrief(BaseModel):
    """Lightweight user representation for contact lists."""
    id: uuid.UUID
    username: str
    avatar_url: Optional[str] = None
    is_online: bool = False
    last_seen: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ─── Message Schemas ────────────────────────────────────────────

class MessageCreate(BaseModel):
    receiver_id: uuid.UUID
    content: str = Field(..., min_length=1, max_length=5000)


class MessageOut(BaseModel):
    id: uuid.UUID
    sender_id: uuid.UUID
    receiver_id: uuid.UUID
    content: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── WebSocket Schemas ──────────────────────────────────────────

class WSMessageIn(BaseModel):
    """Incoming WebSocket message from client."""
    type: str = "message"
    receiver_id: uuid.UUID
    content: str = Field(..., min_length=1, max_length=5000)


class WSMessageOut(BaseModel):
    """Outgoing WebSocket message to client."""
    type: str = "message"
    id: uuid.UUID
    sender_id: uuid.UUID
    receiver_id: uuid.UUID
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class WSStatusOut(BaseModel):
    """Online status notification."""
    type: str = "status"
    user_id: uuid.UUID
    is_online: bool
