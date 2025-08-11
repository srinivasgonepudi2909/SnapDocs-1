from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .database import Base, engine, get_db
from .models import User
from .schemas import SignupIn, LoginIn, UserOut
from .auth import hash_password, verify_password

app = FastAPI(title="DocuVault Auth API")

# --- CORS so your browser app can call this API ---
ALLOWED_ORIGINS = [
    "http://localhost:5173",     # vite dev (local)
    "http://54.159.9.221",       # your EC2 frontend over HTTP
    "https://54.159.9.221",      # if you later add TLS
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure metadata is in sync (table exists). Table is created by init.sql.
Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupIn, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.username == payload.username) | (User.email == payload.email)
    ).first()
    if existing:
        if existing.username == payload.username:
            raise HTTPException(status_code=409, detail="Username already exists")
        else:
            raise HTTPException(status_code=409, detail="Email already exists")

    user = User(
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password)
    )
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Username or email already exists")
    return user

@app.post("/login")
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"message": "Login successful", "user": {"id": user.id, "username": user.username}}
