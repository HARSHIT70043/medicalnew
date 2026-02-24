import { FileText, Calendar, Activity, Pill, AlertTriangle } from 'lucide-react';

export default function MedicalHistory() {
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900">Patient Medical History</h2>
          <p className="text-neutral-500 mt-1">Quick access to your past medical records and prescriptions.</p>
        </div>
        <button className="bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-sm">
          <FileText className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 bg-neutral-50 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl">
            JD
          </div>
          <div>
            <h3 className="text-xl font-bold text-neutral-900">John Doe</h3>
            <p className="text-neutral-500 text-sm mt-1 flex items-center gap-2">
              <span>DOB: 05/14/1985</span>
              <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
              <span>Blood Type: O+</span>
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Recent Visits
          </h4>

          <div className="space-y-4">
            {history.map((record, idx) => (
              <div key={idx} className="border border-neutral-100 rounded-xl p-5 hover:border-emerald-200 transition-colors bg-white">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                  <div className="flex items-center gap-2 text-emerald-700 font-medium bg-emerald-50 px-3 py-1 rounded-lg w-fit">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{record.date}</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-500 bg-neutral-100 px-3 py-1 rounded-lg w-fit">
                    {record.type}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Diagnosis</p>
                    <p className="text-neutral-900 font-medium">{record.diagnosis}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Attending Doctor</p>
                    <p className="text-neutral-900">{record.doctor}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                      <Pill className="w-3 h-3" /> Prescription
                    </p>
                    <p className="text-neutral-900">{record.prescription}</p>
                  </div>
                  <div className="md:col-span-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex items-start gap-2 mt-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800">{record.notes}</p>
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
