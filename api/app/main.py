from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from .config.env_manager import EnvManager
from .routers import auth, index, public_key, secrets, users

app = FastAPI(title='secure-store API')

# Middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=EnvManager.SESSION_SECRET, max_age=10*60*60)

# Exception handlers
# @app.exception_handler()
# async def auth_unauthorized_exception_handler(request, exc):
#     Your exception handeling logic here

# Event handlers


@app.on_event("startup")
async def startup_event():
    pass

# Routers
app.include_router(
    index.router,
    tags=["index"],
    # responses={},
)

app.include_router(
    auth.router,
    prefix='/auth',
    tags=['authentication'],
    # responses={},
)


app.include_router(
    public_key.router,
    prefix='/public-key',
    tags=["public-key"],
    # responses={},
)

app.include_router(
    secrets.router,
    prefix='/secrets',
    tags=["secrets"],
    # responses={},
)


app.include_router(
    users.router,
    prefix='/users',
    tags=["secrets"],
    # responses={},
)
