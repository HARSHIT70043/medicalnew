import React, { useState, useRef } from 'react';
import { Camera, Upload, AlertTriangle, MapPin, CheckCircle2, Loader2 } from 'lucide-react';

export default function EmergencyReport() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      // Compress image before setting it to state
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with reduced quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setPhoto(dataUrl);
        setError(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (err) => {
          console.error(err);
          setError("Could not get location. Please enter it manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      setError('Please upload or take a photo of the emergency.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/emergency-report', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          photoBase64: photo,
          description,
          location,
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      setSuccess(true);
      setPhoto(null);
      setDescription('');
      setLocation('');
    } catch (err: any) {
      setError(err.message || 'Network error. Could not reach the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-10 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-100 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-neutral-900 mb-3 font-display">Report Submitted</h2>
        <p className="text-neutral-500 mb-8 max-w-md mx-auto text-lg">
          The emergency report and photo have been securely saved to the database. Emergency contacts or nearby hospitals will be notified.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 relative overflow-hidden rounded-3xl bg-red-600 text-white p-8 shadow-xl shadow-red-600/20">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-red-500 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-pulse" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shrink-0">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display mb-2">Emergency Report</h1>
            <p className="text-red-100 text-sm md:text-base max-w-md">
              Upload a photo of the accident, wound, or emergency situation. This data will be saved securely to the database.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-medium flex items-center gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100">
        
        {/* Photo Upload Section */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-3 uppercase tracking-wider">
            Emergency Photo <span className="text-red-500">*</span>
          </label>
          
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {photo ? (
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-inner group">
              <img src={photo} alt="Emergency preview" className="w-full h-64 object-contain" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="bg-white text-red-600 px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform"
                >
                  Remove Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 h-36 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all group"
              >
                <div className="p-3 bg-neutral-100 rounded-full group-hover:bg-red-100 transition-colors">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold">Take Photo</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 h-36 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-500 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all group"
              >
                <div className="p-3 bg-neutral-100 rounded-full group-hover:bg-red-100 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold">Upload Image</span>
              </button>
            </div>
          )}
        </div>

        {/* Location Section */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-3 uppercase tracking-wider">
            Location
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location or use GPS"
              className="flex-1 px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
            />
            <button
              type="button"
              onClick={getLocation}
              className="px-5 py-3.5 bg-neutral-100 text-neutral-700 rounded-2xl hover:bg-neutral-200 transition-colors flex items-center gap-2 font-semibold shadow-sm"
            >
              <MapPin className="w-5 h-5" />
              <span className="hidden sm:inline">Get GPS</span>
            </button>
          </div>
        </div>

        {/* Description Section */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-3 uppercase tracking-wider">
            Description / Notes
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the situation, injuries, or any other relevant details..."
            rows={4}
            className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !photo}
          className="w-full flex items-center justify-center gap-3 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-xl shadow-red-600/20 active:scale-[0.98]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Saving to Database...
            </>
          ) : (
            <>
              <AlertTriangle className="w-6 h-6" />
              Submit Emergency Report
            </>
          )}
        </button>
      </form>
    </div>
  );
}
