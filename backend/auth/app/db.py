import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017/snapdocs")
DB_NAME = os.getenv("MONGO_DB", "snapdocs")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
users = db["users"]

USER_VALIDATOR = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["username", "phone", "email", "password_hash"],
        "properties": {
            "username": {"bsonType": "string", "minLength": 2, "description": "required"},
            "phone": {"bsonType": "string", "minLength": 7, "description": "required"},
            "email": {"bsonType": "string", "description": "required email"},
            "password_hash": {"bsonType": "string", "minLength": 10, "description": "bcrypt hash"},
            "created_at": {"bsonType": ["date", "null"]},
        },
        "additionalProperties": False
    }
}

async def init_indexes():
    # Create collection with validator (or update if exists)
    # Try create; if exists, run collMod to set validator.
    try:
        await db.create_collection("users", validator=USER_VALIDATOR)
    except Exception:
        # collection likely exists; update validator
        await db.command({
            "collMod": "users",
            "validator": USER_VALIDATOR,
            "validationLevel": "moderate"
        })

    # Unique email
    await users.create_index("email", unique=True)
    # Optional: unique phone (uncomment if you want it unique too)
    # await users.create_index("phone", unique=True)
    # Case-insensitive email search helper (optional)
    await users.create_index([("email", 1)])
