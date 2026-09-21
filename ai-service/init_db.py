"""Jednokratno kreiranje seme baze. Pokrece se sa: python init_db.py"""

from app.db import init_db

if __name__ == "__main__":
    init_db()
    print("Sema baze je kreirana.")