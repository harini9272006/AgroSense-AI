"""
AgroSense AI - What-If Farm Simulator Engine
Simulates dynamic micro-climatic and agronomic scenarios:
Evaluates how altering temperature, humidity, rainfall, irrigation method,
and nitrogen fertilization shifts crop disease vulnerability.
"""

from typing import Dict, Any

def run_farm_simulation(
    crop: str,
    temperature_c: float,
    humidity_pct: float,
    rainfall_mm: float,
    irrigation_type: str, # "Drip", "Furrow", "Overhead Sprinkler"
    nitrogen_level: str   # "Low", "Balanced", "High", "Excessive"
) -> Dict[str, Any]:
    """
    Bio-mathematical disease pressure simulation.
    """
    # Base fungal risk calculation
    fungal_score = 15.0
    
    # Humidity factor
    if humidity_pct > 80:
        fungal_score += (humidity_pct - 80) * 1.8 + 25
    elif humidity_pct > 65:
        fungal_score += (humidity_pct - 65) * 1.0 + 10
    else:
        fungal_score -= (65 - humidity_pct) * 0.4
        
    # Temperature curve
    # Most crop fungi have optimal bell-curve between 18°C and 28°C
    if 18 <= temperature_c <= 28:
        fungal_score += 20
    elif temperature_c > 35:
        fungal_score -= 18 # High heat suppresses foliar fungi
    elif temperature_c < 12:
        fungal_score -= 10
        
    # Irrigation impact
    if irrigation_type == "Overhead Sprinkler":
        fungal_score += 22.0
        irrigation_note = "Overhead sprinkler increases leaf canopy wetness duration by 4-6 hours, dramatically elevating spore germination."
    elif irrigation_type == "Furrow":
        fungal_score += 8.0
        irrigation_note = "Furrow irrigation increases root-zone soil saturation and bottom-canopy humidity."
    else: # Drip
        fungal_score -= 5.0
        irrigation_note = "Drip irrigation targets root zone with zero canopy splash, strongly suppressing airborne fungal transmission."
        
    # Nitrogen impact
    if nitrogen_level == "Excessive":
        fungal_score += 15.0
        n_note = "Excess nitrogen stimulates succulent vegetative growth with thinner leaf cuticles, rendering tissue vulnerable to fungal penetration."
    elif nitrogen_level == "High":
        fungal_score += 8.0
        n_note = "High nitrogen encourages dense leaf canopy, restricting wind airflow and trapping humidity."
    elif nitrogen_level == "Low":
        n_note = "Low nitrogen causes mild chlorosis and stunting, but does not promote foliar fungal epidemics."
    else:
        n_note = "Balanced fertilization maintains optimal plant structural lignification."
        
    # Bacterial risk (warm + wet + splash)
    bacterial_score = 10.0
    if temperature_c >= 26 and (humidity_pct > 75 or rainfall_mm > 20):
        bacterial_score += 35.0
    if irrigation_type == "Overhead Sprinkler":
        bacterial_score += 25.0
        
    # Insect pest risk (dry + warm favors thrips/mites; warm + humid favors planthoppers)
    pest_score = 20.0
    if temperature_c > 30 and humidity_pct < 60:
        pest_score += 35.0 # Spider mites / thrips thrive in dry heat
        pest_type = "Spider Mites / Thrips / Whiteflies"
    elif humidity_pct > 80 and 24 <= temperature_c <= 32:
        pest_score += 25.0
        pest_type = "Brown Planthopper / Aphid vectors"
    else:
        pest_type = "General Field Insects (Low Pressure)"
        
    # Clamp scores
    fungal_score = max(5.0, min(98.0, round(fungal_score, 1)))
    bacterial_score = max(5.0, min(95.0, round(bacterial_score, 1)))
    pest_score = max(5.0, min(92.0, round(pest_score, 1)))
    
    overall_vulnerability = round((fungal_score * 0.5) + (bacterial_score * 0.3) + (pest_score * 0.2), 1)
    
    # Identify primary disease risk based on crop and climate
    primary_threat = identify_threat(crop, temperature_c, humidity_pct, fungal_score)
    
    # Determine risk category
    if overall_vulnerability >= 70:
        status = "HIGH_ALERT"
        status_label = "Severe Disease Pressure"
    elif overall_vulnerability >= 45:
        status = "MODERATE_RISK"
        status_label = "Moderate Disease Pressure"
    else:
        status = "OPTIMAL_GROWTH"
        status_label = "Low Pathogen Stress"
        
    return {
        "crop": crop,
        "input_parameters": {
            "temperature_c": temperature_c,
            "humidity_pct": humidity_pct,
            "rainfall_mm": rainfall_mm,
            "irrigation_type": irrigation_type,
            "nitrogen_level": nitrogen_level
        },
        "vulnerability_scores": {
            "overall_vulnerability": overall_vulnerability,
            "fungal_risk": fungal_score,
            "bacterial_risk": bacterial_score,
            "pest_risk": pest_score,
            "threat_label": status_label,
            "threat_code": status
        },
        "primary_threat": primary_threat,
        "identified_pest_cluster": pest_type,
        "epidemiological_analysis": [
            f"Fungal disease risk evaluated at {fungal_score}% based on thermal range ({temperature_c}°C) and humidity ({humidity_pct}%).",
            irrigation_note,
            n_note
        ],
        "mitigation_strategies": [
            "Convert overhead sprinklers to drip irrigation to drop fungal vulnerability by ~20%.",
            "Adjust nitrogen fertilizer to balanced split-dosing.",
            "Apply prophylactic bio-protectant (Pseudomonas fluorescens) 24 hours prior to anticipated rainfall."
        ]
    }


def identify_threat(crop: str, temp: float, rh: float, fungal_score: float) -> Dict[str, str]:
    crop_lower = crop.lower()
    if "tomato" in crop_lower:
        if rh > 80 and temp < 24:
            return {"name": "Late Blight (Phytophthora infestans)", "urgency": "High", "action": "Foliar Copper Oxychloride spray"}
        elif temp >= 25 and rh >= 65:
            return {"name": "Early Blight (Alternaria solani)", "urgency": "Moderate", "action": "Trichoderma viride spray & bottom leaf pruning"}
        else:
            return {"name": "Leaf Mold / Mildew", "urgency": "Low", "action": "Ensure inter-row ventilation"}
    elif "potato" in crop_lower:
        if rh > 80:
            return {"name": "Late Blight (Phytophthora infestans)", "urgency": "Critical", "action": "Preventive systemic fungicide application"}
        else:
            return {"name": "Early Blight / Tuber Rot", "urgency": "Low to Moderate", "action": "Regulate soil moisture"}
    elif "rice" in crop_lower or "paddy" in crop_lower:
        if rh > 85 and 20 <= temp <= 28:
            return {"name": "Rice Blast (Magnaporthe oryzae)", "urgency": "High", "action": "Avoid top-dress nitrogen, apply Tricyclazole"}
        else:
            return {"name": "Brown Spot (Bipolaris oryzae)", "urgency": "Moderate", "action": "Apply potash & zinc nutrition"}
    elif "corn" in crop_lower or "maize" in crop_lower:
        return {"name": "Common Rust (Puccinia sorghi)", "urgency": "Moderate", "action": "Monitor lower leaf pustules"}
    else:
        return {"name": "Bacterial Leaf Spot", "urgency": "Moderate", "action": "Copper hydroxide spray"}
