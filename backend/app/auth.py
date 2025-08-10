import os, jwt, datetime
from fastapi import HTTPException, status
from passlib.hash import bcrypt

JWT_SECRET = os.getenv("JWT_SECRET", "dev")
JWT_EXPIRE_MIN = int(os.getenv("JWT_EXPIRE_MIN", "10080"))

def hash_password(p: str) -> str:
    return bcrypt.hash(p)

def verify_password(p: str, hashed: str) -> bool:
    return bcrypt.verify(p, hashed)

def make_token(user_id: str, email: str) -> str:
    exp = datetime.datetime.utcnow() + datetime.timedelta(minutes=JWT_EXPIRE_MIN)
    return jwt.encode({"sub": user_id, "email": email, "exp": exp}, JWT_SECRET, algorithm="HS256")

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
