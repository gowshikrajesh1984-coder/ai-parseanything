import os
import pytest
from backend.parser.pipeline import run_parsing_pipeline
from backend.storage import storage_manager

def test_pipeline_on_sample_invoice():
    sample_path = "backend/samples/Invoice_2025.pdf"
    assert os.path.exists(sample_path), "Sample Invoice_2025.pdf should exist"

    progress_events = []
    def on_progress(p, s):
        progress_events.append((p, s))

    results, error = run_parsing_pipeline(
        file_path=sample_path,
        doc_id="test-doc-001",
        original_filename="Invoice_2025.pdf",
        progress_callback=on_progress
    )

    assert error is None
    assert results is not None
    assert results.documentId == "test-doc-001"
    assert results.metadata.pages == 5
    assert results.metadata.format == "PDF"
    assert len(progress_events) >= 5

def test_pipeline_on_sample_image():
    sample_path = "backend/samples/Address_Proof.png"
    assert os.path.exists(sample_path), "Sample Address_Proof.png should exist"

    results, error = run_parsing_pipeline(
        file_path=sample_path,
        doc_id="test-doc-002",
        original_filename="Address_Proof.png"
    )

    assert error is None
    assert results is not None
    assert results.metadata.pages == 1
    assert results.metadata.format == "PNG"
    assert len(results.blocks) > 0
    # Figure block should be present
    assert any(b.type.value == "FIGURE" for b in results.blocks)
