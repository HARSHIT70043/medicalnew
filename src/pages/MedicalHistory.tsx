import { useState, useEffect } from 'react';
import { FileText, Calendar, Activity, Pill, AlertTriangle, Save, Loader2 } from 'lucide-react';

export default function MedicalHistory() {
  const [profile, setProfile] = useState({
    bloodType: 'Unknown',
    allergies: '',
    chronicConditions: '',
    age: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile(prev => ({ ...prev, ...data.profile }));
          }
        }
      } catch (e) {
        console.error("Failed to fetch profile", e);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setMessage('Profile saved successfully!');
        setIsEditing(false);
      } else {
        setMessage('Failed to save profile.');
      }
    } catch (e) {
      setMessage('Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  const history = [
    {
      date: 'Oct 12, 2025',
      type: 'Consultation',
      doctor: 'Dr. Sarah Jenkins',
      diagnosis: 'Acute Bronchitis',
      prescription: 'Amoxicillin 500mg, Albuterol Inhaler',
      notes: 'Patient advised to rest and drink plenty of fluids.',
    },
    {
      date: 'Aug 05, 2025',
      type: 'Lab Results',
      doctor: 'Dr. Michael Chen',
      diagnosis: 'Routine Blood Work',
      prescription: 'Vitamin D Supplement',
      notes: 'Slightly elevated cholesterol. Vitamin D levels low.',
    },
    {
      date: 'Jan 22, 2025',
      type: 'Emergency',
      doctor: 'Dr. Emily Rodriguez',
      diagnosis: 'Sprained Ankle',
      prescription: 'Ibuprofen 400mg',
      notes: 'X-ray negative for fracture. RICE protocol advised.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 font-display">Patient Medical History</h2>
          <p className="text-neutral-500 mt-1 text-lg">Quick access to your past medical records and prescriptions.</p>
        </div>
        <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-5 py-2.5 rounded-2xl font-semibold transition-all flex items-center gap-2 shadow-sm active:scale-95">
          <FileText className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="p-8 border-b border-neutral-100/50 bg-neutral-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl shrink-0 shadow-inner">
              ME
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-neutral-900 font-display">My Medical Profile</h3>
              {message && <p className="text-sm text-emerald-600 font-medium mt-1">{message}</p>}
            </div>
          </div>
          <button 
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            disabled={isSaving}
            className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditing ? <Save className="w-4 h-4" /> : 'Edit Profile')}
            {isEditing ? 'Save Profile' : ''}
          </button>
        </div>

        {isEditing ? (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-neutral-100/50 bg-white">
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Age</label>
              <input type="text" value={profile.age} onChange={e => setProfile({...profile, age: e.target.value})} className="w-full border border-neutral-200 rounded-2xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-neutral-50" placeholder="e.g. 35" />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Blood Type</label>
              <input type="text" value={profile.bloodType} onChange={e => setProfile({...profile, bloodType: e.target.value})} className="w-full border border-neutral-200 rounded-2xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-neutral-50" placeholder="e.g. O+" />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Allergies</label>
              <input type="text" value={profile.allergies} onChange={e => setProfile({...profile, allergies: e.target.value})} className="w-full border border-neutral-200 rounded-2xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-neutral-50" placeholder="e.g. Peanuts, Penicillin" />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Chronic Conditions</label>
              <input type="text" value={profile.chronicConditions} onChange={e => setProfile({...profile, chronicConditions: e.target.value})} className="w-full border border-neutral-200 rounded-2xl px-4 py-3.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-neutral-50" placeholder="e.g. Asthma" />
            </div>
          </div>
        ) : (
          <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-neutral-100/50 bg-white">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100/50">
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">Age</p>
              <p className="text-neutral-900 font-bold text-lg">{profile.age || 'Not set'}</p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100/50">
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">Blood Type</p>
              <p className="text-neutral-900 font-bold text-lg">{profile.bloodType || 'Not set'}</p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100/50">
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">Allergies</p>
              <p className="text-neutral-900 font-bold text-lg">{profile.allergies || 'None'}</p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100/50">
              <p className="text-xs text-neutral-500 uppercase tracking-wider font-bold mb-1">Conditions</p>
              <p className="text-neutral-900 font-bold text-lg">{profile.chronicConditions || 'None'}</p>
            </div>
          </div>
        )}

        <div className="p-8 space-y-8">
          <h4 className="font-bold text-xl text-neutral-900 flex items-center gap-3 font-display">
            <Activity className="w-6 h-6 text-emerald-600" />
            Recent Visits
          </h4>

          <div className="space-y-4">
            {history.map((record, idx) => (
              <div key={idx} className="border border-neutral-100 rounded-2xl p-6 hover:border-emerald-200 hover:shadow-md transition-all bg-white group">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 px-4 py-2 rounded-xl w-fit">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{record.date}</span>
                  </div>
                  <span className="text-sm font-bold text-neutral-600 bg-neutral-100 px-4 py-2 rounded-xl w-fit group-hover:bg-neutral-200 transition-colors">
                    {record.type}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1.5">Diagnosis</p>
                    <p className="text-neutral-900 font-semibold text-lg">{record.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-1.5">Attending Doctor</p>
                    <p className="text-neutral-900 font-medium">{record.doctor}</p>
                  </div>
                  <div className="md:col-span-2 bg-neutral-50 p-4 rounded-xl border border-neutral-100/50">
                    <p className="text-xs text-neutral-400 uppercase tracking-wider font-bold mb-2 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5" /> Prescription
                    </p>
                    <p className="text-neutral-900 font-medium">{record.prescription}</p>
                  </div>
                  <div className="md:col-span-2 bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3 mt-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-amber-800 leading-relaxed">{record.notes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
