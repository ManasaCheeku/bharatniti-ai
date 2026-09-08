from app.database import engine, Base, SessionLocal
from app.services.seed_service import backfill_request_metrics, seed_database

def main():
    print("Re-creating SQLite database tables for BharatNiti AI...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully.")

    db = SessionLocal()
    try:
        print("Seeding synthetic citizen requests and district dataset...")
        seed_database(db)
        backfill_request_metrics(db)
        print("Database seeding completed successfully.")
    finally:
        db.close()

if __name__ == "__main__":
    main()
