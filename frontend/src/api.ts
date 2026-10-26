import { MultimodalReport, ScanHistoryItem, SystemStatusData, WeatherPayload, SoilData } from './types';

const API_BASE = '/api';

export async function getSystemStatus(): Promise<SystemStatusData> {
  const res = await fetch(`${API_BASE}/system-status`);
  if (!res.ok) throw new Error('Failed to fetch system status');
  return res.json();
}

export async function getWeatherAndClimate(lat: number, lon: number): Promise<{ live_weather: WeatherPayload; nasa_power_climatology: any }> {
  const res = await fetch(`${API_BASE}/weather?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  return res.json();
}

export async function getSoilData(lat: number, lon: number): Promise<SoilData> {
  const res = await fetch(`${API_BASE}/soil?lat=${lat}&lon=${lon}`);
  if (!res.ok) throw new Error('Failed to fetch soil data');
  return res.json();
}

export async function getSampleLeaves(): Promise<Array<{ key: string; crop: string; disease: string; tamil_name: string; image_url: string }>> {
  const res = await fetch(`${API_BASE}/sample-leaves-list`);
  if (!res.ok) throw new Error('Failed to fetch sample leaves');
  return res.json();
}

export async function getScanHistory(): Promise<ScanHistoryItem[]> {
  const res = await fetch(`${API_BASE}/history`);
  if (!res.ok) throw new Error('Failed to fetch scan history');
  return res.json();
}

export async function submitCropScan(formData: FormData): Promise<MultimodalReport> {
  const res = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Scan failed' }));
    throw new Error(err.detail || 'Multimodal scan failed');
  }
  return res.json();
}

export async function queryAssistant(query: string, crop: string, context?: any) {
  const res = await fetch(`${API_BASE}/assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, crop, context }),
  });
  if (!res.ok) throw new Error('Assistant query failed');
  return res.json();
}

export async function runSimulation(payload: {
  crop: string;
  temperature_c: number;
  humidity_pct: number;
  rainfall_mm: number;
  irrigation_type: string;
  nitrogen_level: string;
}) {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Simulation failed');
  return res.json();
}
