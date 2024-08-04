from typing import Optional, List

from sqlalchemy import delete, desc
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models import Note, NoteVersion
from app.schemas import NoteUpdate, NoteCreate


async def get_user_notes(session: AsyncSession, user_id: int, title: Optional[str] = None):
    query = (
        select(Note)
        .filter(Note.user_id == user_id)
        .join(Note.latest_version)
        .options(joinedload(Note.latest_version))
    )

    if title:
        query = query.filter(Note.title.ilike(f"%{title}%"))

    query = query.order_by(desc(Note.created_at))

    result = await session.execute(query)
    return result.scalars().all()


async def get_note_by_id(session: AsyncSession, note_id: int, user_id: int):
    query = select(Note).filter(Note.id == note_id, Note.user_id == user_id)
    result = await session.execute(query)
    return result.scalar_one_or_none()


async def create_note(session: AsyncSession, note_create: NoteCreate, user_id: int):
    new_note = Note(user_id=user_id)
    session.add(new_note)
    await session.commit()
    await session.refresh(new_note)

    new_version = NoteVersion(note_id=new_note.id, title=note_create.title, content=note_create.content)
    session.add(new_version)
    await session.commit()
    await session.refresh(new_version)

    new_note.latest_version_id = new_version.id
    session.add(new_note)
    await session.commit()

    new_note.latest_version = new_version
    return new_note


async def update_note(session: AsyncSession, note_id: int, note_update: NoteUpdate, user_id: int):
    new_version = NoteVersion(note_id=note_id, title=note_update.title, content=note_update.content)
    session.add(new_version)
    await session.commit()
    await session.refresh(new_version)

    note = await session.get(Note, note_id)
    note.latest_version_id = new_version.id
    await session.commit()

    note.latest_version = new_version
    return note


async def delete_note(session: AsyncSession, note_id: int, user_id: int):
    query = delete(Note).where(Note.id == note_id, Note.user_id == user_id)
    result = await session.execute(query)
    await session.commit()
    return result.rowcount


async def fetch_note_versions(session: AsyncSession, note_id: int) -> List[NoteVersion]:
    query = (
        select(NoteVersion)
        .filter(NoteVersion.note_id == note_id)
        .order_by(NoteVersion.created_at.desc())
    )
    result = await session.execute(query)
    return result.scalars().all()
