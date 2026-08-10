from pathlib import Path


def test_sdd_contains_required_sections():
    path = Path(__file__).parents[1] / "docs" / "SDD_Part_IV_Security_Authentication_Architecture.md"
    text = path.read_text(encoding="utf-8")
    required = [
        "# SDD – Phần IV",
        "## 3. Contract với TASK 2",
        "## 5. Authentication – Subtask 1",
        "## 6. JWT specification",
        "## 7. Authorization – Subtask 2",
        "## 9. API contract",
        "## 10. NFR mapping",
        "## 11. Testing and verification",
    ]
    for heading in required:
        assert heading in text
