from datetime import datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class ListingEventType(str, Enum):
    CREATED = "CREATED"
    UPDATED = "UPDATED"
    DELETED = "DELETED"


class ListingEvent(BaseModel):
    """
    Dogadjaj koji Listing servis salje na Kafka topic "listing-events".
    Polja u JSON-u su u camelCase obliku (listingId), a u Pythonu u snake_case
    (listing_id) - alias_generator prevodi jedno u drugo.
    """

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

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


class SearchRequest(BaseModel):
    query: str
    top_k: int | None = None


class SearchResult(BaseModel):
    listing_id: int
    score: float


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]