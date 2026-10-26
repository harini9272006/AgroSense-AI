"""
AgroSense AI - Micro-Climate Intelligence Service
Integrates real Open-Meteo & NASA POWER APIs for location-specific
weather, climate indices, and crop disease risk forecasting.
"""

import datetime
import requests
from typing import Dict, Any, Optional

DEFAULT_LOCATIONS = {
    "ariyalur": {"name": "Ariyalur, Tamil Nadu", "lat": 11.1401, "lon": 79.0786, "crop_hub": "Cashew, Sugarcane, Maize"},
    "chengalpattu": {"name": "Chengalpattu, Tamil Nadu", "lat": 12.6841, "lon": 79.9836, "crop_hub": "Paddy, Groundnut, Vegetables"},
    "chennai": {"name": "Chennai, Tamil Nadu", "lat": 13.0827, "lon": 80.2707, "crop_hub": "Urban Farming, Horticulture"},
    "coimbatore": {"name": "Coimbatore, Tamil Nadu", "lat": 11.0168, "lon": 76.9558, "crop_hub": "Cotton, Sugarcane, Tomato"},
    "cuddalore": {"name": "Cuddalore, Tamil Nadu", "lat": 11.7480, "lon": 79.7714, "crop_hub": "Sugarcane, Cashew, Paddy"},
    "dharmapuri": {"name": "Dharmapuri, Tamil Nadu", "lat": 12.1211, "lon": 78.1582, "crop_hub": "Mango, Tomato, Ragi"},
    "dindigul": {"name": "Dindigul, Tamil Nadu", "lat": 10.3673, "lon": 77.9803, "crop_hub": "Vegetables, Onion, Maize"},
    "erode": {"name": "Erode, Tamil Nadu", "lat": 11.3410, "lon": 77.7172, "crop_hub": "Turmeric, Sugarcane, Banana"},
    "kallakurichi": {"name": "Kallakurichi, Tamil Nadu", "lat": 11.7384, "lon": 78.9639, "crop_hub": "Paddy, Sugarcane, Maize"},
    "kanchipuram": {"name": "Kanchipuram, Tamil Nadu", "lat": 12.8342, "lon": 79.7036, "crop_hub": "Paddy, Groundnut, Vegetables"},
    "kanyakumari": {"name": "Kanyakumari, Tamil Nadu", "lat": 8.0883, "lon": 77.5385, "crop_hub": "Rubber, Coconut, Banana"},
    "karur": {"name": "Karur, Tamil Nadu", "lat": 10.9601, "lon": 78.0766, "crop_hub": "Moringa, Paddy, Banana"},
    "krishnagiri": {"name": "Krishnagiri, Tamil Nadu", "lat": 12.5186, "lon": 78.2137, "crop_hub": "Mango, Tomato, Ragi"},
    "madurai": {"name": "Madurai, Tamil Nadu", "lat": 9.9252, "lon": 78.1198, "crop_hub": "Jasmine, Millets, Pulses"},
    "mayiladuthurai": {"name": "Mayiladuthurai, Tamil Nadu", "lat": 11.1075, "lon": 79.6522, "crop_hub": "Paddy (Delta), Pulses"},
    "nagapattinam": {"name": "Nagapattinam, Tamil Nadu", "lat": 10.7672, "lon": 79.8449, "crop_hub": "Paddy, Groundnut, Pulses"},
    "namakkal": {"name": "Namakkal, Tamil Nadu", "lat": 11.2189, "lon": 78.1674, "crop_hub": "Tapioca, Groundnut, Maize"},
    "nilgiris": {"name": "Nilgiris (Ooty), Tamil Nadu", "lat": 11.4102, "lon": 76.6950, "crop_hub": "Tea, Potato, Cabbage, Carrot"},
    "perambalur": {"name": "Perambalur, Tamil Nadu", "lat": 11.2342, "lon": 78.8820, "crop_hub": "Maize, Cotton, Small Onion"},
    "pudukkottai": {"name": "Pudukkottai, Tamil Nadu", "lat": 10.3833, "lon": 78.8001, "crop_hub": "Groundnut, Paddy, Millets"},
    "ramanathapuram": {"name": "Ramanathapuram, Tamil Nadu", "lat": 9.3639, "lon": 78.8395, "crop_hub": "Chilli, Cotton, Paddy"},
    "ranipet": {"name": "Ranipet, Tamil Nadu", "lat": 12.9224, "lon": 79.3326, "crop_hub": "Paddy, Groundnut, Sugarcane"},
    "salem": {"name": "Salem, Tamil Nadu", "lat": 11.6643, "lon": 78.1460, "crop_hub": "Mango, Tapioca, Tomato"},
    "sivaganga": {"name": "Sivaganga, Tamil Nadu", "lat": 9.8433, "lon": 78.4809, "crop_hub": "Paddy, Groundnut, Pulses"},
    "tenkasi": {"name": "Tenkasi, Tamil Nadu", "lat": 8.9594, "lon": 77.3150, "crop_hub": "Paddy, Mango, Coconut"},
    "thanjavur": {"name": "Thanjavur, Tamil Nadu", "lat": 10.7870, "lon": 79.1378, "crop_hub": "Paddy (Rice Bowl), Banana, Coconut"},
    "theni": {"name": "Theni, Tamil Nadu", "lat": 10.0104, "lon": 77.4768, "crop_hub": "Grapes, Cardamom, Banana"},
    "thoothukudi": {"name": "Thoothukudi, Tamil Nadu", "lat": 8.7642, "lon": 78.1348, "crop_hub": "Cotton, Chilli, Pulses, Onion"},
    "tiruchirappalli": {"name": "Tiruchirappalli (Trichy), TN", "lat": 10.7905, "lon": 78.7047, "crop_hub": "Banana, Paddy, Sugarcane"},
    "tirunelveli": {"name": "Tirunelveli, Tamil Nadu", "lat": 8.7139, "lon": 77.7567, "crop_hub": "Paddy, Banana, Pulses"},
    "tirupathur": {"name": "Tirupathur, Tamil Nadu", "lat": 12.4925, "lon": 78.5678, "crop_hub": "Groundnut, Paddy, Millets"},
    "tiruppur": {"name": "Tiruppur, Tamil Nadu", "lat": 11.1085, "lon": 77.3411, "crop_hub": "Cotton, Maize, Coconut"},
    "tiruvallur": {"name": "Tiruvallur, Tamil Nadu", "lat": 13.1432, "lon": 79.9074, "crop_hub": "Paddy, Vegetables, Watermelon"},
    "tiruvannamalai": {"name": "Tiruvannamalai, Tamil Nadu", "lat": 12.2253, "lon": 79.0747, "crop_hub": "Groundnut, Paddy, Sugarcane"},
    "tiruvarur": {"name": "Tiruvarur, Tamil Nadu", "lat": 10.7725, "lon": 79.6365, "crop_hub": "Paddy (Delta), Pulses"},
    "vellore": {"name": "Vellore, Tamil Nadu", "lat": 12.9165, "lon": 79.1325, "crop_hub": "Groundnut, Banana, Vegetables"},
    "viluppuram": {"name": "Viluppuram, Tamil Nadu", "lat": 11.9401, "lon": 79.4861, "crop_hub": "Sugarcane, Paddy, Tapioca"},
    "virudhunagar": {"name": "Virudhunagar, Tamil Nadu", "lat": 9.5680, "lon": 77.9624, "crop_hub": "Cotton, Chilli, Millets"}
}

CLIMATE_CACHE = {}

def fetch_live_weather(lat: float, lon: float) -> Dict[str, Any]:
    cache_key = f"weather_{round(lat, 2)}_{round(lon, 2)}"
    if cache_key in CLIMATE_CACHE:
        return CLIMATE_CACHE[cache_key]

    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m",
        "hourly": "temperature_2m,relative_humidity_2m,dew_point_2m,precipitation_probability",
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,et0_fao_evapotranspiration",
        "timezone": "auto"
    }
    
    try:
        response = requests.get(url, params=params, timeout=2.5)
        if response.status_code == 200:
            data = response.json()
            curr = data.get("current", {})
            daily = data.get("daily", {})
            
            # Format daily 7-day forecast
            forecast_days = []
            dates = daily.get("time", [])
            t_max = daily.get("temperature_2m_max", [])
            t_min = daily.get("temperature_2m_min", [])
            precip = daily.get("precipitation_sum", [])
            precip_prob = daily.get("precipitation_probability_max", [])
            et0 = daily.get("et0_fao_evapotranspiration", [])
            w_codes = daily.get("weather_code", [])
            
            for i in range(min(7, len(dates))):
                forecast_days.append({
                    "date": dates[i],
                    "day_name": datetime.datetime.strptime(dates[i], "%Y-%m-%d").strftime("%a"),
                    "temp_max": t_max[i] if i < len(t_max) else 30.0,
                    "temp_min": t_min[i] if i < len(t_min) else 22.0,
                    "precipitation_mm": precip[i] if i < len(precip) else 0.0,
                    "rain_prob": precip_prob[i] if i < len(precip_prob) else 10,
                    "evapotranspiration_mm": et0[i] if i < len(et0) else 4.2,
                    "condition": weather_code_to_text(w_codes[i] if i < len(w_codes) else 0)
                })
                
            res = {
                "source": "Open-Meteo Live API",
                "status": "LIVE_DATA",
                "latitude": lat,
                "longitude": lon,
                "current": {
                    "temperature_c": curr.get("temperature_2m", 26.5),
                    "apparent_temperature_c": curr.get("apparent_temperature", 28.0),
                    "relative_humidity_pct": curr.get("relative_humidity_2m", 72),
                    "precipitation_mm": curr.get("precipitation", 0.0),
                    "wind_speed_kmh": curr.get("wind_speed_10m", 8.5),
                    "wind_direction_deg": curr.get("wind_direction_10m", 180),
                    "condition": weather_code_to_text(curr.get("weather_code", 0)),
                    "observed_at": curr.get("time", datetime.datetime.now().isoformat())
                },
                "forecast_7d": forecast_days
            }
            CLIMATE_CACHE[cache_key] = res
            return res
    except Exception as e:
        print(f"[ClimateService] Live Open-Meteo API exception: {e}. Falling back to regional baseline.")
        
    fallback = get_regional_weather_fallback(lat, lon)
    CLIMATE_CACHE[cache_key] = fallback
    return fallback


def fetch_nasa_power_climatology(lat: float, lon: float) -> Dict[str, Any]:
    cache_key = f"nasa_{round(lat, 2)}_{round(lon, 2)}"
    if cache_key in CLIMATE_CACHE:
        return CLIMATE_CACHE[cache_key]

    today = datetime.date.today()
    end_date = (today - datetime.timedelta(days=4)).strftime("%Y%m%d")
    start_date = (today - datetime.timedelta(days=12)).strftime("%Y%m%d")
    
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        "parameters": "T2M,RH2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN,T2MDEW",
        "community": "AG",
        "longitude": lon,
        "latitude": lat,
        "start": start_date,
        "end": end_date,
        "format": "JSON"
    }
    
    try:
        res = requests.get(url, params=params, timeout=2.5)
        if res.status_code == 200:
            data = res.json()
            params_data = data.get("properties", {}).get("parameter", {})
            rh_series = list(params_data.get("RH2M", {}).values())
            temp_series = list(params_data.get("T2M", {}).values())
            rain_series = list(params_data.get("PRECTOTCORR", {}).values())
            solar_series = list(params_data.get("ALLSKY_SFC_SW_DWN", {}).values())
            
            valid_rh = [v for v in rh_series if v != -999.0]
            valid_temp = [v for v in temp_series if v != -999.0]
            valid_rain = [v for v in rain_series if v != -999.0]
            valid_solar = [v for v in solar_series if v != -999.0]
            
            avg_rh = sum(valid_rh) / len(valid_rh) if valid_rh else 74.0
            avg_temp = sum(valid_temp) / len(valid_temp) if valid_temp else 27.5
            total_rain = sum(valid_rain) if valid_rain else 12.0
            avg_solar = sum(valid_solar) / len(valid_solar) if valid_solar else 18.5
            
            res_nasa = {
                "source": "NASA POWER Agroclimatology API",
                "status": "LIVE_SATELLITE_DATA",
                "coverage_period": f"{start_date} to {end_date}",
                "mean_temperature_c": round(avg_temp, 1),
                "mean_relative_humidity_pct": round(avg_rh, 1),
                "total_precipitation_mm": round(total_rain, 1),
                "solar_radiation_mj_m2": round(avg_solar, 1),
                "is_validated_satellite": True
            }
            CLIMATE_CACHE[cache_key] = res_nasa
            return res_nasa
    except Exception as e:
        print(f"[ClimateService] NASA POWER query note: {e}. Utilizing regional agro-climate baseline.")
        
    fallback = {
        "source": "NASA POWER Climatology Baseline",
        "status": "ESTIMATED_BASELINE",
        "mean_temperature_c": 27.2,
        "mean_relative_humidity_pct": 73.5,
        "total_precipitation_mm": 18.4,
        "solar_radiation_mj_m2": 19.1,
        "is_validated_satellite": False
    }
    CLIMATE_CACHE[cache_key] = fallback
    return fallback


def weather_code_to_text(code: int) -> str:
    codes = {
        0: "Clear Sky",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Depositing Rime Fog",
        51: "Light Drizzle",
        53: "Moderate Drizzle",
        55: "Dense Drizzle",
        61: "Slight Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        80: "Slight Rain Showers",
        81: "Moderate Showers",
        82: "Violent Rain Showers",
        95: "Thunderstorm"
    }
    return codes.get(code, "Partly Cloudy")


def get_regional_weather_fallback(lat: float, lon: float) -> Dict[str, Any]:
    """Generates realistic regional fallback with explicit tag."""
    now = datetime.datetime.now()
    days = []
    base_temps = [29, 31, 28, 27, 30, 32, 29]
    for i in range(7):
        d = now + datetime.timedelta(days=i)
        days.append({
            "date": d.strftime("%Y-%m-%d"),
            "day_name": d.strftime("%a"),
            "temp_max": base_temps[i],
            "temp_min": base_temps[i] - 7,
            "precipitation_mm": 2.5 if i % 2 == 0 else 0.0,
            "rain_prob": 35 if i % 2 == 0 else 10,
            "evapotranspiration_mm": 4.1,
            "condition": "Partly Cloudy" if i % 2 != 0 else "Scattered Showers"
        })
        
    return {
        "source": "Regional Agro-Climatic Model (Offline Mode)",
        "status": "DEMO_FALLBACK",
        "latitude": lat,
        "longitude": lon,
        "current": {
            "temperature_c": 26.5,
            "apparent_temperature_c": 28.0,
            "relative_humidity_pct": 76,
            "precipitation_mm": 0.0,
            "wind_speed_kmh": 11.0,
            "wind_direction_deg": 190,
            "condition": "Partly Cloudy",
            "observed_at": now.isoformat()
        },
        "forecast_7d": days
    }
