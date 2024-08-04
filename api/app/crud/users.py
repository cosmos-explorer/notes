from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import User
from app.schemas import UserCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def get_user_by_username(session: AsyncSession, username: str):
    result = await session.execute(select(User).filter(User.username == username))
    return result.scalars().first()


async def create_user(session: AsyncSession, user_create: UserCreate):
    hashed_password = get_password_hash(user_create.password)
    user = User(
        username=user_create.username,
        hashed_password=hashed_password,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
