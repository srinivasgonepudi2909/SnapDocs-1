from pydantic import BaseModel, EmailStr, Field

class SignupIn(BaseModel):
    username: str = Field(min_length=2, max_length=60)
    phone: str = Field(min_length=7, max_length=20)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)

class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)

class UserOut(BaseModel):
    id: str
    username: str
    phone: str
    email: EmailStr

class TokenOut(BaseModel):
    token: str
    user: UserOut
