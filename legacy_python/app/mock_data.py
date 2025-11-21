from datetime import datetime, timedelta
from typing import List
from .models import Quiz, QuizQuestion, QuestionType, Lead, QuizSession

def create_mock_quizzes() -> List[Quiz]:
    return [
        Quiz(
            name="Marketing Strategy Quiz",
            slug="marketing-strategy",
            description="Assess your marketing maturity.",
            is_active=True
        ),
        Quiz(
            name="Product Fit Quiz",
            slug="product-fit",
            description="Find the right product for you.",
            is_active=True
        )
    ]

def create_mock_questions(quiz_id: str) -> List[QuizQuestion]:
    return [
        QuizQuestion(
            quiz_id=quiz_id,
            question_text="What is your primary marketing goal?",
            question_type=QuestionType.MULTIPLE_CHOICE,
            question_order=1,
            answers=[
                {"value": "leads", "label": "Generate Leads"},
                {"value": "brand", "label": "Build Brand Awareness"},
                {"value": "sales", "label": "Drive Sales"}
            ],
            is_active=True
        ),
        QuizQuestion(
            quiz_id=quiz_id,
            question_text="How large is your team?",
            question_type=QuestionType.MULTIPLE_CHOICE,
            question_order=2,
            answers=[
                {"value": "1-10", "label": "1-10 Employees"},
                {"value": "11-50", "label": "11-50 Employees"},
                {"value": "50+", "label": "50+ Employees"}
            ],
            is_active=True
        )
    ]
