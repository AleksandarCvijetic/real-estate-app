import asyncio
import logging
from contextlib import asynccontextmanager, suppress

from fastapi import FastAPI

from app import eureka
from app.db import init_db
from app.embedding import get_model
from app.kafka_consumer import run_consumer
from app.routers import search

# da se vide INFO logovi nasih modula (uvicorn podesava samo svoje)
logging.basicConfig(level=logging.INFO, format="%(levelname)s:     %(name)s - %(message)s")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # pokretanje: sema baze, model, Kafka consumer u pozadini, registracija u Eureka
    init_db()
    get_model()
    consumer_task = asyncio.create_task(run_consumer())
    await eureka.register()

    yield

    # gasenje: odjava iz Eureka i zaustavljanje consumer-a
    await eureka.unregister()
    consumer_task.cancel()
    with suppress(asyncio.CancelledError):
        await consumer_task


app = FastAPI(title="AI Service", version="1.0.0", lifespan=lifespan)
app.include_router(search.router)