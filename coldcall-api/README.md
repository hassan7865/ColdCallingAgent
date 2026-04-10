# Cold Calling Agent API

Async FastAPI backend for a Cold Calling SaaS application, using PostgreSQL, SQLAlchemy 2.0 async, Alembic migrations, JWT cookie auth, structured JSON logging, and in-process asynchronous job execution.

## Quick Start

1. Copy env:
   - `cp .env.example .env`
2. Install dependencies:
   - `uv sync`
3. Run migrations:
   - `uv run alembic upgrade head`
4. Start API:
   - `uv run uvicorn main:app --reload`
5. Background jobs run in-process asynchronously by default (no Redis/Celery required).
6. Optional demo user and sample data (after DB is migrated):
   - `uv run python scripts/seed_demo.py`
   - Replace existing demo-owned rows: `uv run python scripts/seed_demo.py --force`  
   Sign-in is printed at the end (default email uses `example.com` so it passes API email validation).

## Project Structure

- `main.py`: FastAPI app entrypoint, middleware, CORS, exception handling, router registration
- `core/`: config, response envelope, structured logging
- `dependencies/`: shared DI dependencies (db/auth/pagination)
- `models/`: SQLAlchemy ORM model definitions only
- `schemas/`: Pydantic v2 request/response schemas organized by resource
- `services/`: async business logic and job dispatch
- `routers/`: route definitions only, each endpoint delegates to one service function
- `migrations/`: Alembic migration environment and versions
- `scripts/`: maintenance utilities (e.g. `seed_demo.py`)

## Migration Workflow

- Create a migration:
  - `uv run alembic revision -m "describe_change"`
- Apply migrations:
  - `uv run alembic upgrade head`
- Roll back one:
  - `uv run alembic downgrade -1`

`create_all` is intentionally not used. All schema changes must go through Alembic migrations.

