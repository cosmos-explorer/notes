from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import UserCreate, User, Token, LoginRequest
from app.crud.users import create_user, get_user_by_username, verify_password
from app.auth import create_access_token, get_current_active_user, ACCESS_TOKEN_EXPIRE_MINUTES, oauth2_scheme
from app.dependencies import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.post("/signup", response_model=Token)
async def signup(user_create: UserCreate, session: AsyncSession = Depends(get_db)):
    db_user = await get_user_by_username(session, user_create.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="username already registered",
        )
    new_user = await create_user(session, user_create)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signin", response_model=Token)
async def login_for_access_token(login_request: LoginRequest,
                                 session: AsyncSession = Depends(get_db)):
    user = await get_user_by_username(session, login_request.username)
    if not user or not verify_password(login_request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/profile", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user
