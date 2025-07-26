import React, { useEffect, useState } from 'react';
import SummaryDashboard from './Summary';
import MapDashboard from './MapDashboard';
import axios from 'axios';

interface CategoryContent {
  summary: string[];
  alerts?: string;
}

type SummaryData = Record<string, CategoryContent>;

type Mood = "positive" | "negative" | "neutral";

type MoodData = {
  news_summary: string;
  mood: Mood;
  area: string;
  latitude: number;
  longitude: number;
  weather: {
    description: string;
    temperature_C: number;
    humidity: number;
    wind_speed_kph: number;
    feelslike_C: number;
  };
};

const SUMMARY_API_URL = 'https://fastapi-city-graph-apis-1081552206448.asia-south1.run.app/api/v1/get/overall/summary';
const MOOD_API_URL = 'https://fastapi-city-graph-apis-1081552206448.asia-south1.run.app/api/v1/mood/map';

const DashboardContainer: React.FC = () => {
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [moodData, setMoodData] = useState<MoodData[] | null>(null);
  const [activePanel, setActivePanel] = useState<
    'summary' | 'stories' | 'filter' | 'chat' | 'upload' | 'map' | 'profile'
  >('summary'); // Manage active panel here with all possible types
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Summary Data
        const summaryResponse = await axios.post<SummaryData>(SUMMARY_API_URL);
        setSummaryData(summaryResponse.data);

        // Fetch Mood Data
        const moodResponse = await fetch(MOOD_API_URL);
        const moodData = await moodResponse.json();
        setMoodData(moodData);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs only once on mount

  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  if (!summaryData || !moodData) {
    return <div>Error loading data.</div>;
  }

  return (
    <div>
      {/* Navigation/Tabs to switch between Summary and Map */}
      <div>
        <button onClick={() => setActivePanel('summary')}>Summary</button>
        <button onClick={() => setActivePanel('map')}>Map</button>
      </div>

      {/* Render active panel */}
      {activePanel === 'summary' && summaryData && <SummaryDashboard summaryData={summaryData} setActivePanel={setActivePanel} />} {/* Pass data and setActivePanel as props, and conditionally render SummaryDashboard */}
      {activePanel === 'map' && moodData && <MapDashboard moodData={moodData} />} {/* Pass data as prop and conditionally render MapDashboard */}
    </div>
  );
};

export default DashboardContainer;