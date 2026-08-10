from sqlalchemy import Column, BigInteger, String, Text, Numeric, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from app.core.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), default="STUDENT")
    status = Column(String(20), default="ACTIVE")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class Question(Base):
    __tablename__ = "questions"

    id = Column(BigInteger, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    choices = Column(JSON, nullable=False)
    correct_answer = Column(String(255), nullable=False)
    subject = Column(String(50), nullable=False, index=True)
    topic = Column(String(100), index=True)
    difficulty = Column(String(20), default="MEDIUM", index=True)
    explanation = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Test(Base):
    __tablename__ = "tests"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Numeric(5, 2), default=0.00)
    status = Column(String(20), default="IN_PROGRESS", index=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))

class UserAnswer(Base):
    __tablename__ = "user_answers"

    id = Column(BigInteger, primary_key=True, index=True)
    test_id = Column(BigInteger, ForeignKey("tests.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(BigInteger, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    user_answer = Column(String(255))
    is_correct = Column(Boolean, default=False)
    answered_at = Column(DateTime(timezone=True), server_default=func.now())

class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    target_score = Column(Numeric(5, 2))
    total_days = Column(Integer, nullable=False)
    current_day = Column(Integer, default=1)
    status = Column(String(20), default="ACTIVE")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class PlanTask(Base):
    __tablename__ = "plan_tasks"

    id = Column(BigInteger, primary_key=True, index=True)
    plan_id = Column(BigInteger, ForeignKey("study_plans.id", ondelete="CASCADE"), nullable=False)
    day_no = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    type = Column(String(20), default="READING")
    ref_id = Column(BigInteger)
    status = Column(String(20), default="PENDING")
    created_at = Column(DateTime(timezone=True), server_default=func.now())