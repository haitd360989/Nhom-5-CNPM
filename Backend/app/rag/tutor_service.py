import os
from dotenv import load_dotenv
import google.generativeai as genai
from app.core.config import settings
from app.rag.prompts import SYSTEM_PROMPT

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY") or getattr(settings, "gemini_api_key", None)
genai.configure(api_key=api_key)

async def generate_tutor_response(question_context: str, user_message: str) -> str:
    """
    Hàm ghép ngữ cảnh câu hỏi + prompt + câu hỏi của học sinh để gọi Gemini API
    """
    model = genai.GenerativeModel("gemini-3.6-flash")

    prompt = f"""
{SYSTEM_PROMPT}

--- NGỮ CẢNH CÂU HỎI TRONG BÀI THI ---
{question_context}

--- THẮC MẮC CỦA HỌC SINH ---
{user_message}
"""

    response = await model.generate_content_async(prompt)
    return response.text