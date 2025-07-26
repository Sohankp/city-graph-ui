import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  MarkerF,
  InfoWindowF,
  HeatmapLayerF,
  useLoadScript,
} from "@react-google-maps/api";

const libraries = ["visualization"]; // for heatmap

const googleMapsApiKey = "AIzaSyBqXRmYQJPiIUFXKt0Z125e4fgES-hszRg"; // 🔐 Replace with your key

const center = { lat: 12.9716, lng: 77.5946 };
const containerStyle = { width: "100%", height: "100vh" };

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

const API_URL = 'https://fastapi-city-graph-apis-1081552206448.asia-south1.run.app/api/v1/mood/map';

const emojiMap = {
  positive: "😊",
  negative: "😡",
  neutral: "😐",
};

const sentimentWeightMap: Record<Mood, number> = {
  positive: 1,
  neutral: 2,
  negative: 5,
};

const getMarkerColor = (mood: Mood) => {
  if (mood === "negative") return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  if (mood === "positive") return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
  return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
};

const MapDashboard = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries: libraries as any,
  });

  const [selected, setSelected] = useState<MoodData | null>(null);
  const [view, setView] = useState<"mood" | "heatmap" | "markers">("markers");
  const [moodData, setMoodData] = useState<MoodData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const heatmapRef = React.useRef<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        const data = await response.json();
        setMoodData(data);
      } catch (error) {
        console.error("Error fetching mood data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🧹 Remove heatmap when not in heatmap view
  React.useEffect(() => {
    if (view !== "heatmap" && heatmapRef.current) {
      heatmapRef.current.setMap(null);
      heatmapRef.current = null;
    }
  }, [view]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 20,
          fontSize: '24px'
        }}>
          Loading data...
        </div>
      )}
      {/* 🧭 Bottom-left map view toggle */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          zIndex: 10,
          backgroundColor: "#fff",
          padding: "12px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          border: "1px solid #ccc",
          fontFamily: "Arial",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "8px" }}>🗺 Map View:</div>
        <button onClick={() => setView("markers")} style={{ marginRight: "6px" }}>
          🟢 Markers
        </button>
        <button onClick={() => setView("mood")} style={{ marginRight: "6px" }}>
          😊 Mood
        </button>
        <button onClick={() => setView("heatmap")}>
          🔥 Heatmap
        </button>
      </div>

      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        {/* Colored Markers View */}
        {view === "markers" &&
          moodData.map((data, index) => (
            <MarkerF
              key={index}
              position={{ lat: data.latitude, lng: data.longitude }}
              icon={{
                url: getMarkerColor(data.mood),
              }}
              onClick={() => setSelected(data)}
            />
          ))}

        {/* Mood Emoji View */}
        {view === "mood" &&
          moodData.map((data, index) => (
            <MarkerF
              key={index}
              position={{ lat: data.latitude, lng: data.longitude }}
              label={{
                text: emojiMap[data.mood] || "📍",
                fontSize: "20px",
              }}
              onClick={() => setSelected(data)}
            />
          ))}

        {/* Heatmap Layer */}
        {view === "heatmap" && (
          <HeatmapLayerF
            onLoad={(layer) => {
              heatmapRef.current = layer;
            }}
            data={moodData.map((data) => ({
              location: new window.google.maps.LatLng(data.latitude, data.longitude),
              weight: sentimentWeightMap[data.mood] || 1,
            }))}
            options={{ radius: 50, opacity: 0.6, dissipating: true }}
          />
        )}

        {/* Info Window */}
        {selected && (
          <InfoWindowF
            position={{ lat: selected.latitude, lng: selected.longitude }}
            onCloseClick={() => setSelected(null)}
          >
            <div
              style={{
                border: "2px solid #007BFF",
                borderRadius: "8px",
                padding: "10px",
                minWidth: "200px",
                fontFamily: "Arial",
                fontSize: "14px",
              }}
            >
              <strong>📍 {selected.area}</strong>
              <br />
              🧠 Mood: {emojiMap[selected.mood] || "❓"}
              <br />
              📰 News Summary: {selected.news_summary}
              <br />
              🌤 Weather: {selected.weather.description}, {selected.weather.temperature_C}°C
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
};
export default MapDashboard;