from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

ALLOWED_ORIGINS = [
    "http://localhost:5173",     # local vite dev
    "http://54.159.9.221",       # frontend served on EC2 over HTTP
    "https://54.159.9.221",      # if using HTTPS
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}
