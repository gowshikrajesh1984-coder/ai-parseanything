from typing import List, Tuple
from backend.schemas import (
    ExtractedBlock,
    ConfidenceDistribution,
    FlaggedPageItem,
    ValidationStatus,
    BoundingBox
)

def analyze_confidence_and_flags(
    blocks: List[ExtractedBlock],
    total_pages: int
) -> Tuple[float, ConfidenceDistribution, List[FlaggedPageItem]]:
    """
    Computes real average confidence, 4-bracket distribution percentages,
    and flags low-confidence or structural issue blocks for human review.
    Never invents data: operates strictly on extracted blocks.
    """
    if not blocks:
        dist = ConfidenceDistribution(high=100, medium=0, low=0, veryLow=0)
        return 90.0, dist, []

    # Normalized confidences in 0-100 scale
    normalized_scores = []
    for b in blocks:
        score = b.confidence
        if score <= 1.0:
            score = score * 100.0
        normalized_scores.append(score)

    avg_confidence = round(sum(normalized_scores) / len(normalized_scores), 1)

    # Brackets
    high_count = sum(1 for s in normalized_scores if s >= 90.0)
    medium_count = sum(1 for s in normalized_scores if 70.0 <= s < 90.0)
    low_count = sum(1 for s in normalized_scores if 50.0 <= s < 70.0)
    very_low_count = sum(1 for s in normalized_scores if s < 50.0)
    
    total = len(normalized_scores)
    high_pct = round((high_count / total) * 100)
    med_pct = round((medium_count / total) * 100)
    low_pct = round((low_count / total) * 100)
    very_low_pct = max(0, 100 - (high_pct + med_pct + low_pct))

    distribution = ConfidenceDistribution(
        high=high_pct,
        medium=med_pct,
        low=low_pct,
        veryLow=very_low_pct
    )

    # Flagged items: blocks with confidence < 70% or validationStatus == 'needs_review' or structural issue
    flagged_pages: List[FlaggedPageItem] = []
    seen_pages = set()

    for idx, b in enumerate(blocks):
        score = b.confidence if b.confidence > 1.0 else b.confidence * 100.0
        is_low = score < 70.0
        needs_rev = b.validationStatus == ValidationStatus.NEEDS_REVIEW or b.requiresHumanReview
        
        if is_low or needs_rev:
            issue_title = b.issue or ("Low confidence text block" if is_low else "Structure review needed")
            details = (
                f"Block {b.id} on Page {b.pageNumber} flagged with confidence {score:.1f}%. "
                f"Content preview: '{b.content[:80]}...'" if len(b.content) > 80 else f"'{b.content}'"
            )
            
            flagged_pages.append(
                FlaggedPageItem(
                    page=b.pageNumber,
                    issue=issue_title,
                    confidence=round(score, 1),
                    blockId=b.id,
                    boundingBox=b.boundingBox,
                    details=details,
                    resolved=False
                )
            )
            seen_pages.add(b.pageNumber)

    return avg_confidence, distribution, flagged_pages
