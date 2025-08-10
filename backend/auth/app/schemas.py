from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class SignupRequest(BaseModel):
    username: str = Field(..., min_length=2, max_length=50)
    phone: str = Field(..., min_length=7, max_length=15)
    email: EmailStr
    password: str = Field(..., min_length=6)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    phone: str
    email: EmailStr

class TokenResponse(BaseModel):
    token: str
    user: UserResponse
