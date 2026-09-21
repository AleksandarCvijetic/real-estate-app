import asyncio
import logging
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI

from app.db import init_db
from app.embedding import get_model
from app.kafka_consumer import run_consumer
from app.routers import search

# da se vide INFO logovi nasih modula (uvicorn podesava samo svoje)
logging.basicConfig(level=logging.INFO, format="%(levelname)s:     %(name)s - %(message)s")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # pokretanje: sema baze, ucitavanje modela, pa Kafka consumer u pozadini
    init_db()
    get_model()
    consumer_task = asyncio.create_task(run_consumer())

    yield

    # gasenje: zaustavljanje consumer-a
    consumer_task.cancel()
    with suppress(asyncio.CancelledError):
        await consumer_task


app = FastAPI(title="AI Service", version="1.0.0", lifespan=lifespan)
app.include_router(search.router)