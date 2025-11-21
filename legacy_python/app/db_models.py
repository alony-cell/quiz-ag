from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, JSON, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    name = Column(String)
    description = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    questions = relationship("QuizQuestion", back_populates="quiz")
    leads = relationship("Lead", back_populates="quiz")

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    question_text = Column(String)
    question_type = Column(String)
    question_order = Column(Integer)
    answers = Column(JSON) # Storing answers as JSON for simplicity
    is_active = Column(Boolean, default=True)

    quiz = relationship("Quiz", back_populates="questions")

class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    email = Column(String, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    submission_date = Column(DateTime, default=datetime.utcnow)

    quiz = relationship("Quiz", back_populates="leads")
