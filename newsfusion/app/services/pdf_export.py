from __future__ import annotations

from datetime import datetime


def _escape_pdf_text(text: str) -> str:
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_digest_pdf(user_id: str, digest: dict) -> bytes:
    lines = [
        f"NewsFusion Daily Digest for {user_id}",
        f"Generated at {datetime.utcnow().isoformat()} UTC",
        "",
    ]

    for item in digest["items"]:
        article = item["article"]
        current_affairs = item["current_affairs"]
        lines.append(f"Title: {article['title']}")
        lines.append(f"Topic: {current_affairs['topic']}")
        lines.append(f"Summary: {current_affairs['summary']}")
        lines.append("Key Points:")
        for point in current_affairs["key_points"]:
            lines.append(f"- {point}")
        lines.append("MCQ:")
        for mcq in current_affairs["mcqs"][:1]:
            lines.append(f"Q: {mcq['question']}")
            for option in mcq["options"]:
                lines.append(f"  {option['key']}. {option['text']}")
            lines.append(f"Answer: {mcq['correct_answer']}")
        lines.append("")

    y_position = 780
    content_lines = ["BT", "/F1 11 Tf"]
    for line in lines[:55]:
        content_lines.append(f"72 {y_position} Td ({_escape_pdf_text(line[:110])}) Tj")
        y_position -= 14

    content_lines.append("ET")
    stream = "\n".join(content_lines).encode("latin-1", errors="replace")

    objects = []
    offsets = []

    def add_object(payload: bytes):
        offsets.append(sum(len(obj) for obj in objects))
        objects.append(payload)

    add_object(b"1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n")
    add_object(b"2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n")
    add_object(b"3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << /Font << /F1 4 0 R >> >> >> endobj\n")
    add_object(b"4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n")
    add_object(f"5 0 obj << /Length {len(stream)} >> stream\n".encode("latin-1") + stream + b"\nendstream endobj\n")

    pdf = bytearray(b"%PDF-1.4\n")
    absolute_offsets = [0]
    for obj in objects:
        absolute_offsets.append(len(pdf))
        pdf.extend(obj)

    xref_start = len(pdf)
    pdf.extend(f"xref\n0 {len(objects) + 1}\n".encode("latin-1"))
    pdf.extend(b"0000000000 65535 f \n")
    for offset in absolute_offsets[1:]:
        pdf.extend(f"{offset:010d} 00000 n \n".encode("latin-1"))

    pdf.extend(
        (
            f"trailer << /Size {len(objects) + 1} /Root 1 0 R >>\n"
            f"startxref\n{xref_start}\n%%EOF"
        ).encode("latin-1")
    )
    return bytes(pdf)
