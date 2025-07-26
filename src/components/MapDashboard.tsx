// "use client";
// import React, { useState } from "react";
// import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

// const libraries = ["places"];
// const googleMapContainerStyle = {
//   width: "100%",
//   height: "100%",
// };

// const center = {
//   lat: 12.9716,
//   lng: 77.5946,
// };

// const mockEvents = [
//   { id: 1, label: "Heavy Traffic", coordinates: { x: 50, y: 20 } },
//   { id: 2, label: "Roadblock", coordinates: { x: 30, y: 40 } },
//   { id: 3, label: "Event", coordinates: { x: 70, y: 60 } },
// ];

// const MapDashboard = () => {
//   const { isLoaded, loadError } = useLoadScript({
//   googleMapsApiKey: "AIzaSyBqXRmYQJPiIUFXKt0Z125e4fgES-hszRg", // ← your actual key here
//   libraries: libraries as any,
// });


//   const [selectedEvent, setSelectedEvent] = useState<any>(null);
//   const [mapView, setMapView] = useState<'google' | 'mood'>("google"); // Force start with Google

//   if (loadError) return <div>Error loading maps</div>;
//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <div className="w-full h-screen relative">
//       {/* Top-center dropdown */}
//       <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
//         <select
//           value={mapView}
//           onChange={(e) => setMapView(e.target.value as 'google' | 'mood')}
//           className="px-4 py-2 rounded-lg bg-white shadow-md border border-gray-300 text-slate-800 font-medium text-sm focus:outline-none"
//         >
//           <option value="google">Google Maps</option>
//           <option value="mood">Mood Map</option>
//         </select>
//       </div>

//       {/* Map View */}
//       {mapView === "google" ? (
//         <GoogleMap
//           mapContainerStyle={googleMapContainerStyle}
//           center={center}
//           zoom={12}
//         >
//           {mockEvents.map((event) => (
//             <Marker
//               key={event.id}
//               position={{
//                 lat: center.lat + (event.coordinates.y - 50) * 0.01,
//                 lng: center.lng + (event.coordinates.x - 50) * 0.01,
//               }}
//               onClick={() => setSelectedEvent(event)}
//             />
//           ))}
//         </GoogleMap>
//       ) : (
//         <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative">
//           {/* Simulated "Mood Map" View */}
//           <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-0.5 p-1">
//             {[...Array(100)].map((_, index) => {
//               const intensity = Math.floor(Math.random() * 100);
//               return (
//                 <div
//                   key={index}
//                   className="w-full h-full"
//                   style={{
//                     backgroundColor: `rgba(255, 0, 0, ${intensity / 100})`,
//                     borderRadius: "2px",
//                   }}
//                 />
//               );
//             })}
//           </div>
//           {mockEvents.map((event) => (
//             <div
//               key={event.id}
//               className="absolute w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shadow-md cursor-pointer"
//               style={{
//                 top: `${event.coordinates.y}%`,
//                 left: `${event.coordinates.x}%`,
//                 transform: "translate(-50%, -50%)",
//               }}
//               onClick={() => setSelectedEvent(event)}
//             >
//               {event.label[0]}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Popup Box for Event */}
//       {selectedEvent && (
//         <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-50 max-w-xs">
//           <h2 className="text-lg font-semibold">{selectedEvent.label}</h2>
//           <p>Details about the event...</p>
//           <button
//             className="mt-2 text-blue-500 underline"
//             onClick={() => setSelectedEvent(null)}
//           >
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MapDashboard;



// "use client";
// import React, { useState } from "react";
// import { GoogleMap, MarkerF, InfoWindowF, useLoadScript } from "@react-google-maps/api";

// const libraries = ["places"];
// const googleMapContainerStyle = {
//   width: "100%",
//   height: "100vh",
// };

// const center = {
//   lat: 12.9716,
//   lng: 77.5946,
// };

// // Mock traffic/weather/news data
// const areaData = [
//   {
//     id: 1,
//     name: "Koramangala",
//     lat: 12.9352,
//     lng: 77.6245,
//     weather: "Heavy Rain 🌧️",
//     temp: 24,
//     tweetCount: 5,
//     newsCount: 2,
//   },
//   {
//     id: 2,
//     name: "Hebbal",
//     lat: 13.0358,
//     lng: 77.5970,
//     weather: "Cloudy ☁️",
//     temp: 26,
//     tweetCount: 1,
//     newsCount: 1,
//   },
//   {
//     id: 3,
//     name: "Silk Board",
//     lat: 12.9172,
//     lng: 77.6238,
//     weather: "Clear 🌞",
//     temp: 30,
//     tweetCount: 3,
//     newsCount: 4,
//   },
// ];

// const getMarkerColor = (tweets: number, news: number, weather: string) => {
//   const isRain = weather.toLowerCase().includes("rain");
//   if (tweets >= 3 || news >= 3 || isRain) return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
//   if ((tweets >= 1 && tweets < 3) || (news >= 1 && news < 3)) return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
//   return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
// };

// const MapDashboard = () => {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: "AIzaSyBqXRmYQJPiIUFXKt0Z125e4fgES-hszRg", // 🔐 Replace with actual key
//     libraries: libraries as any,
//   });

//   const [selected, setSelected] = useState<any>(null);

//   if (loadError) return <div>Error loading map</div>;
//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <div className="w-full h-screen relative">
//       <GoogleMap
//         mapContainerStyle={googleMapContainerStyle}
//         center={center}
//         zoom={12}
//       >
//         {areaData.map((area) => (
//           <MarkerF
//             key={area.id}
//             position={{ lat: area.lat, lng: area.lng }}
//             icon={{
//               url: getMarkerColor(area.tweetCount, area.newsCount, area.weather),
//             }}
//             onClick={() => setSelected(area)}
//           />
//         ))}

//         {selected && (
//           <InfoWindowF
//             position={{ lat: selected.lat, lng: selected.lng }}
//             onCloseClick={() => setSelected(null)}
//           >
//             <div className="text-sm">
//               <strong>📍 {selected.name}</strong>
//               <br />
//               🌤️ <strong>Weather:</strong> {selected.weather}, {selected.temp}°C
//               <br />
//               🐦 <strong>Tweets:</strong> {selected.tweetCount}
//               <br />
//               📰 <strong>News:</strong> {selected.newsCount}
//             </div>
//           </InfoWindowF>
//         )}
//       </GoogleMap>

//       {/* Right Agent Panel */}
      
//     </div>
//   );
// };

// export default MapDashboard;
"use client";
import React, { useState } from "react";
import { GoogleMap, MarkerF, InfoWindowF, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];
const googleMapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 12.9716,
  lng: 77.5946,
};

// Mock traffic/weather/news data
const areaData = [
  {
    id: 1,
    name: "Koramangala",
    lat: 12.9352,
    lng: 77.6245,
    weather: "Heavy Rain 🌧️",
    temp: 24,
    tweetCount: 5,
    newsCount: 2,
  },
  {
    id: 2,
    name: "Hebbal",
    lat: 13.0358,
    lng: 77.5970,
    weather: "Cloudy ☁️",
    temp: 26,
    tweetCount: 1,
    newsCount: 1,
  },
  {
    id: 3,
    name: "Silk Board",
    lat: 12.9172,
    lng: 77.6238,
    weather: "Clear 🌞",
    temp: 30,
    tweetCount: 3,
    newsCount: 4,
  },
];

const getMarkerColor = (tweets: number, news: number, weather: string) => {
  const isRain = weather.toLowerCase().includes("rain");
  if (tweets >= 3 || news >= 3 || isRain)
    return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  if ((tweets >= 1 && tweets < 3) || (news >= 1 && news < 3))
    return "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
  return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
};

const MapDashboard = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBqXRmYQJPiIUFXKt0Z125e4fgES-hszRg", // 🔐 Replace with your API key
    libraries: libraries as any,
  });

  const [selected, setSelected] = useState<any>(null);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <GoogleMap
        mapContainerStyle={googleMapContainerStyle}
        center={center}
        zoom={12}
      >
        {areaData.map((area) => (
          <MarkerF
            key={area.id}
            position={{ lat: area.lat, lng: area.lng }}
            icon={{
              url: getMarkerColor(area.tweetCount, area.newsCount, area.weather),
            }}
            onClick={() => setSelected(area)}
          />
        ))}

        {selected && (
          <InfoWindowF
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div
              style={{
                border: "2px solid #007BFF",
                borderRadius: "8px",
                padding: "10px",
                minWidth: "200px",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "5px" }}>
                📍 {selected.name}
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>🌤️ Weather:</span>{" "}
                {selected.weather}, {selected.temp}°C
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>🐦 Tweets:</span> {selected.tweetCount}
              </div>
              <div>
                <span style={{ fontWeight: "bold" }}>📰 News:</span> {selected.newsCount}
              </div>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapDashboard;
