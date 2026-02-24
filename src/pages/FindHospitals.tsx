import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MapPin, Navigation, Phone, Clock, AlertCircle } from 'lucide-react';

let ai: any = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

interface Hospital {
  name: string;
  address: string;
  uri: string;
  distance?: string;
}

export default function FindHospitals() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError('Could not get your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  const findNearbyHospitals = async () => {
    if (!location) return;
    if (!ai) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Find the nearest hospitals, clinics, and medical centers near my location. Provide a brief summary of the top 5 closest ones.',
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: location.lat,
                longitude: location.lng,
              },
            },
          },
        },
      });

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const extractedHospitals: Hospital[] = [];
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri && chunk.web?.title) {
            extractedHospitals.push({
              name: chunk.web.title,
              uri: chunk.web.uri,
              address: 'Address available on Maps',
            });
          } else if (chunk.maps?.uri && chunk.maps?.title) {
             extractedHospitals.push({
              name: chunk.maps.title,
              uri: chunk.maps.uri,
              address: 'Address available on Maps',
            });
          }
        });
        
        // Deduplicate
        const uniqueHospitals = Array.from(new Map(extractedHospitals.map(item => [item.uri, item])).values());
        setHospitals(uniqueHospitals);
      } else {
         setError('No nearby hospitals found or could not retrieve data.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch nearby hospitals. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Nearby Hospitals</h2>
          <p className="text-neutral-500 mt-1">Find medical facilities around your current location.</p>
        </div>
        <button
          onClick={findNearbyHospitals}
          disabled={!location || loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
          {loading ? 'Searching...' : 'Find Hospitals'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {hospitals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map((hospital, index) => (
            <div key={index} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg text-neutral-900 line-clamp-1">{hospital.name}</h3>
              <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {hospital.address}
              </p>
              
              <div className="mt-6 flex items-center gap-3">
                <a
                  href={hospital.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Directions
                </a>
                <a
                  href={`tel:112`}
                  className="w-10 h-10 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-lg flex items-center justify-center transition-colors"
                  title="Emergency Contact"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && hospitals.length === 0 && !error && (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl border-dashed">
          <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-neutral-900">No hospitals loaded</h3>
          <p className="text-neutral-500 mt-1 max-w-sm mx-auto">
            Click the "Find Hospitals" button to search for medical facilities near your current location.
          </p>
        </div>
      )}
    </div>
  );
}
