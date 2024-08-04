from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, text, ForeignKey
from sqlalchemy.orm import relationship, backref
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)

    # Define relationship with Note
    notes = relationship("Note", back_populates="owner")


class NoteVersion(Base):
    __tablename__ = "note_versions"

    id = Column(Integer, primary_key=True, nullable=False)
    note_id = Column(Integer, ForeignKey('notes.id', ondelete='CASCADE'), nullable=False)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'), nullable=False)


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    latest_version_id = Column(Integer, ForeignKey('note_versions.id', ondelete='SET NULL'))
    created_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))

    # Define relationship with User
    owner = relationship("User", back_populates="notes")

    # Relationship to latest_version
    latest_version = relationship('NoteVersion', foreign_keys=[latest_version_id])
