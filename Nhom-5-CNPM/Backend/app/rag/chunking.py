from typing import List, Dict, Any


def text_chunker(text: str, chunk_size: int = 100, overlap: int = 20) -> List[Dict[str, Any]]:
    """Chia nhỏ đoạn văn bản thành các chunks có độ dài vừa phải để đưa vào Vector Embedding."""
    words = text.split()
    if not words:
        return []

    chunks = []
    chunk_id = 0
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk_words = words[start:end]
        chunk_text = " ".join(chunk_words)

        chunks.append({
            "chunk_id": chunk_id,
            "content": chunk_text,
            "word_count": len(chunk_words),
        })

        chunk_id += 1
        start += (chunk_size - overlap)

        if end >= len(words):
            break

    return chunks