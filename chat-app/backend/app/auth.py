from datetime import datetime, timedelta, timezone
from typing import Optional
import uuid

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ─── Password Utilities ────────────────────────────────────────

def hash_password(password: str) -> str:
    """Hash a plaintext password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plaintext password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ─── JWT Utilities ──────────────────────────────────────────────

def create_access_token(user_id: str, expires_delta: Optional[timedelta] = None) -> str:
    """Create a signed JWT containing the user's ID."""
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> Optional[str]:
    """
    Decode and validate a JWT. Returns the user_id (string) if valid,
    or None if the token is invalid/expired.
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            return None
        return user_id_str
    except (JWTError, ValueError):
        return None
