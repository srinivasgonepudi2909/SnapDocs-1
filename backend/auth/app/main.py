import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from datetime import timedelta

from .db import users_collection
from .schemas import SignupRequest, LoginRequest, TokenResponse, UserResponse
from .security import hash_password, verify_password, create_access_token, decode_access_token

app = FastAPI(title="Auth Service")

# CORS
origins = os.getenv("FRONTEND_ORIGIN", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://54.89.184.30:8080",  # your frontend origin with port
        "http://54.89.184.30",       # if you ever serve from :80
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/signup")
def signup(req: SignupRequest):
    # check if email exists
    if users_collection.find_one({"email": req.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = hash_password(req.password)
    user_doc = {
        "username": req.username,
        "phone": req.phone,
        "email": req.email,
        "password_hash": hashed_pw
    }
    result = users_collection.insert_one(user_doc)
    return {"message": "Account created. Please login."}

@app.post("/auth/login", response_model=TokenResponse)
def login(req: LoginRequest):
    user = users_collection.find_one({"email": req.email})
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token(
        {"sub": str(user["_id"]), "email": user["email"]},
        timedelta(minutes=int(os.getenv("JWT_TTL_MIN", "120")))
    )
    return {
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "username": user["username"],
            "phone": user["phone"],
            "email": user["email"]
        }
    }

@app.get("/auth/me", response_model=UserResponse)
def get_me(token: str = Depends(lambda: None)):
    # FastAPI dependency to get token from header
    from fastapi import Request
    def _get_token(request: Request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Not authenticated")
        return auth_header.split(" ")[1]
    token = _get_token
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = users_collection.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "phone": user["phone"],
        "email": user["email"]
    }
