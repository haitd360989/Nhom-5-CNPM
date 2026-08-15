import hashlib
import math
from typing import List, Dict, Any


def generate_embedding(text: str, dim: int = 64) -> List[float]:
    """Sinh Vector Embedding chuẩn hóa từ văn bản (Deterministic HashMap Vectorizer)."""
    words = text.lower().split()
    vector = [0.0] * dim

    if not words:
        return vector

    for word in words:
        hash_val = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16)
        idx = hash_val % dim
        val = ((hash_val % 1000) / 1000.0) + 0.1
        vector[idx] += val

    magnitude = math.sqrt(sum(v * v for v in vector))
    if magnitude > 0:
        vector = [v / magnitude for v in vector]

    return vector


def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Tính Cosine Similarity giữa 2 vector: Cosine(A, B) = (A . B) / (||A|| * ||B||)."""
    if len(vec_a) != len(vec_b):
        return 0.0

    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))

    if norm_a == 0 or norm_b == 0:
        return 0.0

    return dot_product / (norm_a * norm_b)


def retrieve_relevant_chunks(
    query: str, document_chunks: List[Dict[str, Any]], top_k: int = 3
) -> List[Dict[str, Any]]:
    """Truy vấn danh sách Top-K Chunks có độ tương đồng Cosine cao nhất với câu hỏi."""
    query_vector = generate_embedding(query)
    results = []

    for chunk in document_chunks:
        chunk_vector = generate_embedding(chunk["content"])
        score = cosine_similarity(query_vector, chunk_vector)

        results.append({
            "chunk_id": chunk["chunk_id"],
            "content": chunk["content"],
            "similarity_score": round(score, 4),
        })

    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return results[:top_k]