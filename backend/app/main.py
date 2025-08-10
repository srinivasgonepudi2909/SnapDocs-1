from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import EmailStr
from typing import Optional
from bson import ObjectId

from .db import users
from .schemas import SignupIn, LoginIn, UserOut, TokenOut
from .auth import hash_password, verify_password, make_token, decode_token
import os

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:8080")

app = FastAPI(title="SnapDocs Auth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def to_user_out(doc) -> UserOut:
    return UserOut(id=str(doc["_id"]), email=doc["email"])

async def find_user(email: str):
    return await users.find_one({"email": email.lower()})

@app.post("/auth/signup", response_model=TokenOut)
async def signup(body: SignupIn):
    if await find_user(body.email):
        raise HTTPException(status_code=409, detail="Email already registered")
    doc = {"email": body.email.lower(), "password_hash": hash_password(body.password)}
    res = await users.insert_one(doc)
    doc["_id"] = res.inserted_id
    token = make_token(str(doc["_id"]), doc["email"])
    return {"user": to_user_out(doc), "token": token}

@app.post("/auth/login", response_model=TokenOut)
async def login(body: LoginIn):
    user = await find_user(body.email)
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = make_token(str(user["_id"]), user["email"])
    return {"user": to_user_out(user), "token": token}

@app.get("/auth/me", response_model=UserOut)
async def me(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No token")
    payload = decode_token(authorization.split(" ", 1)[1])
    user = await users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return to_user_out(user)
