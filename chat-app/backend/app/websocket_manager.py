import json
from typing import Dict

from fastapi import WebSocket


class ConnectionManager:
    """
    Manages active WebSocket connections.
    Maps user_id -> WebSocket for online users.
    Handles connect, disconnect, and targeted message delivery.
    """

    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        """Accept a WebSocket connection and register the user."""
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: str):
        """Remove a user's WebSocket connection."""
        self.active_connections.pop(user_id, None)

    def is_online(self, user_id: str) -> bool:
        """Check if a user has an active WebSocket connection."""
        return user_id in self.active_connections

    async def send_personal_message(self, user_id: str, message: dict):
        """Send a JSON message to a specific connected user."""
        websocket = self.active_connections.get(user_id)
        if websocket:
            await websocket.send_json(message)

    async def broadcast_status(self, user_id: str, is_online: bool):
        """Notify all connected users about a user's online/offline status."""
        status_msg = {
            "type": "status",
            "user_id": str(user_id),
            "is_online": is_online,
        }
        for uid, ws in self.active_connections.items():
            if uid != user_id:
                try:
                    await ws.send_json(status_msg)
                except Exception:
                    # Connection may have dropped; will be cleaned up on next disconnect
                    pass

    def get_online_user_ids(self) -> list[str]:
        """Return a list of all currently connected user IDs."""
        return list(self.active_connections.keys())


# Singleton instance used across the application
manager = ConnectionManager()
