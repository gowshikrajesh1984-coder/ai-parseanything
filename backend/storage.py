import os
import json
from datetime import datetime
from typing import Optional, List, Dict, Any
import redis

from backend.config import settings
from backend.schemas import (
    DocumentMetadata,
    JobStatusResponse,
    ParsedResultsResponse,
    ProcessedDocumentItem,
    DocumentValidationError,
    ConfidenceDistribution,
    FlaggedPageItem,
    ExtractedBlock
)

class StorageManager:
    def __init__(self):
        os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
        os.makedirs(settings.RESULTS_DIR, exist_ok=True)
        os.makedirs(settings.SAMPLES_DIR, exist_ok=True)
        self.redis_client = None
        self._init_redis()
        # In-memory backup dictionary if Redis is restarting
        self._local_cache: Dict[str, Any] = {}

    def _init_redis(self):
        try:
            self.redis_client = redis.Redis.from_url(settings.REDIS_URL, decode_responses=True)
            self.redis_client.ping()
        except Exception as e:
            self.redis_client = None

    def is_redis_connected(self) -> bool:
        try:
            if not self.redis_client:
                self._init_redis()
            return bool(self.redis_client and self.redis_client.ping())
        except Exception:
            return False

    def save_file(self, doc_id: str, filename: str, content: bytes) -> str:
        safe_name = f"{doc_id}_{os.path.basename(filename)}"
        file_path = os.path.join(settings.UPLOAD_DIR, safe_name)
        with open(file_path, "wb") as f:
            f.write(content)
        return file_path

    def get_file_path(self, doc_id: str) -> Optional[str]:
        for fname in os.listdir(settings.UPLOAD_DIR):
            if fname.startswith(f"{doc_id}_"):
                return os.path.join(settings.UPLOAD_DIR, fname)
        return None

    def set_job_status(
        self,
        job_id: str,
        document_id: str,
        status: str,
        progress: int,
        stage: str,
        error: Optional[DocumentValidationError] = None,
        completed_at: Optional[str] = None
    ):
        data = {
            "jobId": job_id,
            "documentId": document_id,
            "status": status,
            "progress": progress,
            "stage": stage,
            "completedAt": completed_at,
            "error": error.model_dump() if error else None
        }
        json_str = json.dumps(data)
        self._local_cache[f"job:{job_id}"] = data
        self._local_cache[f"doc_job:{document_id}"] = job_id
        if self.is_redis_connected():
            try:
                self.redis_client.set(f"job:{job_id}", json_str)
                self.redis_client.set(f"doc_job:{document_id}", job_id)
            except Exception:
                pass

    def get_job_status(self, job_id: str) -> Optional[JobStatusResponse]:
        raw = None
        if self.is_redis_connected():
            try:
                raw = self.redis_client.get(f"job:{job_id}")
            except Exception:
                raw = None
        if not raw and f"job:{job_id}" in self._local_cache:
            raw = json.dumps(self._local_cache[f"job:{job_id}"])
        if not raw:
            return None
        data = json.loads(raw)
        return JobStatusResponse(**data)

    def get_job_id_for_doc(self, document_id: str) -> Optional[str]:
        if self.is_redis_connected():
            try:
                j_id = self.redis_client.get(f"doc_job:{document_id}")
                if j_id:
                    return j_id
            except Exception:
                pass
        return self._local_cache.get(f"doc_job:{document_id}")

    def save_parsed_results(self, doc_id: str, results: ParsedResultsResponse):
        json_data = results.model_dump()
        json_str = json.dumps(json_data, indent=2)
        
        # Save to disk
        disk_path = os.path.join(settings.RESULTS_DIR, f"{doc_id}.json")
        with open(disk_path, "w") as f:
            f.write(json_str)

        # Cache in Redis and memory
        self._local_cache[f"results:{doc_id}"] = json_data
        if self.is_redis_connected():
            try:
                self.redis_client.set(f"results:{doc_id}", json_str)
            except Exception:
                pass

        # Update processed documents list
        meta = results.metadata
        now = datetime.now()
        item = ProcessedDocumentItem(
            id=doc_id,
            name=meta.name,
            type=meta.format,
            size=meta.size,
            date=now.strftime("%b %d, %Y"),
            time=now.strftime("%I:%M %p"),
            status="Processed",
            confidence=meta.confidence,
            pages=meta.pages
        )
        self.add_processed_document(item)

    def get_parsed_results(self, doc_id: str) -> Optional[ParsedResultsResponse]:
        # Try Redis
        if self.is_redis_connected():
            try:
                raw = self.redis_client.get(f"results:{doc_id}")
                if raw:
                    return ParsedResultsResponse(**json.loads(raw))
            except Exception:
                pass

        # Try Memory
        if f"results:{doc_id}" in self._local_cache:
            return ParsedResultsResponse(**self._local_cache[f"results:{doc_id}"])

        # Try Disk
        disk_path = os.path.join(settings.RESULTS_DIR, f"{doc_id}.json")
        if os.path.exists(disk_path):
            with open(disk_path, "r") as f:
                data = json.load(f)
                return ParsedResultsResponse(**data)

        return None

    def add_processed_document(self, item: ProcessedDocumentItem):
        items = self.list_processed_documents()
        # Avoid duplicate by id or name
        filtered = [x for x in items if x.id != item.id and x.name != item.name]
        updated = [item] + filtered
        
        json_str = json.dumps([x.model_dump() for x in updated])
        self._local_cache["processed_documents"] = updated
        if self.is_redis_connected():
            try:
                self.redis_client.set("processed_documents", json_str)
            except Exception:
                pass
        
        list_disk = os.path.join(settings.RESULTS_DIR, "processed_list.json")
        with open(list_disk, "w") as f:
            f.write(json_str)

    def list_processed_documents(self) -> List[ProcessedDocumentItem]:
        if self.is_redis_connected():
            try:
                raw = self.redis_client.get("processed_documents")
                if raw:
                    data = json.loads(raw)
                    return [ProcessedDocumentItem(**x) for x in data]
            except Exception:
                pass

        if "processed_documents" in self._local_cache:
            return self._local_cache["processed_documents"]

        list_disk = os.path.join(settings.RESULTS_DIR, "processed_list.json")
        if os.path.exists(list_disk):
            with open(list_disk, "r") as f:
                data = json.load(f)
                return [ProcessedDocumentItem(**x) for x in data]

        return []

    def resolve_flagged_page(self, doc_id: str, page_number: int, resolved: bool = True) -> bool:
        results = self.get_parsed_results(doc_id)
        if not results:
            return False
        
        updated_flags = []
        for p in results.flaggedPages:
            if p.page == page_number:
                p.resolved = resolved
            updated_flags.append(p)
        results.flaggedPages = updated_flags
        self.save_parsed_results(doc_id, results)
        return True

storage_manager = StorageManager()
