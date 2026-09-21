"""Provera funkcije koja od oglasa pravi tekst. Pokretanje: python test_text.py"""

import json

from app.embedding import embed_passage
from app.listing_text import build_listing_text
from app.schemas import ListingEvent

# Primer poruke iz Kafka konzole
PORUKA = """
{"eventType":"CREATED","listingId":5,"title":"Luksuzan dvosoban stan u centru",
"description":"Moderan i svetao stan u centru grada, u blizini svih važnih sadržaja.",
"location":"Novi Sad, Centar","listingType":"SALE","propertyType":"APARTMENT","area":62.5,
"numberOfRooms":2.0,"floor":3,"furnishingStatus":"FURNISHED","heatingType":"CENTRAL",
"parking":true,"petFriendly":true,"price":85000.00,"status":"ACTIVE",
"occurredAt":1789824781.129928000}
"""

event = ListingEvent.model_validate(json.loads(PORUKA))
tekst = build_listing_text(event)

print("TEKST OGLASA:")
print(tekst)
print()
print("Broj dimenzija vektora:", len(embed_passage(tekst)))