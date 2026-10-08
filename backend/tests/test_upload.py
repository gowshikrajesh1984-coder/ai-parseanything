import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_upload_valid_pdf():
    # Valid minimal PDF header
    pdf_bytes = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n<< >>\n%%EOF"
    response = client.post(
        "/api/documents/upload",
        files={"file": ("test_invoice.pdf", pdf_bytes, "application/pdf")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["documentId"].startswith("doc-")
    assert data["metadata"]["name"] == "test_invoice.pdf"
    assert data["metadata"]["format"] == "PDF"

def test_upload_empty_file():
    response = client.post(
        "/api/documents/upload",
        files={"file": ("empty.pdf", b"", "application/pdf")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "EMPTY_FILE"

def test_upload_invalid_type():
    response = client.post(
        "/api/documents/upload",
        files={"file": ("malware.exe", b"MZexecutable_code", "application/octet-stream")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_FILE_TYPE"

def test_upload_corrupted_pdf():
    # .pdf extension but binary is not a PDF
    corrupt_bytes = b"This is plain text pretending to be a pdf document"
    response = client.post(
        "/api/documents/upload",
        files={"file": ("corrupt.pdf", corrupt_bytes, "application/pdf")}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "CORRUPTED_FILE"
