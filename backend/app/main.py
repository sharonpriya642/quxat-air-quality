from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router

app = FastAPI(title="Andhra AQI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
  "http://localhost:5173",
  "https://glowing-bunny-23d324.netlify.app"
],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/aqi")

@app.get("/")
async def root():
    return {"message": "Andhra AQI API is running!"}