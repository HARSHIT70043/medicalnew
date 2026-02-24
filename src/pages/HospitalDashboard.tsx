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
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Live Resource Dashboard</h2>
          <p className="text-neutral-500 mt-1">Real-time availability of hospital resources.</p>
        </div>
        <button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Beds Section */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <BedDouble className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">Bed Availability</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-xl border border-neutral-100">
              <div>
                <p className="text-sm font-medium text-neutral-500">General Wards</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{resources.generalBeds.available} <span className="text-sm font-normal text-neutral-400">/ {resources.generalBeds.total}</span></p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-blue-500" strokeDasharray="175" strokeDashoffset={175 - (175 * resources.generalBeds.available) / resources.generalBeds.total} />
                </svg>
                <span className="text-xs font-bold text-blue-600">{Math.round((resources.generalBeds.available / resources.generalBeds.total) * 100)}%</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-rose-50 rounded-xl border border-rose-100">
              <div>
                <p className="text-sm font-medium text-rose-600">ICU Beds</p>
                <p className="text-2xl font-bold text-rose-900 mt-1">{resources.icuBeds.available} <span className="text-sm font-normal text-rose-400">/ {resources.icuBeds.total}</span></p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-rose-100 flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-rose-500" strokeDasharray="175" strokeDashoffset={175 - (175 * resources.icuBeds.available) / resources.icuBeds.total} />
                </svg>
                <span className="text-xs font-bold text-rose-600">{Math.round((resources.icuBeds.available / resources.icuBeds.total) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Blood Bank Section */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">Blood Bank Status</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[resources.bloodA, resources.bloodB, resources.bloodO, resources.bloodAB].map((blood, idx) => (
              <div key={idx} className="p-4 border border-neutral-100 rounded-xl bg-neutral-50 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold text-red-600">{blood.type}</span>
                <span className="text-2xl font-bold text-neutral-900 mt-1">{blood.units}</span>
                <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider mt-1">Units</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Ingestion Form (Mock) */}
      <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm mt-8">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Resource Ingestion (Staff Only)</h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Resource Type</label>
            <select className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
              <option>General Beds</option>
              <option>ICU Beds</option>
              <option>Blood Units</option>
              <option>Oxygen Cylinders</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Quantity</label>
            <input type="number" className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Enter quantity" />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Update System
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
