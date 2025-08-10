import os
from datetime import datetime, timedelta, timezone
import jwt
from passlib.hash import bcrypt

JWT_SECRET = os.getenv("JWT_SECRET", "change-me")
JWT_TTL_MIN = int(os.getenv("JWT_TTL_MIN", "120"))

def hash_password(plain: str) -> str:
    return bcrypt.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.verify(plain, hashed)

def issue_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(tz=timezone.utc) + timedelta(minutes=JWT_TTL_MIN),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")
