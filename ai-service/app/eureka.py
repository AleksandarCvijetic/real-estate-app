import logging

import py_eureka_client.eureka_client as eureka_client

from app.config import settings

log = logging.getLogger("ai-service.eureka")


async def register() -> None:
    """
    Registruje AI servis u Eureka serveru pod imenom "ai-service",
    kako bi ga Listing servis pronalazio po imenu, kao i ostale servise.
    Ako Eureka nije dostupna, servis nastavlja da radi, samo bez registracije.
    """
    try:
        await eureka_client.init_async(
            eureka_server=settings.eureka_server,
            app_name=settings.app_name,
            instance_host=settings.instance_host,
            instance_port=settings.service_port,
            health_check_url=f"http://{settings.instance_host}:{settings.service_port}/health",
        )
        log.info("Registrovan u Eureka kao %s", settings.app_name)
    except Exception as e:
        log.warning("Registracija u Eureka nije uspela: %s", e)


async def unregister() -> None:
    try:
        await eureka_client.stop_async()
    except Exception as e:
        log.warning("Odjava iz Eureka nije uspela: %s", e)