-- Baza za AI servis, sa pgvector ekstenzijom.
-- Izvrsava se samo pri prvom pokretanju, kada je volumen baze prazan.
CREATE DATABASE ai_service_db;
\c ai_service_db
CREATE EXTENSION IF NOT EXISTS vector;