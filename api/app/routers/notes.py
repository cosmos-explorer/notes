from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import Note, User, NoteCreate, NoteUpdate, NoteVersion
from app.crud.notes import get_user_notes, create_note, get_note_by_id, update_note, delete_note, fetch_note_versions
from app.auth import get_current_active_user
from app.dependencies import get_db
from typing import List, Optional

router = APIRouter(
    prefix="/notes",
    tags=["notes"],
)


def map_note(note):
    return {
        "user_id": note.user_id,
        "title": note.latest_version.title,
        "content": note.latest_version.content,
        "id": str(note.id),
        "created_at": note.created_at  # Format created_at as ISO string
    }


@router.get("/", response_model=List[Note])
async def list_notes(
        title: Optional[str] = Query(None, max_length=50),
        session: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    notes = await get_user_notes(session, current_user.id, title)

    # Map the notes to the desired format
    mapped_notes = [map_note(note) for note in notes]

    return mapped_notes


@router.post("/")
async def create_new_note(note_create: NoteCreate, session: AsyncSession = Depends(get_db),
                          current_user: dict = Depends(get_current_active_user)):
    note = await create_note(session, note_create, current_user.id)
    return map_note(note)


@router.put("/{note_id}", response_model=Note)
async def modify_note(note_id: int, note_update: NoteUpdate, session: AsyncSession = Depends(get_db),
                      current_user: dict = Depends(get_current_active_user)):
    note = await get_note_by_id(session, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    updated_note = await update_note(session, note_id, note_update, current_user.id)
    if not updated_note:
        raise HTTPException(status_code=404, detail="Note not found or not authorized")
    return map_note(updated_note)


@router.delete("/{note_id}", response_model=dict)
async def delete_existing_note(note_id: int, session: AsyncSession = Depends(get_db),
                               current_user: dict = Depends(get_current_active_user)):
    note = await get_note_by_id(session, note_id, current_user.id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    rows_deleted = await delete_note(session, note_id, current_user.id)
    if rows_deleted == 0:
        raise HTTPException(status_code=404, detail="Note not found or not authorized")
    return {"msg": "Note deleted successfully"}


@router.get("/{note_id}/versions", response_model=List[NoteVersion])
async def list_versions(
        note_id: int,
        session: AsyncSession = Depends(get_db),
        current_user: User = Depends(get_current_active_user)
):
    versions = await fetch_note_versions(session, note_id)
    if not versions:
        return []

    return versions
