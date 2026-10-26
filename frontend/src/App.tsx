import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { ClimatePage } from './pages/ClimatePage';
import { SoilPage } from './pages/SoilPage';
import { ReportsPage } from './pages/ReportsPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { AssistantPage } from './pages/AssistantPage';
import { AboutPage } from './pages/AboutPage';
import { SystemStatusData, WeatherPayload, SoilData, MultimodalReport } from './types';
import { getSystemStatus, getWeatherAndClimate, getSoilData } from './api';

const DEFAULT_LOCATIONS: Record<string, { name: string; lat: number; lon: number; crop_hub: string }> = {
  ariyalur: { name: 'Ariyalur', lat: 11.1401, lon: 79.0786, crop_hub: 'Cashew, Sugarcane, Maize' },
  chengalpattu: { name: 'Chengalpattu', lat: 12.6841, lon: 79.9836, crop_hub: 'Paddy, Groundnut, Vegetables' },
  chennai: { name: 'Chennai', lat: 13.0827, lon: 80.2707, crop_hub: 'Urban Farming, Horticulture' },
  coimbatore: { name: 'Coimbatore', lat: 11.0168, lon: 76.9558, crop_hub: 'Cotton, Sugarcane, Tomato' },
  cuddalore: { name: 'Cuddalore', lat: 11.7480, lon: 79.7714, crop_hub: 'Sugarcane, Cashew, Paddy' },
  dharmapuri: { name: 'Dharmapuri', lat: 12.1211, lon: 78.1582, crop_hub: 'Mango, Tomato, Ragi' },
  dindigul: { name: 'Dindigul', lat: 10.3673, lon: 77.9803, crop_hub: 'Vegetables, Onion, Maize' },
  erode: { name: 'Erode', lat: 11.3410, lon: 77.7172, crop_hub: 'Turmeric, Sugarcane, Banana' },
  kallakurichi: { name: 'Kallakurichi', lat: 11.7384, lon: 78.9639, crop_hub: 'Paddy, Sugarcane, Maize' },
  kanchipuram: { name: 'Kanchipuram', lat: 12.8342, lon: 79.7036, crop_hub: 'Paddy, Groundnut, Vegetables' },
  kanyakumari: { name: 'Kanyakumari', lat: 8.0883, lon: 77.5385, crop_hub: 'Rubber, Coconut, Banana' },
  karur: { name: 'Karur', lat: 10.9601, lon: 78.0766, crop_hub: 'Moringa, Paddy, Banana' },
  krishnagiri: { name: 'Krishnagiri', lat: 12.5186, lon: 78.2137, crop_hub: 'Mango, Tomato, Ragi' },
  madurai: { name: 'Madurai', lat: 9.9252, lon: 78.1198, crop_hub: 'Jasmine, Millets, Pulses' },
  mayiladuthurai: { name: 'Mayiladuthurai', lat: 11.1075, lon: 79.6522, crop_hub: 'Paddy (Delta), Pulses' },
  nagapattinam: { name: 'Nagapattinam', lat: 10.7672, lon: 79.8449, crop_hub: 'Paddy, Groundnut, Pulses' },
  namakkal: { name: 'Namakkal', lat: 11.2189, lon: 78.1674, crop_hub: 'Tapioca, Groundnut, Maize' },
  nilgiris: { name: 'Nilgiris (Ooty)', lat: 11.4102, lon: 76.6950, crop_hub: 'Tea, Potato, Cabbage, Carrot' },
  perambalur: { name: 'Perambalur', lat: 11.2342, lon: 78.8820, crop_hub: 'Maize, Cotton, Small Onion' },
  pudukkottai: { name: 'Pudukkottai', lat: 10.3833, lon: 78.8001, crop_hub: 'Groundnut, Paddy, Millets' },
  ramanathapuram: { name: 'Ramanathapuram', lat: 9.3639, lon: 78.8395, crop_hub: 'Chilli, Cotton, Paddy' },
  ranipet: { name: 'Ranipet', lat: 12.9224, lon: 79.3326, crop_hub: 'Paddy, Groundnut, Sugarcane' },
  salem: { name: 'Salem', lat: 11.6643, lon: 78.1460, crop_hub: 'Mango, Tapioca, Tomato' },
  sivaganga: { name: 'Sivaganga', lat: 9.8433, lon: 78.4809, crop_hub: 'Paddy, Groundnut, Pulses' },
  tenkasi: { name: 'Tenkasi', lat: 8.9594, lon: 77.3150, crop_hub: 'Paddy, Mango, Coconut' },
  thanjavur: { name: 'Thanjavur', lat: 10.7870, lon: 79.1378, crop_hub: 'Paddy (Rice Bowl), Banana, Coconut' },
  theni: { name: 'Theni', lat: 10.0104, lon: 77.4768, crop_hub: 'Grapes, Cardamom, Banana' },
  thoothukudi: { name: 'Thoothukudi', lat: 8.7642, lon: 78.1348, crop_hub: 'Cotton, Chilli, Pulses, Onion' },
  tiruchirappalli: { name: 'Tiruchirappalli (Trichy)', lat: 10.7905, lon: 78.7047, crop_hub: 'Banana, Paddy, Sugarcane' },
  tirunelveli: { name: 'Tirunelveli', lat: 8.7139, lon: 77.7567, crop_hub: 'Paddy, Banana, Pulses' },
  tirupathur: { name: 'Tirupathur', lat: 12.4925, lon: 78.5678, crop_hub: 'Groundnut, Paddy, Millets' },
  tiruppur: { name: 'Tiruppur', lat: 11.1085, lon: 77.3411, crop_hub: 'Cotton, Maize, Coconut' },
  tiruvallur: { name: 'Tiruvallur', lat: 13.1432, lon: 79.9074, crop_hub: 'Paddy, Vegetables, Watermelon' },
  tiruvannamalai: { name: 'Tiruvannamalai', lat: 12.2253, lon: 79.0747, crop_hub: 'Groundnut, Paddy, Sugarcane' },
  tiruvarur: { name: 'Tiruvarur', lat: 10.7725, lon: 79.6365, crop_hub: 'Paddy (Delta), Pulses' },
  vellore: { name: 'Vellore', lat: 12.9165, lon: 79.1325, crop_hub: 'Groundnut, Banana, Vegetables' },
  viluppuram: { name: 'Viluppuram', lat: 11.9401, lon: 79.4861, crop_hub: 'Sugarcane, Paddy, Tapioca' },
  virudhunagar: { name: 'Virudhunagar', lat: 9.5680, lon: 77.9624, crop_hub: 'Cotton, Chilli, Millets' }
};

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const [selectedLocation, setSelectedLocation] = useState<string>('coimbatore');

  const [systemStatus, setSystemStatus] = useState<SystemStatusData | null>(null);
  const [weather, setWeather] = useState<WeatherPayload | null>(null);
  const [soil, setSoil] = useState<SoilData | null>(null);
  const [latestReport, setLatestReport] = useState<MultimodalReport | null>(null);

  // Load backend status and data on startup
  useEffect(() => {
    getSystemStatus()
      .then(setSystemStatus)
      .catch((err) => console.log('System status check:', err));
  }, []);

  useEffect(() => {
    const loc = DEFAULT_LOCATIONS[selectedLocation];
    if (loc) {
      getWeatherAndClimate(loc.lat, loc.lon)
        .then((res) => setWeather(res.live_weather))
        .catch((err) => console.log('Weather fetch:', err));

      getSoilData(loc.lat, loc.lon)
        .then(setSoil)
        .catch((err) => console.log('Soil fetch:', err));
    }
  }, [selectedLocation]);

  return (
    <div className="min-h-screen bg-[#F4F9F4] text-[#202820] flex flex-row font-sans selection:bg-[#CFE1B9] selection:text-[#4A5D23]">
      {/* Left Icon Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          lang={lang}
          setLang={setLang}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          locations={DEFAULT_LOCATIONS}
          systemStatus={systemStatus}
        />

        {/* Dynamic Page Router */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTab === 'landing' && (
            <LandingPage onNavigate={setActiveTab} lang={lang} />
          )}

          {activeTab === 'dashboard' && (
            <DashboardPage
              weather={weather}
              soil={soil}
              lang={lang}
              selectedLocation={selectedLocation}
              locations={DEFAULT_LOCATIONS}
              onNavigateToScan={() => setActiveTab('scanner')}
              onNavigateToAssistant={() => setActiveTab('assistant')}
            />
          )}

          {activeTab === 'scanner' && (
            <ScannerPage
              lang={lang}
              selectedLocation={selectedLocation}
              locations={DEFAULT_LOCATIONS}
              onReportGenerated={(rep) => setLatestReport(rep)}
            />
          )}

          {activeTab === 'climate' && (
            <ClimatePage
              lang={lang}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              locations={DEFAULT_LOCATIONS}
            />
          )}

          {activeTab === 'soil' && (
            <SoilPage
              lang={lang}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              locations={DEFAULT_LOCATIONS}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPage
              lang={lang}
              onNavigateToScan={() => setActiveTab('scanner')}
            />
          )}

          {activeTab === 'simulator' && (
            <SimulatorPage lang={lang} />
          )}

          {activeTab === 'assistant' && (
            <AssistantPage lang={lang} weather={weather} />
          )}

          {activeTab === 'about' && (
            <AboutPage lang={lang} systemStatus={systemStatus} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
