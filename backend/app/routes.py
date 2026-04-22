import httpx
from fastapi import APIRouter, HTTPException
from app.services import fetch_all_stations, fetch_station_aqi, fetch_historical_aqi, ANDHRA_STATIONS, API_KEY
from app.services import convert_aqi, get_aqi_category
import datetime
import asyncio

router = APIRouter()

@router.get("/all")
async def get_all_stations():
    try:
        async def safe_fetch(station):
            try:
                return await fetch_station_aqi(station)
            except Exception:
                return None

        # Fetch in batches of 5 to avoid rate limiting
        results = []
        batch_size = 5
        for i in range(0, len(ANDHRA_STATIONS), batch_size):
            batch = ANDHRA_STATIONS[i:i + batch_size]
            tasks = [safe_fetch(station) for station in batch]
            fetched = await asyncio.gather(*tasks)
            results.extend([r for r in fetched if r is not None])
            await asyncio.sleep(0.5)  # small delay between batches

        return {"success": True, "count": len(results), "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/station/{station_id}")
async def get_station(station_id: int):
    station = next((s for s in ANDHRA_STATIONS if s["id"] == station_id), None)
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    try:
        data = await fetch_station_aqi(station)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{station_id}")
async def get_history(station_id: int, hours: int = 168):
    station = next((s for s in ANDHRA_STATIONS if s["id"] == station_id), None)
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    try:
        data = await fetch_historical_aqi(station, hours)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
async def search_city(city: str):
    try:
        url = f"http://api.openweathermap.org/geo/1.0/direct?q={city},IN&limit=5&appid={API_KEY}"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            locations = response.json()

        if not locations:
            return {"success": False, "message": "City not found"}

        async def fetch_city(loc):
            aqi_url = f"https://api.openweathermap.org/data/2.5/air_pollution?lat={loc['lat']}&lon={loc['lon']}&appid={API_KEY}"
            async with httpx.AsyncClient() as client:
                aqi_response = await client.get(aqi_url)
                aqi_data = aqi_response.json()["list"][0]
            aqi = convert_aqi(aqi_data["components"])
            info = get_aqi_category(aqi)
            return {
                "name": loc["name"],
                "state": loc.get("state", ""),
                "lat": loc["lat"],
                "lon": loc["lon"],
                "aqi": aqi,
                "category": info["category"],
                "color": info["color"],
                "advice": info["advice"],
                "pollutants": {
                    "pm25": aqi_data["components"]["pm2_5"],
                    "pm10": aqi_data["components"]["pm10"],
                    "o3":   aqi_data["components"]["o3"],
                    "no2":  aqi_data["components"]["no2"],
                    "so2":  aqi_data["components"]["so2"],
                    "co":   aqi_data["components"]["co"],
                },
                "timestamp": datetime.datetime.utcnow().isoformat(),
            }

        results = await asyncio.gather(*[fetch_city(loc) for loc in locations])
        return {"success": True, "data": list(results)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/locations")
async def get_city_locations(city: str):
    try:
        geo_url = f"http://api.openweathermap.org/geo/1.0/direct?q={city},IN&limit=1&appid={API_KEY}"
        async with httpx.AsyncClient() as client:
            geo_res = await client.get(geo_url)
            geo_data = geo_res.json()

        if not geo_data:
            return {"success": False, "message": "City not found"}

        lat = geo_data[0]["lat"]
        lon = geo_data[0]["lon"]

        offsets = [
            {"name": f"{city} Centre",      "dlat": 0,     "dlon": 0},
            {"name": f"{city} North",       "dlat": 0.04,  "dlon": 0},
            {"name": f"{city} South",       "dlat": -0.04, "dlon": 0},
            {"name": f"{city} East",        "dlat": 0,     "dlon": 0.04},
            {"name": f"{city} West",        "dlat": 0,     "dlon": -0.04},
            {"name": f"{city} North East",  "dlat": 0.03,  "dlon": 0.03},
            {"name": f"{city} North West",  "dlat": 0.03,  "dlon": -0.03},
            {"name": f"{city} South East",  "dlat": -0.03, "dlon": 0.03},
            {"name": f"{city} South West",  "dlat": -0.03, "dlon": -0.03},
            {"name": f"{city} Industrial",  "dlat": 0.06,  "dlon": 0.02},
            {"name": f"{city} Residential", "dlat": -0.02, "dlon": 0.05},
            {"name": f"{city} Commercial",  "dlat": 0.02,  "dlon": -0.05},
        ]

        async def fetch_offset(offset):
            try:
                aqi_url = f"https://api.openweathermap.org/data/2.5/air_pollution?lat={lat + offset['dlat']}&lon={lon + offset['dlon']}&appid={API_KEY}"
                weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat + offset['dlat']}&lon={lon + offset['dlon']}&appid={API_KEY}&units=metric"
                async with httpx.AsyncClient() as client:
                    aqi_res, weather_res = await asyncio.gather(
                        client.get(aqi_url),
                        client.get(weather_url)
                    )
                components = aqi_res.json()["list"][0]["components"]
                weather_data = weather_res.json()
                aqi = convert_aqi(components)
                info = get_aqi_category(aqi)
                return {
                    "name": offset["name"],
                    "status": info["category"],
                    "color": info["color"],
                    "aqi": aqi,
                    "pm25": round(components["pm2_5"], 1),
                    "pm10": round(components["pm10"], 1),
                    "temp": round(weather_data["main"]["temp"]),
                    "humidity": weather_data["main"]["humidity"],
                    "windSpeed": round(weather_data["wind"]["speed"], 1),
                }
            except Exception:
                return None

        fetched = await asyncio.gather(*[fetch_offset(o) for o in offsets])
        results = [r for r in fetched if r is not None]
        return {"success": True, "data": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/forecast/{station_id}")
async def get_forecast(station_id: int):
    station = next((s for s in ANDHRA_STATIONS if s["id"] == station_id), None)
    if not station:
        raise HTTPException(status_code=404, detail="Station not found")
    try:
        # Fetch forecast weather data (48 x 3hr slots = next 5 days)
        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={station['lat']}&lon={station['lon']}&appid={API_KEY}&units=metric"
        # Fetch forecast air pollution data
        forecast_aqi_url = f"https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat={station['lat']}&lon={station['lon']}&appid={API_KEY}"

        async with httpx.AsyncClient() as client:
            weather_res, aqi_res = await asyncio.gather(
                client.get(forecast_url),
                client.get(forecast_aqi_url)
            )

        weather_list = weather_res.json()["list"]
        aqi_list = aqi_res.json()["list"]

        # Only next 24 hours (8 x 3hr slots)
        next_24_aqi = aqi_list[:8]
        next_24_weather = weather_list[:8]

        result = []
        for i, item in enumerate(next_24_aqi):
            dt = datetime.datetime.utcfromtimestamp(item["dt"])
            aqi = convert_aqi(item["components"])
            info = get_aqi_category(aqi)
            weather = next_24_weather[i] if i < len(next_24_weather) else {}
            result.append({
                "time": dt.strftime("%I %p"),
                "aqi": aqi,
                "category": info["category"],
                "color": info["color"],
                "pm25": round(item["components"]["pm2_5"], 1),
                "pm10": round(item["components"]["pm10"], 1),
                "temp": round(weather.get("main", {}).get("temp", 0)),
                "humidity": weather.get("main", {}).get("humidity", 0),
                "weather": weather.get("weather", [{}])[0].get("description", ""),
            })

        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))