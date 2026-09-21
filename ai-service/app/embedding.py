from sentence_transformers import SentenceTransformer

from app.config import settings

_model: SentenceTransformer | None = None


def get_model() -> SentenceTransformer:
    """
    Ucitava model pri prvom pozivu i cuva ga u memoriji.
    Ucitavanje traje nekoliko sekundi, pa se radi samo jednom.
    """
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.embedding_model)
    return _model


def _encode(text: str) -> list[float]:
    # normalize_embeddings=True: vektori se skaliraju na duzinu 1,
    # pa je kosinusna slicnost jednaka skalarnom proizvodu
    vektor = get_model().encode(text, normalize_embeddings=True, show_progress_bar=False)
    return vektor.tolist()


def embed_passage(text: str) -> list[float]:
    """Embedding teksta oglasa (E5 trazi prefiks 'passage: ')."""
    return _encode(settings.passage_prefix + text)


def embed_query(text: str) -> list[float]:
    """Embedding korisnickog upita (E5 trazi prefiks 'query: ')."""
    return _encode(settings.query_prefix + text)