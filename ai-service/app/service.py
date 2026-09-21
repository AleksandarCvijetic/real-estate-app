from sqlalchemy import delete as sql_delete
from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert

from app.db import SessionLocal
from app.embedding import embed_passage, embed_query
from app.listing_text import build_listing_text
from app.models import ListingEmbedding
from app.schemas import ListingEvent, SearchResult


def index_listing(event: ListingEvent) -> str:
    """Racuna embedding oglasa i upisuje ga u bazu (upsert). Vraca tekst koji je embedovan."""
    tekst = build_listing_text(event)
    vektor = embed_passage(tekst)

    stmt = insert(ListingEmbedding).values(listing_id=event.listing_id, embedding=vektor)
    # ako embedding za taj oglas vec postoji, prepisuje se novim
    stmt = stmt.on_conflict_do_update(
        index_elements=[ListingEmbedding.listing_id],
        set_={"embedding": vektor, "updated_at": func.now()},
    )

    with SessionLocal() as session:
        session.execute(stmt)
        session.commit()

    return tekst


def delete_listing(listing_id: int) -> int:
    """Brise embedding obrisanog oglasa. Vraca broj obrisanih redova."""
    with SessionLocal() as session:
        rezultat = session.execute(
            sql_delete(ListingEmbedding).where(ListingEmbedding.listing_id == listing_id)
        )
        session.commit()
        return rezultat.rowcount


def search(query: str, top_k: int) -> list[SearchResult]:
    """Semanticka pretraga: vraca listingId-jeve sortirane po slicnosti sa upitom."""
    vektor = embed_query(query)

    # <=> operator iz pgvector-a: kosinusna udaljenost (0 = isto, 2 = suprotno)
    udaljenost = ListingEmbedding.embedding.cosine_distance(vektor).label("distance")
    stmt = select(ListingEmbedding.listing_id, udaljenost).order_by(udaljenost).limit(top_k)

    with SessionLocal() as session:
        redovi = session.execute(stmt).all()

    # slicnost = 1 - udaljenost, da veci broj znaci slicniji oglas
    return [
        SearchResult(listing_id=listing_id, score=round(1 - udaljenost, 4))
        for listing_id, udaljenost in redovi
    ]