from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.models import User, UserRole
from app.rag.chunking import text_chunker
from app.rag.embeddings import retrieve_relevant_chunks
from app.rbac import require_roles

router = APIRouter(prefix="/api/v1/rag", tags=["RAG Pipeline"])


class RAGQueryRequest(BaseModel):
    document_text: str = Field(..., min_length=10, description="Văn bản tài liệu cần truy vấn")
    user_query: str = Field(..., min_length=2, description="Câu hỏi người dùng")
    chunk_size: int = Field(default=100, ge=10, le=1000)
    top_k: int = Field(default=3, ge=1, le=10)


class ChunkResultResponse(BaseModel):
    chunk_id: int
    content: str
    similarity_score: float


class RAGQueryResponse(BaseModel):
    query: str
    total_chunks_created: int
    top_k_results: List[ChunkResultResponse]


@router.post("/query", response_model=RAGQueryResponse, status_code=status.HTTP_200_OK)
def process_rag_pipeline(
    payload: RAGQueryRequest,
    user: User = Depends(require_roles(UserRole.ADMIN, UserRole.TEACHER)),
):
    """Đường ống RAG Pipeline: Cắt Chunk -> Vector Embedding -> Cosine Similarity Top-K."""
    if not payload.document_text.strip():
        raise HTTPException(status_code=400, detail="Document text cannot be empty")

    chunks = text_chunker(payload.document_text, chunk_size=payload.chunk_size, overlap=20)
    top_chunks = retrieve_relevant_chunks(payload.user_query, chunks, top_k=payload.top_k)

    return RAGQueryResponse(
        query=payload.user_query,
        total_chunks_created=len(chunks),
        top_k_results=top_chunks,
    )