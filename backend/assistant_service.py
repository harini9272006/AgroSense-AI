"""
AgroSense AI - Local Language Farm Assistant (English & Tamil / Tanglish)
Provides verified agronomic advice, disease explanations, organic bio-remedies
(Panchagavya, Jeevamrutham, Neem oil), and KVK advisory support.
"""

from typing import Dict, Any, List

# Agricultural Knowledge Base for Tamil Nadu / Indian Farming
KNOWLEDGE_RULES = [
    {
        "keywords": ["manjal", "yellow", "manjal aagudhu", "yellowing", "மஞ்சள்"],
        "topic": "Leaf Yellowing / Chlorosis",
        "answer_en": "Leaf yellowing (chlorosis) in tomato/crops is typically caused by: (1) Nitrogen deficiency if starting from older bottom leaves, (2) Iron/Magnesium deficiency if in new top leaves with green veins, or (3) Early stage fungal blight / root rot due to waterlogged soil. Check soil drainage and apply balanced micronutrient spray or 1% urea/vermicompost tea.",
        "answer_ta": "தக்காளி இலைகள் மஞ்சள் நிறமாக மாறுவதற்கு முக்கிய காரணங்கள்: (1) கீழ் இலைகள் மஞ்சள் ஆனால் தழைச்சத்து (Nitrogen) பற்றாக்குறை, (2) மேல் இளம் இலைகள் மஞ்சள் ஆனால் நுண்ணூட்டச்சத்து குறைபாடு, (3) வேர் அழுகல் அல்லது அதிக நீர் தேங்குதல். வேப்பம்பிண்ணாக்கு மற்றும் மண்புழு உரம் இட்டு சொட்டு நீர் அளவை சீரமைக்கவும்.",
        "remedy": "Foliar spray of 19:19:19 (5g/L) + Panchagavya 3% spray in evening hours.",
        "precautions": "Ensure raised beds and avoid standing water at root zone."
    },
    {
        "keywords": ["weather", "spread", "kalavizhai", "paravuma", "பரவுமா", "மழை", "rain", "humidity"],
        "topic": "Weather-Induced Disease Epidemic Risk",
        "answer_en": "High relative humidity (>75%) coupled with moderate temperatures (20-28°C) creates a critical infection window for fungal pathogens like Late Blight and Rice Blast. Prolonged leaf wetness exceeding 4-6 hours accelerates fungal spore germination.",
        "answer_ta": "தற்போதைய காற்றில் உள்ள அதிக ஈரப்பதம் (>75%) மற்றும் மிதமான வெப்பநிலை பூஞ்சை நோய்கள் (Late Blight, Blast) வேகமாக பரவ சாதகமானது. இலைகளில் 4 மணி நேரத்திற்கு மேல் நீர் தங்கியிருந்தால் நோய்த்தொற்று மிக விரைவாக பரவும்.",
        "remedy": "Halt overhead sprinkler watering. Spray prophylactic Pseudomonas fluorescens (20g/L) before rain spells.",
        "precautions": "Improve field aeration by trimming touching lower foliage."
    },
    {
        "keywords": ["precaution", "precautions", "enna pannanum", "what to do", "முன்னெச்சரிக்கை", "நடவடிக்கை", "cure"],
        "topic": "Immediate Agronomic Precautions",
        "answer_en": "Immediate recommended actions: (1) Prune and safely incinerate heavily infected foliage, (2) Switch to early morning root-zone drip irrigation, (3) Spray bio-fungicide (Trichoderma or Bacillus subtilis) to coat leaf cuticles, (4) Avoid excess synthetic nitrogen fertilizers which create soft, vulnerable tissue.",
        "answer_ta": "உடனடி முன்னெச்சரிக்கைகள்: (1) பாதிக்கப்பட்ட இலைகளை கிள்ளி வயலை விட்டு அப்புறப்படுத்தி எரிக்கவும், (2) தெளிப்பான் பாசனத்தை நிறுத்தி காலையில் வேர் பகுதியில் மட்டும் நீர் பாய்ச்சவும், (3) டிரைக்கோடெர்மா விரிடி அல்லது சூடோமோனாஸ் தெளிக்கவும், (4) அதிகப்படியான யூரியா தழைச்சத்து இடுவதை தவிர்க்கவும்.",
        "remedy": "Apply 1% Bordeaux mixture or 5% Neem Seed Kernel Extract (NSKE).",
        "precautions": "Disinfect pruning secateurs with 70% alcohol or boiling water."
    },
    {
        "keywords": ["panchagavya", "பஞ்சகாவ்யா", "organic", "iyarkai", "இயற்கை"],
        "topic": "Panchagavya Organic Bio-Stimulant",
        "answer_en": "Panchagavya formulation: Mix 5kg fresh cow dung, 3L cow urine, 2L cow milk, 2L curd, 1kg ghee + 3L sugarcane juice/jaggery water, 12 bananas, and 3L tender coconut water. Ferment for 18-21 days with daily stirring. Spray at 3% concentration (30ml per liter water).",
        "answer_ta": "பஞ்சகாவ்யா தயாரிக்கும் முறை: சாணம் 5 கிலோ, கோமியம் 3 லிட்டர், பால் 2 லிட்டர், தயிர் 2 லிட்டர், நெய் 1 கிலோ, கரும்புச்சாறு 3 லிட்டர், நன்கு கனிந்த வாழைப்பழம் 12, இளநீர் 3 லிட்டர். 21 நாட்கள் தினசரி காலையும் மாலையும் கலக்கி வைக்கவும். 1 லிட்டர் தண்ணீருக்கு 30 மி.லி (3%) கலந்து மாலை நேரத்தில் தெளிக்கவும்.",
        "remedy": "Acts as immunity booster, root developer, and systemic resistance inducer.",
        "precautions": "Filter thoroughly using fine cotton mesh before pouring into spray nozzle."
    },
    {
        "keywords": ["karugal", "blight", "early blight", "late blight", "கருகல்", "புள்ளி"],
        "topic": "Blight Disease Management",
        "answer_en": "For Blight infections: Concentric rings indicate Early Blight (Alternaria), while water-soaked greyish rotting indicates Late Blight (Phytophthora). Apply Copper Oxychloride (COC 50 WP @ 2.5g/L) or systemic Mancozeb / Metalaxyl under heavy pressure.",
        "answer_ta": "இலைக்கருகல் நோய்க்கு: வளைய வடிவ புள்ளிகள் இருந்தால் ஆரம்பக் கருகல் (Early Blight); இலைகள் அழுகி சாம்பல் நிற பூஞ்சணம் படர்ந்தால் பின் கருகல் (Late Blight). காப்பர் ஆக்சிகுளோரைடு 50 WP (2.5 கிராம்/லிட்டர்) அல்லது மாங்கோசெப் தெளிக்கவும்.",
        "remedy": "Spray during dry morning windows so chemical adheres before dew forms.",
        "precautions": "Observe a mandatory 7-day pre-harvest waiting period after chemical spray."
    }
]

DEFAULT_FALLBACK = {
    "topic": "General Crop Diagnostic Advisory",
    "answer_en": "Based on our multimodal database: Maintain regular field scouting, inspect leaf undersides for fungal mycelium or aphid clusters, and monitor local humidity. If symptoms persist beyond 48 hours, bring a fresh leaf sample to your nearest Krishi Vigyan Kendra (KVK) or TNAU extension center.",
    "answer_ta": "பயிர் பாதுகாப்பு வழிகாட்டல்: உங்கள் பயிர் இலைகளின் அடிப்பகுதியை தொடர்ந்து கவனிக்கவும். பூஞ்சை அல்லது பூச்சி தாக்குதல் இருந்தால் உடனடியாக வேப்ப எண்ணெய் (5 மி.லி/லி) தெளிக்கவும். சந்தேகம் இருப்பின் அருகிலுள்ள வேளாண் அறிவியல் மையம் (KVK) அல்லது தமிழ்நாடு வேளாண்மை பல்கலைக்கழக மையத்தை தொடர்பு கொள்ளவும்.",
    "remedy": "Neem Oil 5ml/L + Khadi soap emulsifier or Trichoderma harzianum 20g/L.",
    "precautions": "Do not mix chemical bactericides with beneficial microbial biofertilizers."
}

def ask_farm_assistant(query: str, current_crop: str = "Tomato", context: Dict[str, Any] = None) -> Dict[str, Any]:
    """
    Answers farmer queries in English, Tamil, or Tanglish with situational intelligence.
    """
    q_lower = query.lower()
    matched_rule = None
    
    for rule in KNOWLEDGE_RULES:
        for kw in rule["keywords"]:
            if kw.lower() in q_lower:
                matched_rule = rule
                break
        if matched_rule:
            break
            
    if not matched_rule:
        matched_rule = DEFAULT_FALLBACK
        
    # Append contextual micro-climate if present
    weather_snippet_en = ""
    weather_snippet_ta = ""
    if context and "weather" in context:
        temp = context["weather"].get("temperature_c", 26)
        rh = context["weather"].get("relative_humidity_pct", 75)
        weather_snippet_en = f" (Current local weather: {temp}°C, {rh}% humidity)."
        weather_snippet_ta = f" (தற்போதைய உள்ளூர் வானிலை: {temp}°C, {rh}% ஈரப்பதம்)."
        
    return {
        "query": query,
        "crop_context": current_crop,
        "topic": matched_rule["topic"],
        "answer_english": matched_rule["answer_en"] + weather_snippet_en,
        "answer_tamil": matched_rule["answer_ta"] + weather_snippet_ta,
        "suggested_remedy": matched_rule.get("remedy", ""),
        "safety_precaution": matched_rule.get("precautions", ""),
        "trusted_advisories": [
            "Tamil Nadu Agricultural University (TNAU) Agritech Portal",
            "ICAR - Krishi Vigyan Kendra (KVK)",
            "National Institute of Plant Health Management (NIPHM)"
        ]
    }
