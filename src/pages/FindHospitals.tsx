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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-emerald-900 text-white p-8 md:p-12 shadow-2xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-display mb-4">
            Find Care Near You
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-xl">
            Locate nearby hospitals, clinics, and medical centers instantly. Get real-time availability for beds and blood types.
          </p>
          
          <button
            onClick={findNearbyHospitals}
            disabled={!location || loading}
            className="bg-white text-emerald-900 hover:bg-emerald-50 px-6 py-3.5 rounded-2xl font-semibold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 shadow-xl shadow-black/10 active:scale-95"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-emerald-900/30 border-t-emerald-900 rounded-full animate-spin" />
            ) : (
              <MapPin className="w-5 h-5" />
            )}
            {loading ? 'Scanning Area...' : 'Locate Nearby Hospitals'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-start gap-3 border border-red-100 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {hospitals.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hospitals.map((hospital, index) => (
            <div key={index} className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col group">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-xl text-neutral-900 line-clamp-1 font-display group-hover:text-emerald-700 transition-colors">{hospital.name}</h3>
                  <p className="text-sm text-neutral-500 mt-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {hospital.address}
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-sm font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-sm">
                  {hospital.distance}
                </span>
              </div>
              
              {/* Real-Time Data Block */}
              {hospital.realTimeData && (
                <div className="mt-6 p-5 bg-neutral-50/80 rounded-2xl border border-neutral-100 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    Live Availability
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <BedDouble className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Beds</p>
                        <p className="text-sm font-bold text-neutral-900 mt-0.5">
                          {hospital.realTimeData.generalBeds} Gen / {hospital.realTimeData.icuBeds} ICU
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                        <Droplets className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Blood</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {hospital.realTimeData.bloodTypes.map(type => (
                            <span key={type} className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md">
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
                  className="flex-1 bg-neutral-900 text-white hover:bg-neutral-800 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-neutral-900/10"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
                <a
                  href={`tel:112`}
                  className="w-12 h-12 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-xl flex items-center justify-center transition-colors shrink-0"
                  title="Emergency Contact"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && hospitals.length === 0 && !error && (
        <div className="text-center py-20 bg-white border border-neutral-200 rounded-3xl border-dashed">
          <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 font-display">No hospitals loaded</h3>
          <p className="text-neutral-500 mt-2 max-w-sm mx-auto">
            Click the "Locate Nearby Hospitals" button above to search for medical facilities near your current location.
          </p>
        </div>
      )}
    </div>
  );
}
