from enum import Enum
from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from app.db import Base

class UserRole(str, Enum):
    ADMIN="Admin"
    TEACHER="Teacher"
    STUDENT="Student"
    PARENT="Parent"

class User(Base):
    __tablename__="users"
    id: Mapped[int]=mapped_column(primary_key=True)
    email: Mapped[str]=mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str]=mapped_column(String(150), nullable=False)
    password_hash: Mapped[str]=mapped_column(String(255), nullable=False)
    role: Mapped[UserRole]=mapped_column(SAEnum(UserRole), default=UserRole.STUDENT, nullable=False)
    is_active: Mapped[bool]=mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime]=mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
