import json
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import decode_access_token
from app.database import AsyncSessionLocal
from app.models import User, Message
from app.schemas import WSMessageOut
from app.websocket_manager import manager

router = APIRouter(tags=["Chat WebSocket"])


@router.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    """
    WebSocket endpoint for real-time chat.
    
    Authentication: pass JWT as a query parameter ?token=xxx
    
    Protocol:
    - Client sends: {"type": "message", "receiver_id": "uuid", "content": "text"}
    - Server sends: {"type": "message", "id": "uuid", "sender_id": "uuid", 
                      "receiver_id": "uuid", "content": "text", "created_at": "iso"}
    - Server sends: {"type": "status", "user_id": "uuid", "is_online": bool}
    """
    # ── Authenticate via query param ────────────────────────────
    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=4001, reason="Missing authentication token")
        return

    user_id = decode_access_token(token)
    if not user_id:
        await websocket.close(code=4001, reason="Invalid or expired token")
        return

    # ── Connect ─────────────────────────────────────────────────
    await manager.connect(user_id, websocket)

    # Update user online status in DB
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user:
            user.is_online = True
            await db.commit()

    # Broadcast online status to other users
    await manager.broadcast_status(user_id, is_online=True)

    try:
        while True:
            # ── Receive message ─────────────────────────────────
            raw_data = await websocket.receive_text()
            try:
                data = json.loads(raw_data)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "detail": "Invalid JSON"})
                continue

            msg_type = data.get("type", "message")

            if msg_type == "message":
                receiver_id_str = data.get("receiver_id")
                content = data.get("content", "").strip()

                if not receiver_id_str or not content:
                    await websocket.send_json(
                        {"type": "error", "detail": "Missing receiver_id or content"}
                    )
                    continue

                receiver_id = receiver_id_str.strip()
                if len(receiver_id) != 36:
                    await websocket.send_json(
                        {"type": "error", "detail": "Invalid receiver_id format"}
                    )
                    continue

                # ── Persist message to database ─────────────────
                async with AsyncSessionLocal() as db:
                    message = Message(
                        sender_id=user_id,
                        receiver_id=receiver_id,
                        content=content,
                    )
                    db.add(message)
                    await db.flush()
                    await db.refresh(message)
                    await db.commit()

                    # Build response payload
                    msg_out = {
                        "type": "message",
                        "id": str(message.id),
                        "sender_id": str(message.sender_id),
                        "receiver_id": str(message.receiver_id),
                        "content": message.content,
                        "created_at": message.created_at.isoformat(),
                    }

                # ── Deliver to receiver (if online) ─────────────
                await manager.send_personal_message(receiver_id, msg_out)

                # ── Confirm to sender ────────────────────────────
                await manager.send_personal_message(user_id, msg_out)

    except WebSocketDisconnect:
        pass
    finally:
        # ── Disconnect cleanup ──────────────────────────────────
        manager.disconnect(user_id)

        async with AsyncSessionLocal() as db:
            result = await db.execute(select(User).where(User.id == user_id))
            user = result.scalar_one_or_none()
            if user:
                user.is_online = False
                user.last_seen = datetime.now(timezone.utc)
                await db.commit()

        await manager.broadcast_status(user_id, is_online=False)
