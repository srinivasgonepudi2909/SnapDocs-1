from fastapi import FastAPI
from app import models, database, routes

app = FastAPI()
app.include_router(routes.router)

@app.on_event("startup")
def startup():
    database.Base.metadata.create_all(bind=database.engine)
