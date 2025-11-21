from fastapi import FastAPI, Request, Depends, Form
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from app import models, db_models
from app.database import SessionLocal, engine, get_db

# Create Tables
db_models.Base.metadata.create_all(bind=engine)

# Seed Data
def seed_data():
    db = SessionLocal()
    if db.query(db_models.Quiz).count() == 0:
        from app.mock_data import create_mock_quizzes, create_mock_questions
        
        # Seed Quizzes
        mock_quizzes = create_mock_quizzes()
        for q in mock_quizzes:
            db_quiz = db_models.Quiz(
                name=q.name,
                slug=q.slug,
                description=q.description,
                is_active=q.is_active
            )
            db.add(db_quiz)
            db.commit()
            db.refresh(db_quiz)
            
            # Seed Questions
            mock_questions = create_mock_questions(q.slug)
            for question in mock_questions:
                db_question = db_models.QuizQuestion(
                    quiz_id=db_quiz.id,
                    question_text=question.question_text,
                    question_type=question.question_type,
                    question_order=question.question_order,
                    answers=question.answers,
                    is_active=question.is_active
                )
                db.add(db_question)
            db.commit()
    db.close()

seed_data()

app = FastAPI(title="Quiz Platform")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates
templates = Jinja2Templates(directory="templates")

# Mock Data Removed

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("base.html", {"request": request, "title": "Quiz Platform"})

from fastapi import Form
from fastapi.responses import RedirectResponse
from app.models import Quiz

@app.get("/admin/dashboard", response_class=HTMLResponse)
async def admin_dashboard(request: Request, db: Session = Depends(get_db)):
    quizzes = db.query(db_models.Quiz).all()
    total_quizzes = len(quizzes)
    total_leads = db.query(db_models.Lead).count()
    return templates.TemplateResponse("admin/dashboard.html", {
        "request": request, 
        "quizzes": quizzes, 
        "total_quizzes": total_quizzes,
        "total_leads": total_leads,
        "title": "Admin Dashboard"
    })

@app.get("/admin/analytics", response_class=HTMLResponse)
async def analytics_dashboard(request: Request, db: Session = Depends(get_db)):
    # Calculate top quizzes by lead count
    quizzes = db.query(db_models.Quiz).all()
    quiz_stats = []
    for quiz in quizzes:
        lead_count = db.query(db_models.Lead).filter(db_models.Lead.quiz_id == quiz.id).count()
        quiz_stats.append({"name": quiz.name, "lead_count": lead_count})
    
    # Sort by lead count desc
    quiz_stats.sort(key=lambda x: x["lead_count"], reverse=True)
    
    return templates.TemplateResponse("admin/analytics.html", {
        "request": request, 
        "top_quizzes": quiz_stats[:5],
        "title": "Analytics"
    })

@app.get("/admin/quizzes/new", response_class=HTMLResponse)
async def new_quiz(request: Request):
    return templates.TemplateResponse("admin/quiz_editor.html", {"request": request, "quiz": None, "title": "New Quiz"})

@app.post("/admin/quizzes/new")
async def create_quiz(
    name: str = Form(...), 
    slug: str = Form(...), 
    description: str = Form(None), 
    is_active: bool = Form(False),
    db: Session = Depends(get_db)
):
    new_quiz = db_models.Quiz(name=name, slug=slug, description=description, is_active=is_active)
    db.add(new_quiz)
    db.commit()
    db.refresh(new_quiz)
    return RedirectResponse(url="/admin/dashboard", status_code=303)

@app.get("/admin/quizzes/{slug}/edit", response_class=HTMLResponse)
async def edit_quiz(request: Request, slug: str, db: Session = Depends(get_db)):
    quiz = db.query(db_models.Quiz).filter(db_models.Quiz.slug == slug).first()
    if not quiz:
        return HTMLResponse("Quiz not found", status_code=404)
    return templates.TemplateResponse("admin/quiz_editor.html", {"request": request, "quiz": quiz, "title": "Edit Quiz"})

@app.post("/admin/quizzes/{slug}/edit")
async def update_quiz(
    slug: str, 
    name: str = Form(...), 
    description: str = Form(None), 
    is_active: bool = Form(False),
    db: Session = Depends(get_db)
):
    quiz = db.query(db_models.Quiz).filter(db_models.Quiz.slug == slug).first()
    if quiz:
        quiz.name = name
        quiz.description = description
        quiz.is_active = is_active
        db.commit()
    return RedirectResponse(url="/admin/dashboard", status_code=303)

from app.models import QuizQuestion, QuestionType

@app.get("/admin/quizzes/{slug}/questions", response_class=HTMLResponse)
async def list_questions(request: Request, slug: str, db: Session = Depends(get_db)):
    quiz = db.query(db_models.Quiz).filter(db_models.Quiz.slug == slug).first()
    if not quiz:
        return HTMLResponse("Quiz not found", status_code=404)
    
    quiz_questions = db.query(db_models.QuizQuestion).filter(db_models.QuizQuestion.quiz_id == quiz.id).order_by(db_models.QuizQuestion.question_order).all()
    
    return templates.TemplateResponse("admin/question_list.html", {"request": request, "quiz": quiz, "questions": quiz_questions, "title": f"Questions - {quiz.name}"})

@app.get("/admin/quizzes/{slug}/questions/new", response_class=HTMLResponse)
async def new_question(request: Request, slug: str, db: Session = Depends(get_db)):
    quiz = db.query(db_models.Quiz).filter(db_models.Quiz.slug == slug).first()
    if not quiz:
        return HTMLResponse("Quiz not found", status_code=404)
    return templates.TemplateResponse("admin/question_editor.html", {"request": request, "quiz": quiz, "question": None, "title": "New Question"})

@app.post("/admin/quizzes/{slug}/questions/new")
async def create_question(
    slug: str, 
    question_text: str = Form(...), 
    question_type: str = Form(...), 
    question_order: int = Form(...),
    answers: str = Form(""),
    db: Session = Depends(get_db)
):
    quiz = db.query(db_models.Quiz).filter(db_models.Quiz.slug == slug).first()
    if not quiz:
        return HTMLResponse("Quiz not found", status_code=404)
    
    # Parse answers
    answer_list = []
    if answers:
        for label in answers.split(','):
            label = label.strip()
            if label:
                answer_list.append({"value": label.lower().replace(" ", "_"), "label": label})
    
    new_q = db_models.QuizQuestion(
        quiz_id=quiz.id,
        question_text=question_text,
        question_type=question_type,
        question_order=question_order,
        answers=answer_list,
        is_active=True
    )
    
    db.add(new_q)
    db.commit()
    
    return RedirectResponse(url=f"/admin/quizzes/{slug}/questions", status_code=303)

@app.get("/quiz/{slug}", response_class=HTMLResponse)
async def quiz_intro(request: Request, slug: str, db: Session = Depends(get_db)):
    quiz = db.query(db_models.Quiz).filter(db_models.Quiz.slug == slug).first()
    if not quiz:
        return HTMLResponse("Quiz not found", status_code=404)
    return templates.TemplateResponse("quiz/intro.html", {"request": request, "quiz": quiz, "title": quiz.name, "show_footer": True, "footer_text": "Powered by Quiz Platform"})

@app.get("/quiz/{slug}/start")
async def start_quiz(slug: str):
    # In a real app, we would create a session here
    return RedirectResponse(url=f"/quiz/{slug}/question/1", status_code=303)

@app.get("/quiz/{slug}/question/{order}", response_class=HTMLResponse)
async def show_question(request: Request, slug: str, order: int, db: Session = Depends(get_db)):
    quiz = db.query(db_models.Quiz).filter(db_models.Quiz.slug == slug).first()
    if not quiz:
        return HTMLResponse("Quiz not found", status_code=404)
    
    question = db.query(db_models.QuizQuestion).filter(
        db_models.QuizQuestion.quiz_id == quiz.id,
        db_models.QuizQuestion.question_order == order
    ).first()
    
    if not question:
        # If no question found at this order, assume quiz is done -> go to lead form
        return RedirectResponse(url=f"/quiz/{slug}/lead-form", status_code=303)
    
    # Calculate progress
    total_questions = db.query(db_models.QuizQuestion).filter(db_models.QuizQuestion.quiz_id == quiz.id).count()
    progress = ((order - 1) / total_questions) * 100 if total_questions > 0 else 0
    
    return templates.TemplateResponse("quiz/question.html", {
        "request": request, 
        "quiz": quiz, 
        "question": question, 
        "title": quiz.name,
        "show_progress": True,
        "progress_percentage": progress
    })

@app.post("/quiz/{slug}/question/{order}")
async def submit_answer(slug: str, order: int, answer: str = Form(...)):
    # In a real app, save answer to session/db
    print(f"Quiz: {slug}, Question: {order}, Answer: {answer}")
    
    # Go to next question
    return RedirectResponse(url=f"/quiz/{slug}/question/{order + 1}", status_code=303)

@app.get("/quiz/{slug}/lead-form", response_class=HTMLResponse)
async def show_lead_form(request: Request, slug: str, db: Session = Depends(get_db)):
    quiz = db.query(db_models.Quiz).filter(db_models.Quiz.slug == slug).first()
    if not quiz:
        return HTMLResponse("Quiz not found", status_code=404)
    return templates.TemplateResponse("quiz/lead_form.html", {"request": request, "quiz": quiz, "title": "Get Your Results"})

@app.post("/quiz/{slug}/lead-form")
async def submit_lead_form(
    slug: str, 
    email: str = Form(...), 
    first_name: str = Form(None), 
    last_name: str = Form(None),
    db: Session = Depends(get_db)
):
    quiz = db.query(db_models.Quiz).filter(db_models.Quiz.slug == slug).first()
    if not quiz:
        return HTMLResponse("Quiz not found", status_code=404)
    
    new_lead = db_models.Lead(
        quiz_id=quiz.id,
        email=email,
        first_name=first_name,
        last_name=last_name
    )
    db.add(new_lead)
    db.commit()
    
    return RedirectResponse(url=f"/quiz/{slug}/results", status_code=303)

@app.get("/quiz/{slug}/results", response_class=HTMLResponse)
async def show_results(request: Request, slug: str, db: Session = Depends(get_db)):
    quiz = db.query(db_models.Quiz).filter(db_models.Quiz.slug == slug).first()
    if not quiz:
        return HTMLResponse("Quiz not found", status_code=404)
    return templates.TemplateResponse("quiz/results.html", {"request": request, "quiz": quiz, "title": "Your Results"})

@app.get("/health")
async def health_check():
    return {"status": "ok"}
