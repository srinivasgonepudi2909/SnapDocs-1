from fastapi import APIRouter, HTTPException, Depends, Header
from bson import ObjectId
from datetime import datetime, timedelta
from passlib.hash import bcrypt
from jose import jwt
from .db import db
from .schemas import SignupIn, LoginIn, UserOut, TokenOut
from pydantic import EmailStr

router = APIRouter(prefix="/auth", tags=["auth"])

users = db["users"]
JWT_SECRET = "change-me"  # keep your env/secret
JWT_EXPIRE_MIN = 60 * 24

def _user_to_out(u) -> UserOut:
    return UserOut(
        id=str(u["_id"]),
        email=u["email"],
        username=u.get("username", ""),
        phone=u.get("phone", ""),
    )

@router.post("/signup")
async def signup(payload: SignupIn):
    email = payload.email.lower().strip()
    if await users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="Email already registered")

    doc = {
        "email": email,
        "password": bcrypt.hash(payload.password),
        "username": payload.username.strip(),
        "phone": payload.phone.strip(),
        "created_at": datetime.utcnow(),
    }
    await users.insert_one(doc)
    # Do not issue a token here; ask the user to login.
    return {"ok": True, "message": "Account created. Please log in."}

@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn):
    email = payload.email.lower().strip()
    u = await users.find_one({"email": email})
    if not u or not bcrypt.verify(payload.password, u["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    claims = {
        "sub": str(u["_id"]),
        "email": u["email"],
        "exp": datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MIN),
    }
    token = jwt.encode(claims, JWT_SECRET, algorithm="HS256")

    return TokenOut(user=_user_to_out(u), token=token)

# keep your /auth/me & get_current_user dependency unchanged
