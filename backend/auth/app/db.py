import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017/snapdocs")
client = AsyncIOMotorClient(MONGO_URI)
db = client.get_default_database()
users = db["users"]

async def ensure_indexes():
    await users.create_index("email", unique=True)
