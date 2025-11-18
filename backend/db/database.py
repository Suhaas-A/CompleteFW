from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from backend.core.config import settings
from sqlalchemy.pool import NullPool

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # checks if connection is alive before using
    pool_recycle=1800,   # recycles connections every 30 mins
    connect_args={"sslmode": "require"},  # ensure SSL connection
    poolclass=NullPool   # disables pooling (prevents SSL closed errors)
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
Base.metadata.drop_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    from backend.model import tables
    Base.metadata.create_all(bind=engine)
