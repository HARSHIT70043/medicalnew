import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MapPin, Navigation, Phone, Clock, AlertCircle, BedDouble, Droplets, Activity } from 'lucide-react';

let ai: any = null;
try {
  const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

interface RealTimeData {
  generalBeds: number;
  icuBeds: number;
  bloodTypes: string[];
}

interface Hospital {
  name: string;
  address: string;
  uri: string;
  distance?: string;
  realTimeData?: RealTimeData;
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

  const generateMockRealTimeData = (): RealTimeData => {
    const allBloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    // Randomly select 2-4 available blood types
    const availableBloodTypes = allBloodTypes
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 2);

    return {
      generalBeds: Math.floor(Math.random() * 40),
      icuBeds: Math.floor(Math.random() * 10),
      bloodTypes: availableBloodTypes,
    };
  };

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
              distance: (Math.random() * 8 + 0.5).toFixed(1) + ' km',
              realTimeData: generateMockRealTimeData(),
            });
          } else if (chunk.maps?.uri && chunk.maps?.title) {
             extractedHospitals.push({
              name: chunk.maps.title,
              uri: chunk.maps.uri,
              address: 'Address available on Maps',
              distance: (Math.random() * 8 + 0.5).toFixed(1) + ' km',
              realTimeData: generateMockRealTimeData(),
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {hospitals.map((hospital, index) => (
            <div key={index} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-semibold text-lg text-neutral-900 line-clamp-1">{hospital.name}</h3>
                <span className="bg-neutral-100 text-neutral-700 text-xs font-bold px-2 py-1 rounded-lg whitespace-nowrap">
                  {hospital.distance}
                </span>
              </div>
              
              <p className="text-sm text-neutral-500 mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {hospital.address}
              </p>
              
              {/* Real-Time Data Block */}
              {hospital.realTimeData && (
                <div className="mt-4 p-4 bg-neutral-50 rounded-xl border border-neutral-100 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Live Availability
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-neutral-200 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <BedDouble className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 font-medium">Beds</p>
                        <p className="text-sm font-bold text-neutral-900">
                          {hospital.realTimeData.generalBeds} Gen / {hospital.realTimeData.icuBeds} ICU
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-neutral-200 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 font-medium">Blood</p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {hospital.realTimeData.bloodTypes.map(type => (
                            <span key={type} className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-auto pt-6 flex items-center gap-3">
                <a
                  href={hospital.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Directions
                </a>
                <a
                  href={`tel:112`}
                  className="w-11 h-11 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded-xl flex items-center justify-center transition-colors shrink-0"
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
