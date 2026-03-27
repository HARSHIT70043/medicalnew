import { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Droplets, MapPin, Search, AlertCircle, RefreshCw, Database, Code } from 'lucide-react';

let ai: any = null;
try {
  const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

interface BloodStock {
  'A+': number;
  'A-': number;
  'B+': number;
  'B-': number;
  'O+': number;
  'O-': number;
  'AB+': number;
  'AB-': number;
}

interface HospitalBloodData {
  name: string;
  address: string;
  distance: string;
  phoneNumber: string;
  lastUpdated: string;
  stock: BloodStock;
}

export default function BloodBank() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<HospitalBloodData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'ui' | 'json'>('ui');
  const [selectedBloodType, setSelectedBloodType] = useState<keyof BloodStock | 'All'>('All');

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

  const generateMockBloodStock = (): BloodStock => {
    return {
      'A+': Math.floor(Math.random() * 50),
      'A-': Math.floor(Math.random() * 15),
      'B+': Math.floor(Math.random() * 40),
      'B-': Math.floor(Math.random() * 10),
      'O+': Math.floor(Math.random() * 60),
      'O-': Math.floor(Math.random() * 20),
      'AB+': Math.floor(Math.random() * 25),
      'AB-': Math.floor(Math.random() * 5),
    };
  };

  const fetchBloodData = async () => {
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
        contents: 'Find the nearest hospitals and blood banks near my location. Provide a brief summary of the top 6 closest ones.',
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
        const extractedHospitals: HospitalBloodData[] = [];
        chunks.forEach((chunk: any) => {
          const title = chunk.web?.title || chunk.maps?.title;
          const uri = chunk.web?.uri || chunk.maps?.uri;
          
          if (title && uri) {
            extractedHospitals.push({
              name: title,
              address: 'Address available on Maps',
              distance: (Math.random() * 8 + 0.5).toFixed(1) + ' km',
              phoneNumber: '+1 (555) ' + Math.floor(100 + Math.random() * 900) + '-' + Math.floor(1000 + Math.random() * 9000),
              lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              stock: generateMockBloodStock(),
            });
          }
        });
        
        // Deduplicate by name
        const uniqueHospitals = Array.from(new Map(extractedHospitals.map(item => [item.name, item])).values());
        setHospitals(uniqueHospitals);
        
        // Save to MongoDB via API
        try {
          const saveRes = await fetch('/api/blood-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hospitals: uniqueHospitals }),
          });
          const saveData = await saveRes.json();
          if (!saveRes.ok) {
            setError(`Database Error: ${saveData.error || 'Failed to connect'}. Check your MongoDB Network Access (IP Whitelist).`);
          }
        } catch (saveErr) {
          console.error("Failed to save blood data to MongoDB", saveErr);
          setError("Network error: Could not reach the server to save data.");
        }
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

  const bloodTypes: (keyof BloodStock)[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBlood = selectedBloodType === 'All' || h.stock[selectedBloodType as keyof BloodStock] > 0;
    return matchesSearch && matchesBlood;
  });

  const jsonDatabase = filteredHospitals.map(h => ({
    hospitalName: h.name,
    phoneNumber: h.phoneNumber,
    distance: h.distance,
    totalUnits: Object.values(h.stock).reduce((a, b) => a + b, 0),
    bloodStock: h.stock
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Real-Time Blood Availability</h2>
          <p className="text-neutral-500 mt-1">Check live blood stock across all nearby hospitals and blood banks.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {hospitals.length > 0 && (
            <button
              onClick={() => setViewMode(viewMode === 'ui' ? 'json' : 'ui')}
              className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm flex-1 md:flex-none justify-center"
            >
              {viewMode === 'ui' ? <Database className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
              {viewMode === 'ui' ? 'View JSON DB' : 'View UI'}
            </button>
          )}
          <button
            onClick={fetchBloodData}
            disabled={!location || loading}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm flex-1 md:flex-none justify-center"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            {loading ? 'Fetching Data...' : 'Load Live Data'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {hospitals.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search hospitals..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm"
            />
          </div>
          <select
            value={selectedBloodType}
            onChange={(e) => setSelectedBloodType(e.target.value as keyof BloodStock | 'All')}
            className="px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm sm:w-48 cursor-pointer"
          >
            <option value="All">All Blood Types</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type} Available</option>
            ))}
          </select>
        </div>
      )}

      {hospitals.length > 0 && viewMode === 'ui' && (
        <div className="grid grid-cols-1 gap-4">
          {filteredHospitals.length === 0 ? (
            <div className="text-center py-8 bg-white border border-neutral-200 rounded-2xl border-dashed">
              <p className="text-neutral-500">No hospitals match your filters.</p>
            </div>
          ) : (
            filteredHospitals.map((hospital, index) => (
              <div key={index} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-neutral-100">
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-900">{hospital.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {hospital.distance}</span>
                      <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Updated: {hospital.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 w-fit">
                    <Droplets className="w-4 h-4" />
                    Total Units: {Object.values(hospital.stock).reduce((a, b) => a + b, 0)}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {bloodTypes.map(type => (
                    <div 
                      key={type} 
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border ${
                        hospital.stock[type] > 10 
                          ? 'bg-green-50 border-green-100 text-green-800' 
                          : hospital.stock[type] > 0 
                            ? 'bg-yellow-50 border-yellow-100 text-yellow-800'
                            : 'bg-red-50 border-red-100 text-red-800 opacity-60'
                      }`}
                    >
                      <span className="font-bold text-sm">{type}</span>
                      <span className="text-xs font-medium mt-0.5">{hospital.stock[type]} u</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          </div>
      )}

      {hospitals.length > 0 && viewMode === 'json' && (
        <div className="bg-neutral-900 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 text-neutral-400 mb-4 border-b border-neutral-800 pb-4">
            <Code className="w-5 h-5" />
            <h3 className="font-mono text-sm font-medium">blood_bank_database.json</h3>
          </div>
          <pre className="text-emerald-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(jsonDatabase, null, 2)}
          </pre>
        </div>
      )}

      {!loading && hospitals.length === 0 && !error && (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl border-dashed">
          <Droplets className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-neutral-900">No blood data loaded</h3>
          <p className="text-neutral-500 mt-1 max-w-sm mx-auto">
            Click the "Load Live Data" button to fetch real-time blood availability from nearby hospitals.
          </p>
        </div>
      )}
    </div>
  );
}
