from fastapi import APIRouter, HTTPException, status
from typing import List
import os
from supabase import create_client, Client
from app.schemas.diagnostic import (
    QuestionOut, SubmitRequest, SubmitResponse,
    StudyPlanInitRequest, StudyPlanInitResponse, TaskOut
)

router = APIRouter(prefix="/api", tags=["Diagnostic & Study Plan"])

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your-anon-key")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.get("/diagnostic/questions", response_model=List[QuestionOut])
def get_diagnostic_questions():
    response = supabase.table("questions").select("id, content, options, category").limit(15).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Không thể lấy câu hỏi từ database")
    return response.data

@router.post("/diagnostic/submit", response_model=SubmitResponse)
def submit_diagnostic_answers(payload: SubmitRequest):
    q_response = supabase.table("questions").select("id, correct_option").execute()
    if not q_response.data:
        raise HTTPException(status_code=500, detail="Lỗi kết nối bảng câu hỏi")
    
    correct_map = {q["id"]: q["correct_option"] for q in q_response.data}
    correct_count = 0
    records_to_insert = []
    
    for ans in payload.answers:
        is_corr = (correct_map.get(ans.question_id) == ans.selected_option)
        if is_corr:
            correct_count += 1
            
        records_to_insert.append({
            "user_id": payload.user_id,
            "question_id": ans.question_id,
            "selected_option": ans.selected_option,
            "is_correct": is_corr,
            "completion_time_seconds": payload.completion_time_seconds
        })
    
    supabase.table("user_answers").insert(records_to_insert).execute()
    
    total = len(payload.answers)
    score_pct = round((correct_count / total) * 100, 2) if total > 0 else 0.0
    
    return SubmitResponse(
        user_id=payload.user_id,
        total_questions=total,
        correct_count=correct_count,
        score_percentage=score_pct
    )

@router.post("/study-plan/init", response_model=StudyPlanInitResponse)
def init_study_plan(payload: StudyPlanInitRequest):
    if payload.score_percentage < 50.0:
        plan_title = "Lộ trình Củng cố Kiến thức Nền tảng"
        tasks_data = [
            {"title": "Ôn tập lại HTML/CSS & Cơ bản Web", "due_week": 1},
            {"title": "Luyện tập JavaScript & DOM Control", "due_week": 2},
            {"title": "Thực hành thiết kế RESTful API cơ bản", "due_week": 3}
        ]
    else:
        plan_title = "Lộ trình Nâng cao & Chuyên sâu"
        tasks_data = [
            {"title": "Tối ưu hóa CSDL & SQL Query Chuyên sâu", "due_week": 1},
            {"title": "Xác thực JWT & Phân quyền Microservices", "due_week": 2},
            {"title": "Triển khai dự án lên Docker & Supabase Cloud", "due_week": 3}
        ]
    
    plan_res = supabase.table("study_plans").insert({
        "user_id": payload.user_id,
        "title": plan_title,
        "overall_score": payload.score_percentage
    }).execute()
    
    plan_id = plan_res.data[0]["id"]
    
    tasks_to_insert = [{"plan_id": plan_id, "title": t["title"], "due_week": t["due_week"]} for t in tasks_data]
    supabase.table("plan_tasks").insert(tasks_to_insert).execute()
    
    return StudyPlanInitResponse(
        plan_id=plan_id,
        user_id=payload.user_id,
        title=plan_title,
        tasks=[TaskOut(title=t["title"], due_week=t["due_week"]) for t in tasks_data]
    )