from fastapi import APIRouter

from app import service
from app.config import settings
from app.schemas import ListingEvent, ListingEventType, SearchRequest, SearchResponse

router = APIRouter()


@router.post("/search", response_model=SearchResponse, tags=["search"])
def search(request: SearchRequest) -> SearchResponse:
    """Semanticka pretraga oglasa. Poziva je Listing servis."""
    top_k = request.top_k or settings.default_top_k
    return SearchResponse(query=request.query, results=service.search(request.query, top_k))


@router.post("/index", tags=["dev"])
def index(event: ListingEvent) -> dict:
    """
    Rucno indeksiranje jednog oglasa, za testiranje bez Kafke.
    U redovnom radu ovo se radi preko Kafka dogadjaja.
    """
    if event.event_type == ListingEventType.DELETED:
        obrisano = service.delete_listing(event.listing_id)
        return {"deleted": obrisano}

    tekst = service.index_listing(event)
    return {"listingId": event.listing_id, "text": tekst}


@router.get("/health", tags=["dev"])
def health() -> dict:
    return {"status": "UP"}