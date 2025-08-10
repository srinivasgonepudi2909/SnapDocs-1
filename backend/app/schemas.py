from pydantic import BaseModel, EmailStr, Field, constr
from typing import Optional
from datetime import datetime

# ---------- Auth ----------
class SignupIn(BaseModel):
    username: constr(min_length=2, max_length=50)
    phone: constr(pattern=r"^\+?[0-9]{7,15}$")  # +countrycode + digits (7–15)
    email: EmailStr
    password: constr(min_length=6)

class LoginIn(BaseModel):
    email: EmailStr
    password: constr(min_length=6)

class UserOut(BaseModel):
    id: str
    email: EmailStr
    username: str
    phone: str

class TokenOut(BaseModel):
    user: UserOut
    token: str

# ---------- Folders / Files (from earlier step) ----------
class FolderIn(BaseModel):
    name: str = Field(min_length=1, max_length=60)

class FolderOut(BaseModel):
    id: str
    name: str
    created_at: datetime

class FileOut(BaseModel):
    id: str
    filename: str
    content_type: Optional[str] = None
    size: int
    uploaded_at: datetime
