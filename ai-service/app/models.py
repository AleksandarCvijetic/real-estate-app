from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import BigInteger, DateTime, Index, func
from sqlalchemy.orm import Mapped, mapped_column

from app.config import settings
from app.db import Base


class ListingEmbedding(Base):
    """Vektorska reprezentacija jednog oglasa."""

    __tablename__ = "listing_embedding"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    # unique: jedan oglas ima tacno jedan embedding, sto omogucava upsert
    listing_id: Mapped[int] = mapped_column(BigInteger, unique=True, nullable=False)

    # dimenzija dolazi iz konfiguracije (768 za multilingual-e5-base)
    embedding: Mapped[list[float]] = mapped_column(
        Vector(settings.embedding_dimension), nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        # HNSW indeks za priblizno pretrazivanje najblizih suseda.
        # vector_cosine_ops znaci da se koristi kosinusna udaljenost (operator <=>).
        Index(
            "listing_embedding_hnsw_idx",
            "embedding",
            postgresql_using="hnsw",
            postgresql_with={"m": 16, "ef_construction": 64},
            postgresql_ops={"embedding": "vector_cosine_ops"},
        ),
    )