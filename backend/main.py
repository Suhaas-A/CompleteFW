from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.routers import (
    routes,          # your existing main routes
    wishlist,        # new feature
    reviews,         # new feature
    addresses,       # new feature
    payments,        # new feature
    admin_reports,   # new feature
    metadata
)
from backend.db.database import create_tables
from backend.model import tables  # ensure models are imported before create_tables()

app = FastAPI(
    title="Fashion Store API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Create all database tables at startup (safe for dev mode)
create_tables()

# Allow frontend to connect via CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(routes.router, prefix=settings.API_PREFIX)
app.include_router(wishlist.router, prefix=settings.API_PREFIX)
app.include_router(reviews.router, prefix=settings.API_PREFIX)
app.include_router(addresses.router, prefix=settings.API_PREFIX)
app.include_router(payments.router, prefix=settings.API_PREFIX)
app.include_router(admin_reports.router, prefix=settings.API_PREFIX)
app.include_router(metadata.router)


@app.get("/", tags=["root"])
def root():
    """Simple root endpoint to confirm server health."""
    return {"message": "Fashion Store API is running successfully."}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
