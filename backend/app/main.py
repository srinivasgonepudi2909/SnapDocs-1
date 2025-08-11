from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .database import Base, engine, get_db
from .models import User
from .schemas import SignupIn, LoginIn, UserOut
from .auth import hash_password, verify_password

app = FastAPI(title="DocuVault Auth API")

# Ensure metadata is in sync (table exists). Table is created by init.sql,
# but this is harmless and keeps SQLAlchemy aware.
Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupIn, db: Session = Depends(get_db)):
    # Check duplicates (also enforced by UNIQUE constraints)
    existing = db.query(User).filter(
        (User.username == payload.username) | (User.email == payload.email)
    ).first()
    if existing:
        # precise message for UX
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
        # Fallback if race condition hits the DB unique constraints
        raise HTTPException(status_code=409, detail="Username or email already exists")

    return user

@app.post("/login")
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.password_hash):
        # generic message: don't leak which field is wrong
        raise HTTPException(status_code=401, detail="Invalid username or password")
    # If needed, here we could issue a JWT. For now, just return OK.
    return {"message": "Login successful", "user": {"id": user.id, "username": user.username}}
