from pydantic import BaseModel, EmailStr, Field

class SignupIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)

class LoginIn(SignupIn):
    pass

class UserOut(BaseModel):
    id: str
    email: EmailStr

class TokenOut(BaseModel):
    user: UserOut
    token: str
