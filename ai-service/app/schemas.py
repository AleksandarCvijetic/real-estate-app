from datetime import datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """
    Osnova za sve modele: u JSON-u su polja u camelCase obliku (listingId),
    a u Pythonu u snake_case (listing_id). Prevod radi alias_generator.
    """

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class ListingEventType(str, Enum):
    CREATED = "CREATED"
    UPDATED = "UPDATED"
    DELETED = "DELETED"


class ListingEvent(CamelModel):
    """Dogadjaj koji Listing servis salje na Kafka topic "listing-events"."""

    event_type: ListingEventType
    listing_id: int

    title: str | None = None
    description: str | None = None
    location: str | None = None
    listing_type: str | None = None
    property_type: str | None = None
    area: float | None = None
    number_of_rooms: float | None = None
    floor: int | None = None
    furnishing_status: str | None = None
    heating_type: str | None = None
    parking: bool | None = None
    pet_friendly: bool | None = None
    price: Decimal | None = None
    status: str | None = None
    occurred_at: datetime | None = None


class SearchRequest(CamelModel):
    query: str
    top_k: int | None = None


class SearchResult(CamelModel):
    listing_id: int
    score: float


class SearchResponse(CamelModel):
    query: str
    results: list[SearchResult]