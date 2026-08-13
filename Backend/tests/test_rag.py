from app.rag.chunking import text_chunker
from app.rag.embeddings import generate_embedding, cosine_similarity, retrieve_relevant_chunks


def test_text_chunker():
    sample = "Word " * 250
    chunks = text_chunker(sample, chunk_size=100, overlap=20)
    assert len(chunks) > 1
    assert chunks[0]["word_count"] == 100


def test_cosine_similarity_identical_vectors():
    vec_a = generate_embedding("Học tập cá nhân hóa AI")
    score = cosine_similarity(vec_a, vec_a)
    assert round(score, 2) == 1.0


def test_rag_pipeline_retrieval():
    doc = (
        "Bài thi đánh giá năng lực bao gồm Toán học, Ngôn ngữ và Khoa học. "
        "Hệ thống sẽ xây dựng lộ trình học tập cá nhân hóa dựa trên kết quả đánh giá."
    )
    chunks = text_chunker(doc, chunk_size=10, overlap=2)
    results = retrieve_relevant_chunks("Toán học", chunks, top_k=2)
    assert len(results) == 2
    assert results[0]["similarity_score"] > 0