from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import hash_password, verify_password, create_access_token
from app.database import get_db
from app.models import User
from app.schemas import UserRegister, UserLogin, Token, UserOut

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister, db: AsyncSession = Depends(get_db)):
    """Register a new user account."""
    # Check if username already exists
    existing = await db.execute(
        select(User).where(
            (User.username == payload.username) | (User.email == payload.email)
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already registered",
        )

    # Create user
    user = User(
        username=payload.username,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)

    return user


@router.post("/login", response_model=Token)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    """Authenticate a user and return a JWT access token."""
    result = await db.execute(select(User).where(User.email == payload.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(user.id)
    return Token(access_token=access_token)
