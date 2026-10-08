from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

# Engine drzi skup konekcija ka bazi (slicno DataSource-u u Spring-u).
engine = create_engine(settings.database_url, pool_pre_ping=True)

# Fabrika sesija. Sesija je jedinica rada nad bazom, slicno EntityManager-u.
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)


class Base(DeclarativeBase):
    """Zajednicka osnova svih entiteta, slicno kao @Entity nasledjivanje u JPA."""


def init_db() -> None:
    """Kreira ekstenziju, tabele i indekse ako ne postoje."""
    from app import models  # noqa: F401  - uvoz registruje entitete u Base.metadata

    with engine.begin() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))

    Base.metadata.create_all(engine)