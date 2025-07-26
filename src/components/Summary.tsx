import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Upload,
  MessageCircle,
  MapPin,
} from 'lucide-react';

interface CategoryContent {
  summary: string[];
  alerts?: string;
}

type SummaryData = Record<string, CategoryContent>;

interface Props {
  setActivePanel: React.Dispatch<
    React.SetStateAction<
      'summary' | 'stories' | 'filter' | 'chat' | 'upload' | 'map' | 'profile'
    >
  >;
}

const SummaryDashboard: React.FC<Props> = ({ setActivePanel }) => {
  const [summaryData, setSummaryData] = useState<SummaryData>({});
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await axios.post<SummaryData>(
          'https://fastapi-city-graph-apis-1081552206448.asia-south1.run.app/api/v1/get/overall/summary'
        );
        const data = response.data;
        setSummaryData(data);
        const firstKey = Object.keys(data)[0];
        setActiveCategory(firstKey);
      } catch (error) {
        console.error('Failed to fetch summary data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);


  const categoryTabs = Object.keys(summaryData);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span className="text-blue-700 font-medium">Loading summary data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Welcome to Bangalore Live Dashboard</h2>
        <p className="text-blue-100">Your comprehensive source for real-time news, events, and city updates</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categoryTabs.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            } transition-all`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Summary Content for Selected Category */}
      {activeCategory && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">{activeCategory} Updates</h3>

          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            {summaryData[activeCategory]?.summary.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>

          {summaryData[activeCategory]?.alerts && summaryData[activeCategory].alerts.trim() !== '' && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
              <strong>Alert:</strong> {summaryData[activeCategory].alerts}
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActivePanel('upload')}
            className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 text-center border border-emerald-100 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Upload className="mx-auto mb-2 text-emerald-600" size={24} />
            <div className="text-sm font-medium text-emerald-700">Upload Event</div>
          </button>
          <button
            onClick={() => setActivePanel('chat')}
            className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-200 text-center border border-purple-100 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <MessageCircle className="mx-auto mb-2 text-purple-600" size={24} />
            <div className="text-sm font-medium text-purple-700">Ask Assistant</div>
          </button>
          <button
            onClick={() => setActivePanel('map')}
            className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl hover:from-amber-100 hover:to-yellow-100 transition-all duration-200 text-center border border-amber-100 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <MapPin className="mx-auto mb-2 text-amber-600" size={24} />
            <div className="text-sm font-medium text-amber-700">View Map</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryDashboard;
