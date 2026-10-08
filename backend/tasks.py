import logging
from datetime import datetime
from backend.celery_app import celery_app
from backend.storage import storage_manager
from backend.parser.pipeline import run_parsing_pipeline

logger = logging.getLogger(__name__)

@celery_app.task(bind=True, name="backend.tasks.process_document_task")
def process_document_task(self, job_id: str, document_id: str, file_path: str, original_filename: str):
    """
    Celery background task for real document processing.
    Updates Redis state with genuine progress as each stage executes.
    """
    logger.info(f"Starting Celery document processing task for job={job_id}, doc={document_id}")

    def on_progress(progress: int, stage: str):
        # Update Celery custom state and Redis storage
        self.update_state(
            state="PROGRESS",
            meta={"progress": progress, "stage": stage, "documentId": document_id}
        )
        storage_manager.set_job_status(
            job_id=job_id,
            document_id=document_id,
            status="parsing",
            progress=progress,
            stage=stage
        )

    try:
        # Initial status
        on_progress(5, "Initializing Isolated Sandbox Worker...")

        results, error = run_parsing_pipeline(
            file_path=file_path,
            doc_id=document_id,
            original_filename=original_filename,
            progress_callback=on_progress
        )

        if error:
            logger.error(f"Parsing pipeline error for doc {document_id}: {error.message}")
            storage_manager.set_job_status(
                job_id=job_id,
                document_id=document_id,
                status="failed",
                progress=0,
                stage="Parsing failed",
                error=error
            )
            return {"success": False, "error": error.model_dump()}

        # Save actual results to disk & Redis
        storage_manager.save_parsed_results(document_id, results)

        # Mark job completed
        now_str = datetime.now().strftime("%b %d, %Y • %I:%M %p")
        storage_manager.set_job_status(
            job_id=job_id,
            document_id=document_id,
            status="completed",
            progress=100,
            stage="Document parsing is complete!",
            completed_at=now_str
        )
        logger.info(f"Successfully finished processing doc {document_id}")
        return {"success": True, "documentId": document_id}

    except Exception as exc:
        logger.exception(f"Unexpected exception processing document {document_id}: {exc}")
        storage_manager.set_job_status(
            job_id=job_id,
            document_id=document_id,
            status="failed",
            progress=0,
            stage=f"Worker exception: {str(exc)}"
        )
        raise exc
