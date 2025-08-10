import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from .db import users_collection, ensure_indexes
from .schemas import SignupIn, LoginIn, UserOut, TokenOut
from .security import hash_password, verify_password, issue_token

app = FastAPI(title="SnapDocs Auth Service")

# CORS
_origins = [o.strip() for o in os.getenv("CORS_ALLOWED_ORIGINS", "*").split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins if _origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def _on_startup():
    await ensure_indexes()

def _user_out(doc) -> UserOut:
    return UserOut(
        id=str(doc["_id"]),
        username=doc["username"],
        phone=doc["phone"],
        email=doc["email"],
    )

@app.post("/signup", response_model=TokenOut)
async def signup(payload: SignupIn):
    existing = await users_collection.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    doc = {
        "username": payload.username,
        "phone": payload.phone,
        "email": payload.email.lower(),
        "password": hash_password(payload.password),
    }
    result = await users_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    token = issue_token(str(doc["_id"]), doc["email"])
    return TokenOut(token=token, user=_user_out(doc))

@app.post("/login", response_model=TokenOut)
async def login(payload: LoginIn):
    doc = await users_collection.find_one({"email": payload.email.lower()})
    if not doc or not verify_password(payload.password, doc["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = issue_token(str(doc["_id"]), doc["email"])
    return TokenOut(token=token, user=_user_out(doc))
