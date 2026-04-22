import httpx
import httpx
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")
ANDHRA_STATIONS = [
    {"id": 101, "name": "Vijayawada",        "lat": 16.5062, "lon": 80.6480},
    {"id": 102, "name": "Visakhapatnam",     "lat": 17.6868, "lon": 83.2185},
    {"id": 103, "name": "Tirupati",          "lat": 13.6288, "lon": 79.4192},
    {"id": 104, "name": "Guntur",            "lat": 16.3067, "lon": 80.4365},
    {"id": 105, "name": "Nellore",           "lat": 14.4426, "lon": 79.9865},
    {"id": 106, "name": "Kurnool",           "lat": 15.8281, "lon": 78.0373},
    {"id": 107, "name": "Kakinada",          "lat": 16.9891, "lon": 82.2475},
    {"id": 108, "name": "Rajahmundry",       "lat": 17.0005, "lon": 81.8040},
    {"id": 109, "name": "Kadapa",            "lat": 14.4674, "lon": 78.8241},
    {"id": 110, "name": "Anantapur",         "lat": 14.6819, "lon": 77.6006},
    {"id": 111, "name": "Vizianagaram",      "lat": 18.1066, "lon": 83.3956},
    {"id": 112, "name": "Eluru",             "lat": 16.7107, "lon": 81.0952},
    {"id": 113, "name": "Ongole",            "lat": 15.5057, "lon": 80.0499},
    {"id": 114, "name": "Nandyal",           "lat": 15.4786, "lon": 78.4836},
    {"id": 115, "name": "Machilipatnam",     "lat": 16.1875, "lon": 81.1389},
    {"id": 116, "name": "Adoni",             "lat": 15.6270, "lon": 77.2740},
    {"id": 117, "name": "Tenali",            "lat": 16.2430, "lon": 80.6400},
    {"id": 118, "name": "Chittoor",          "lat": 13.2172, "lon": 79.1003},
    {"id": 119, "name": "Hindupur",          "lat": 13.8290, "lon": 77.4910},
    {"id": 120, "name": "Srikakulam",        "lat": 18.2949, "lon": 83.8938},
    {"id": 121, "name": "Bhimavaram",        "lat": 16.5440, "lon": 81.5220},
    {"id": 122, "name": "Tadepalligudem",    "lat": 16.8130, "lon": 81.5260},
    {"id": 123, "name": "Narasaraopet",      "lat": 16.2340, "lon": 80.0490},
    {"id": 124, "name": "Proddatur",         "lat": 14.7500, "lon": 78.5500},
    {"id": 125, "name": "Rajampet",          "lat": 14.1860, "lon": 79.1620},
    {"id": 126, "name": "Madanapalle",       "lat": 13.5500, "lon": 78.5000},
    {"id": 127, "name": "Guntakal",          "lat": 15.1700, "lon": 77.3800},
    {"id": 128, "name": "Dharmavaram",       "lat": 14.4140, "lon": 77.7180},
    {"id": 129, "name": "Gudivada",          "lat": 16.4340, "lon": 80.9940},
    {"id": 130, "name": "Narasapuram",       "lat": 16.4350, "lon": 81.6970},
    {"id": 131, "name": "Amaravati",         "lat": 16.5130, "lon": 80.3550},
    {"id": 132, "name": "Puttaparthi",       "lat": 14.1650, "lon": 77.8180},
    {"id": 133, "name": "Sullurpeta",        "lat": 13.7000, "lon": 80.0200},
    {"id": 134, "name": "Bapatla",           "lat": 15.9040, "lon": 80.4670},
    {"id": 135, "name": "Kavali",            "lat": 14.9160, "lon": 79.9940},
]


def convert_aqi(components):
    pm25 = components.get("pm2_5", 0)
    if pm25 <= 12:    return round((50 / 12) * pm25)
    if pm25 <= 35.4:  return round(50 + ((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1))
    if pm25 <= 55.4:  return round(101 + ((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5))
    if pm25 <= 150.4: return round(151 + ((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5))
    if pm25 <= 250.4: return round(201 + ((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5))
    return round(301 + ((500 - 301) / (500 - 250.5)) * (pm25 - 250.5))

def get_aqi_category(aqi):
    if aqi <= 50:  return {"category": "Good",                           "color": "#00e400", "advice": "Air quality is satisfactory. Enjoy outdoor activities."}
    if aqi <= 100: return {"category": "Moderate",                       "color": "#ffff00", "advice": "Sensitive people should consider reducing outdoor activity."}
    if aqi <= 150: return {"category": "Unhealthy for Sensitive Groups",  "color": "#ff7e00", "advice": "People with respiratory conditions should limit outdoor activity."}
    if aqi <= 200: return {"category": "Unhealthy",                      "color": "#ff0000", "advice": "Everyone should reduce prolonged outdoor activity."}
    if aqi <= 300: return {"category": "Very Unhealthy",                 "color": "#8f3f97", "advice": "Avoid outdoor activity. Keep windows closed."}
    return              {"category": "Hazardous",                        "color": "#7e0023", "advice": "Stay indoors. Avoid all outdoor physical activity."}

async def fetch_station_aqi(station):
    url = f"https://api.openweathermap.org/data/2.5/air_pollution?lat={station['lat']}&lon={station['lon']}&appid={API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = response.json()["list"][0]

    aqi = convert_aqi(data["components"])
    info = get_aqi_category(aqi)
    timestamp = datetime.utcfromtimestamp(data["dt"]).isoformat()


    return {
        "id": station["id"],
        "station": station["name"],
        "lat": station["lat"],
        "lon": station["lon"],
        "aqi": aqi,
        "category": info["category"],
        "color": info["color"],
        "advice": info["advice"],
        "pollutants": {
            "pm25": data["components"]["pm2_5"],
            "pm10": data["components"]["pm10"],
            "o3":   data["components"]["o3"],
            "no2":  data["components"]["no2"],
            "so2":  data["components"]["so2"],
            "co":   data["components"]["co"],
        },
        "timestamp": timestamp,
    }

async def fetch_all_stations():
    import asyncio
    results = []
    for station in ANDHRA_STATIONS:
        try:
            data = await fetch_station_aqi(station)
            results.append(data)
            await asyncio.sleep(0.2)
        except Exception:
            pass
    return results

async def fetch_historical_aqi(station, hours=168):
    import time
    end = int(time.time())
    start = end - hours * 3600

    url = f"http://api.openweathermap.org/data/2.5/air_pollution/history?lat={station['lat']}&lon={station['lon']}&start={start}&end={end}&appid={API_KEY}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        items = response.json()["list"]

    if hours <= 24:
        result = []
        for item in items:
            dt = datetime.utcfromtimestamp(item["dt"])
            label = dt.strftime("%I %p")
            result.append({
                "date": label,
                "aqi": convert_aqi(item["components"]),
                "pm25": round(item["components"]["pm2_5"], 1),
                "pm10": round(item["components"]["pm10"], 1),
            })
        return result[-24:]
    else:
        days = {}
        for item in items:
            date = datetime.utcfromtimestamp(item["dt"]).strftime("%d %b").lstrip("0")
            aqi_val = convert_aqi(item["components"])
            pm25_val = item["components"]["pm2_5"]
            pm10_val = item["components"]["pm10"]
            if date not in days:
                days[date] = {"aqi": [], "pm25": [], "pm10": []}
            days[date]["aqi"].append(aqi_val)
            days[date]["pm25"].append(pm25_val)
            days[date]["pm10"].append(pm10_val)

        return [
            {
                "date": date,
                "aqi": round(sum(v["aqi"]) / len(v["aqi"])),
                "pm25": round(sum(v["pm25"]) / len(v["pm25"]), 1),
                "pm10": round(sum(v["pm10"]) / len(v["pm10"]), 1),
            }
            for date, v in days.items()
        ]