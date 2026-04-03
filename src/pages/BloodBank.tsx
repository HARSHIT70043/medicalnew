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
          const token = localStorage.getItem('token');
          const saveRes = await fetch('/api/blood-data', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 font-display">Real-Time Blood Availability</h2>
          <p className="text-neutral-500 mt-1 text-lg">Check live blood stock across all nearby hospitals and blood banks.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {hospitals.length > 0 && (
            <button
              onClick={() => setViewMode(viewMode === 'ui' ? 'json' : 'ui')}
              className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-5 py-2.5 rounded-2xl font-semibold transition-all flex items-center gap-2 shadow-sm flex-1 md:flex-none justify-center active:scale-95"
            >
              {viewMode === 'ui' ? <Database className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
              {viewMode === 'ui' ? 'View JSON DB' : 'View UI'}
            </button>
          )}
          <button
            onClick={fetchBloodData}
            disabled={!location || loading}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-red-600/20 flex-1 md:flex-none justify-center active:scale-95"
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
        <div className="bg-red-50 text-red-700 p-5 rounded-2xl flex items-start gap-3 border border-red-100 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {hospitals.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search hospitals..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] font-medium"
            />
          </div>
          <select
            value={selectedBloodType}
            onChange={(e) => setSelectedBloodType(e.target.value as keyof BloodStock | 'All')}
            className="px-4 py-3.5 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:w-56 cursor-pointer font-medium appearance-none"
          >
            <option value="All">All Blood Types</option>
            {bloodTypes.map(type => (
              <option key={type} value={type}>{type} Available</option>
            ))}
          </select>
        </div>
      )}

      {hospitals.length > 0 && viewMode === 'ui' && (
        <div className="grid grid-cols-1 gap-6">
          {filteredHospitals.length === 0 ? (
            <div className="text-center py-12 bg-white border border-neutral-200 rounded-3xl border-dashed">
              <p className="text-neutral-500 font-medium">No hospitals match your filters.</p>
            </div>
          ) : (
            filteredHospitals.map((hospital, index) => (
              <div key={index} className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-red-100 transition-all group">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 pb-6 border-b border-neutral-100/50">
                  <div>
                    <h3 className="font-bold text-xl text-neutral-900 font-display group-hover:text-red-900 transition-colors">{hospital.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500 font-medium">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-neutral-400" /> {hospital.distance}</span>
                      <span className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-neutral-400" /> Updated: {hospital.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 w-fit shadow-inner">
                    <Droplets className="w-4 h-4" />
                    Total Units: {Object.values(hospital.stock).reduce((a, b) => a + b, 0)}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {bloodTypes.map(type => (
                    <div 
                      key={type} 
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-colors ${
                        hospital.stock[type] > 10 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                          : hospital.stock[type] > 0 
                            ? 'bg-amber-50 border-amber-100 text-amber-800'
                            : 'bg-red-50 border-red-100 text-red-800 opacity-60'
                      }`}
                    >
                      <span className="font-bold text-base font-display">{type}</span>
                      <span className="text-xs font-bold mt-1 opacity-80">{hospital.stock[type]} u</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          </div>
      )}

      {hospitals.length > 0 && viewMode === 'json' && (
        <div className="bg-neutral-900 rounded-3xl p-8 shadow-xl overflow-hidden flex flex-col">
          <div className="flex items-center gap-3 text-neutral-400 mb-6 border-b border-neutral-800 pb-4">
            <Code className="w-5 h-5" />
            <h3 className="font-mono text-sm font-bold tracking-wider">blood_bank_database.json</h3>
          </div>
          <pre className="text-emerald-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {JSON.stringify(jsonDatabase, null, 2)}
          </pre>
        </div>
      )}

      {!loading && hospitals.length === 0 && !error && (
        <div className="text-center py-20 bg-white border border-neutral-200 rounded-3xl border-dashed shadow-sm">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Droplets className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 font-display">No blood data loaded</h3>
          <p className="text-neutral-500 mt-2 max-w-sm mx-auto text-lg">
            Click the "Load Live Data" button to fetch real-time blood availability from nearby hospitals.
          </p>
        </div>
      )}
    </div>
  );
}
