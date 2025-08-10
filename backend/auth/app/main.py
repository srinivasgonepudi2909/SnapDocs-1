import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId

from .db import users, ensure_indexes
from .schemas import SignupIn, LoginIn, TokenOut, UserOut
from .security import hash_password, verify_password, issue_token

app = FastAPI(title="SnapDocs Auth Service")

origins = [o.strip() for o in os.getenv("CORS_ALLOWED_ORIGINS", "*").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def _startup():
    await ensure_indexes()

def _out(doc) -> UserOut:
    return UserOut(
        id=str(doc["_id"]),
        username=doc["username"],
        phone=doc["phone"],
        email=doc["email"],
    )

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/auth/signup")
async def signup(req: SignupIn):
    if await users.find_one({"email": req.email.lower()}):
        raise HTTPException(status_code=409, detail="Email already registered")
    doc = {
        "username": req.username.strip(),
        "phone": req.phone.strip(),
        "email": req.email.lower(),
        "password": hash_password(req.password),
    }
    res = await users.insert_one(doc)
    return {"message": "Account created. Please log in."}

@app.post("/auth/login", response_model=TokenOut)
async def login(req: LoginIn):
    doc = await users.find_one({"email": req.email.lower()})
    if not doc or not verify_password(req.password, doc["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = issue_token(str(doc["_id"]), doc["email"])
    return TokenOut(token=token, user=_out(doc))
