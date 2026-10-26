export interface ClassPrediction {
  class_name: string;
  crop: string;
  disease: string;
  tamil_name: string;
  confidence: number;
  pathogen: string;
}

export interface ActionPlanItem {
  priority: string;
  category: string;
  title_en: string;
  title_ta: string;
  description_en: string;
  description_ta: string;
}

export interface WeatherCurrent {
  temperature_c: number;
  apparent_temperature_c: number;
  relative_humidity_pct: number;
  precipitation_mm: number;
  wind_speed_kmh: number;
  wind_direction_deg: number;
  condition: string;
  observed_at: string;
}

export interface ForecastDay {
  date: string;
  day_name: string;
  temp_max: number;
  temp_min: number;
  precipitation_mm: number;
  rain_prob: number;
  evapotranspiration_mm: number;
  condition: string;
}

export interface WeatherPayload {
  source: string;
  status: string;
  latitude: number;
  longitude: number;
  current: WeatherCurrent;
  forecast_7d: ForecastDay[];
}

export interface NasaPowerClimatology {
  source: string;
  status: string;
  coverage_period?: string;
  mean_temperature_c: number;
  mean_relative_humidity_pct: number;
  total_precipitation_mm: number;
  solar_radiation_mj_m2: number;
  is_validated_satellite: boolean;
}

export interface SoilData {
  source: string;
  status: string;
  latitude: number;
  longitude: number;
  topsoil_0_5cm: {
    ph: number;
    ph_status: string;
    organic_carbon_g_kg: number;
    organic_carbon_rating: string;
    clay_percent: number;
    sand_percent: number;
    silt_percent: number;
    texture_class: string;
  };
  depth_profile: {
    [depth: string]: {
      ph: number;
      soc: number;
      clay: number;
    };
  };
  agricultural_insights: string[];
}

export interface MultimodalReport {
  scan_id: string;
  timestamp: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  crop_metadata: {
    selected_crop: string;
    growth_stage: string;
    farmer_symptoms: string[];
    image_url: string;
  };
  computer_vision: {
    top_prediction: ClassPrediction;
    all_predictions: ClassPrediction[];
    class_info: any;
    inference_engine: string;
    model_status: string;
  };
  environmental_context: {
    weather: WeatherPayload;
    nasa_power_climatology: NasaPowerClimatology;
    soil: SoilData;
  };
  contextual_diagnosis: {
    engine_version: string;
    primary_diagnosis: {
      disease_name: string;
      tamil_name: string;
      pathogen_type: string;
      severity_level: string;
      raw_model_confidence: number;
      context_adjusted_confidence: number;
      concordance_status: string;
      agreement_badge: string;
      agreement_label: string;
    };
    multimodal_evidence: {
      climate_evidence: string[];
      soil_evidence: string[];
      symptom_overlap: string[];
      data_source_verification: {
        weather_provider: string;
        weather_status: string;
        soil_provider: string;
        soil_status: string;
        is_simulated_demo: boolean;
      };
    };
    environmental_warnings: string[];
    action_plan: ActionPlanItem[];
    alternative_diagnoses: ClassPrediction[];
    growth_stage_impact: string;
  };
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string;
  crop: string;
  field_zone: string;
  disease_detected: string;
  tamil_name: string;
  confidence: number;
  severity: string;
  status: string;
  action_taken: string;
  image_url: string;
}

export interface SystemStatusData {
  vision_model: {
    name: string;
    status: string;
    accuracy: string;
    framework: string;
    weights_file: boolean;
    classes_count: number;
  };
  weather_service: {
    primary: string;
    climatology: string;
    status: string;
    supports_live_queries: boolean;
  };
  soil_service: {
    provider: string;
    status: string;
    measured_properties: string[];
  };
  multimodal_intelligence: {
    engine: string;
    status: string;
    epidemiological_rules: number;
  };
}
