import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Boolean, Text, ForeignKey, DateTime, Index
from sqlalchemy.orm import relationship

from app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    is_online = Column(Boolean, default=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    last_seen = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    sent_messages = relationship(
        "Message", foreign_keys="Message.sender_id", back_populates="sender", lazy="selectin"
    )
    received_messages = relationship(
        "Message", foreign_keys="Message.receiver_id", back_populates="receiver", lazy="selectin"
    )

    def __repr__(self):
        return f"<User {self.username}>"


class Message(Base):
    __tablename__ = "messages"
    __table_args__ = (
        # Composite index for efficient conversation queries
        Index("ix_messages_conversation", "sender_id", "receiver_id", "created_at"),
    )

    id = Column(String(36), primary_key=True, default=generate_uuid)
    sender_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    receiver_id = Column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_messages")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_messages")

    def __repr__(self):
        return f"<Message {self.id} from={self.sender_id} to={self.receiver_id}>"
