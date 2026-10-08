import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_full_document_lifecycle():
    # 1. Upload valid document
    sample_path = "backend/samples/Invoice_2025.pdf"
    with open(sample_path, "rb") as f:
        pdf_bytes = f.read()

    upload_res = client.post(
        "/api/documents/upload",
        files={"file": ("Lifecycle_Invoice.pdf", pdf_bytes, "application/pdf")}
    )
    assert upload_res.status_code == 200
    upload_data = upload_res.json()
    assert upload_data["success"] is True
    doc_id = upload_data["documentId"]

    # 2. Trigger parsing
    parse_res = client.post(f"/api/documents/{doc_id}/parse")
    assert parse_res.status_code == 200
    parse_data = parse_res.json()
    assert "jobId" in parse_data
    job_id = parse_data["jobId"]

    # 3. Check job status
    status_res = client.get(f"/api/jobs/{job_id}/status")
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert status_data["documentId"] == doc_id

    # 4. Fetch results (if background worker has not run, fallback on-demand parsing resolves it)
    results_res = client.get(f"/api/documents/{doc_id}/results")
    assert results_res.status_code == 200
    results_data = results_res.json()
    assert results_data["documentId"] == doc_id
    assert "metadata" in results_data
    assert "confidenceDistribution" in results_data
    assert "blocks" in results_data

    # 5. Test export in JSON, Markdown, and CSV
    for fmt in ["JSON", "Markdown", "Structured"]:
        exp_res = client.get(f"/api/documents/{doc_id}/export?format={fmt}")
        assert exp_res.status_code == 200

    # 6. Verify document appears in history list
    list_res = client.get("/api/documents")
    assert list_res.status_code == 200
    docs = list_res.json()
    assert any(d["id"] == doc_id for d in docs)
