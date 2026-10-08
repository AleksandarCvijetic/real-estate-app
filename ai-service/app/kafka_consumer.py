import asyncio
import logging

from aiokafka import AIOKafkaConsumer
from pydantic import ValidationError

from app import service
from app.config import settings
from app.schemas import ListingEvent, ListingEventType

log = logging.getLogger("ai-service.kafka")

RETRY_SECONDS = 5


async def handle_message(raw: bytes) -> None:
    try:
        event = ListingEvent.model_validate_json(raw)
    except ValidationError as e:
        log.warning("Neispravna poruka, preskacem: %s", e)
        return

    try:
        if event.event_type == ListingEventType.DELETED:
            await asyncio.to_thread(service.delete_listing, event.listing_id)
            log.info("Obrisan embedding oglasa %s", event.listing_id)
        else:
            await asyncio.to_thread(service.index_listing, event)
            log.info("%s: azuriran embedding oglasa %s", event.event_type.value, event.listing_id)
    except Exception:
        log.exception("Greska pri obradi dogadjaja za oglas %s", event.listing_id)


async def run_consumer() -> None:
    """
    Petlja consumer-a. Radi u pozadini dok je servis pokrenut.
    Ako Kafka nije dostupna, pokusava ponovo na svakih nekoliko sekundi,
    pa servis moze da se pokrene i bez Kafke (pretraga i dalje radi).
    """
    while True:
        consumer = AIOKafkaConsumer(
            settings.kafka_topic,
            bootstrap_servers=settings.kafka_bootstrap_servers,
            group_id=settings.kafka_group_id,
            # nova grupa cita topic od pocetka, pa se obrade i stari dogadjaji
            auto_offset_reset="earliest",
            enable_auto_commit=True,
        )

        try:
            await consumer.start()
        except Exception as e:
            log.warning("Kafka nije dostupna (%s), novi pokusaj za %s s", e, RETRY_SECONDS)
            await asyncio.sleep(RETRY_SECONDS)
            continue

        log.info("Kafka consumer pokrenut, topic: %s", settings.kafka_topic)
        try:
            async for message in consumer:
                await handle_message(message.value)
        except Exception:
            log.exception("Consumer je prekinut, ponovno povezivanje za %s s", RETRY_SECONDS)
            await asyncio.sleep(RETRY_SECONDS)
        finally:
            await consumer.stop()