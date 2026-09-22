FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HF_HOME=/app/hf-cache

# PyTorch samo za CPU. Podrazumevana verzija za Linux sadrzi i CUDA biblioteke
# za graficke kartice i visestruko je veca, a ovde nije potrebna.
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# Zavisnosti pre koda: ovaj sloj se kesira dok se requirements.txt ne promeni
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Model se preuzima pri izgradnji slike, pa kontejner pri pokretanju
# ne zavisi od pristupa internetu
ARG EMBEDDING_MODEL=intfloat/multilingual-e5-base
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('${EMBEDDING_MODEL}')"
ENV HF_HUB_OFFLINE=1

COPY app ./app

EXPOSE 8085
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8085"]