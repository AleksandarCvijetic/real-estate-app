from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Podesavanja servisa. Vrednosti se citaju iz .env fajla ili iz promenljivih
    okruzenja (koje imaju prednost), slicno kao application.properties u Spring Boot-u.
    """

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Baza
    database_url: str = "postgresql+psycopg://postgres:super@localhost:5433/ai_service_db"

    # Embedding model
    embedding_model: str = "intfloat/multilingual-e5-base"
    embedding_dimension: int = 768
    query_prefix: str = "query: "
    passage_prefix: str = "passage: "

    # Kafka
    kafka_bootstrap_servers: str = "localhost:9092"
    kafka_topic: str = "listing-events"
    kafka_group_id: str = "ai-service"

    # Pretraga
    default_top_k: int = 50

    # Servis i Eureka
    app_name: str = "ai-service"
    service_port: int = 8085
    eureka_server: str = "http://localhost:8761/eureka"
    # adresa pod kojom ga drugi servisi pozivaju: lokalno "localhost",
    # u Docker-u ime kontejnera ("ai-service")
    instance_host: str = "localhost"


settings = Settings()