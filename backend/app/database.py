import os
import tempfile
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

_database_url = os.getenv("DATABASE_URL")
if _database_url:
    DATABASE_URL = _database_url
elif os.getenv("VERCEL"):
    # Vercel only permits writes to the temporary directory.
    temp_database = Path(tempfile.gettempdir()) / "bharatniti.db"
    DATABASE_URL = f"sqlite:///{temp_database.as_posix()}"
else:
    DATABASE_URL = "sqlite:///./bharatniti.db"

# SQLite configuration requires check_same_thread=False
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL, connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
