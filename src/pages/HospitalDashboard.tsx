import { useState } from 'react';
import { Activity, BedDouble, Droplets, HeartPulse, RefreshCw } from 'lucide-react';

export default function HospitalDashboard() {
  const [resources, setResources] = useState({
    generalBeds: { total: 150, available: 42 },
    icuBeds: { total: 30, available: 5 },
    bloodA: { type: 'A+', units: 12 },
    bloodB: { type: 'B+', units: 8 },
    bloodO: { type: 'O+', units: 25 },
    bloodAB: { type: 'AB+', units: 3 },
  });

  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setResources({
        generalBeds: { total: 150, available: Math.floor(Math.random() * 50) },
        icuBeds: { total: 30, available: Math.floor(Math.random() * 10) },
        bloodA: { type: 'A+', units: Math.floor(Math.random() * 20) },
        bloodB: { type: 'B+', units: Math.floor(Math.random() * 15) },
        bloodO: { type: 'O+', units: Math.floor(Math.random() * 30) },
        bloodAB: { type: 'AB+', units: Math.floor(Math.random() * 10) },
      });
      setIsUpdating(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 font-display">Live Resource Dashboard</h2>
          <p className="text-neutral-500 mt-1 text-lg">Real-time availability of hospital resources.</p>
        </div>
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-5 py-2.5 rounded-2xl font-semibold transition-all flex items-center gap-2 shadow-sm active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Beds Section */}
        <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
              <BedDouble className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 font-display">Bed Availability</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-5 bg-neutral-50 rounded-2xl border border-neutral-100/50">
              <div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">General Wards</p>
                <p className="text-3xl font-bold text-neutral-900">{resources.generalBeds.available} <span className="text-base font-medium text-neutral-400">/ {resources.generalBeds.total}</span></p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 flex items-center justify-center relative bg-white shadow-sm">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-blue-500 transition-all duration-1000" strokeDasharray="175" strokeDashoffset={175 - (175 * resources.generalBeds.available) / resources.generalBeds.total} />
                </svg>
                <span className="text-xs font-bold text-blue-600">{Math.round((resources.generalBeds.available / resources.generalBeds.total) * 100)}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-5 bg-rose-50 rounded-2xl border border-rose-100/50">
              <div>
                <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">ICU Beds</p>
                <p className="text-3xl font-bold text-rose-900">{resources.icuBeds.available} <span className="text-base font-medium text-rose-400">/ {resources.icuBeds.total}</span></p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-rose-100 flex items-center justify-center relative bg-white shadow-sm">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-rose-500 transition-all duration-1000" strokeDasharray="175" strokeDashoffset={175 - (175 * resources.icuBeds.available) / resources.icuBeds.total} />
                </svg>
                <span className="text-xs font-bold text-rose-600">{Math.round((resources.icuBeds.available / resources.icuBeds.total) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Blood Bank Section */}
        <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 shadow-inner">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 font-display">Blood Bank Status</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[resources.bloodA, resources.bloodB, resources.bloodO, resources.bloodAB].map((blood, idx) => (
              <div key={idx} className="p-5 border border-neutral-100/50 rounded-2xl bg-neutral-50 flex flex-col items-center justify-center text-center hover:bg-red-50 hover:border-red-100 transition-colors group">
                <span className="text-xl font-bold text-red-600 font-display">{blood.type}</span>
                <span className="text-3xl font-bold text-neutral-900 mt-2 group-hover:text-red-900 transition-colors">{blood.units}</span>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mt-1">Units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Ingestion Form (Mock) */}
      <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -mr-20 -mt-20" />
        <h3 className="text-xl font-bold text-neutral-900 mb-6 font-display relative z-10">Resource Ingestion (Staff Only)</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Resource Type</label>
            <select className="w-full border border-neutral-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-neutral-50 font-medium appearance-none">
              <option>General Beds</option>
              <option>ICU Beds</option>
              <option>Blood Units</option>
              <option>Oxygen Cylinders</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Quantity</label>
            <input type="number" className="w-full border border-neutral-200 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-neutral-50 font-medium" placeholder="Enter quantity" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
              Update System
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
