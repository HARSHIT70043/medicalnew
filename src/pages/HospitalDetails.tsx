// src/pages/HospitalDetails.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Star,
  Shield,
  Ambulance,
  ChevronLeft,
  Bed,
  Droplet,
  Users,
  Calendar,
  Award,
  Activity,
  Heart,
  Stethoscope,
  Scissors,
  Building2,
  Thermometer,
  Pill,
  Syringe,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Share2,
  Bookmark,
  ExternalLink,
  Wifi,
  Coffee,
  Car,
  Baby,
  Bone,
  Brain,
  Eye,
  HeartPulse,
  Hospital,
  Microscope,
  Truck,
  Utensils,
  Wallet,
  Globe,
  FlaskConical,
  Sparkles,
  Kanban,
  Tent,
  Hotel,
  Lamp,
  Wind,
  ParkingCircle,
  UtensilsCrossed,
  CreditCard
} from 'lucide-react';

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;
  distanceValue: number;
  rating: number;
  phone: string;
  emergency: boolean;
  open: boolean;
  waitTime: string;
  bedsAvailable: number;
  totalBeds: number;
  specialties: string[];
  facilities: string[];
  estimatedArrival: string;
  bloodUnits?: number;
  icuAvailable?: number;
  image?: string;
  occupancyRate?: number;
  doctorAvailability?: number;
  emergencyRoomWait?: number;
  bloodBankStock?: 'high' | 'medium' | 'low';
  admissionChance?: number;
  established?: string;
  website?: string;
  ambulance?: boolean;
  parking?: boolean;
  wheelchair?: boolean;
  insurance?: string[];
  doctors?: {
    name: string;
    specialty: string;
    available: boolean;
    image?: string;
    experience?: string;
    education?: string;
  }[];
  images?: string[];
  emergencyServices?: string[];
  rating_count?: number;
  description?: string;
}

// Mock data for the same hospitals
const MOCK_HOSPITALS: { [key: string]: Hospital } = {
  '1': {
    id: '1',
    name: "RIMS Ranchi",
    address: "Bariatu, Ranchi, Jharkhand 834009",
    distance: "2.1 km",
    distanceValue: 2.1,
    rating: 4.3,
    rating_count: 1248,
    phone: "+91 651 254 6333",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 25,
    totalBeds: 50,
    bloodUnits: 25,
    icuAvailable: 8,
    occupancyRate: 50,
    doctorAvailability: 80,
    emergencyRoomWait: 15,
    bloodBankStock: 'high',
    admissionChance: 85,
    established: "1975",
    website: "https://rimsranchi.ac.in",
    ambulance: true,
    parking: true,
    wheelchair: true,
    description: "RIMS Ranchi is a premier medical institution in Jharkhand, offering comprehensive healthcare services with state-of-the-art facilities and a team of highly qualified doctors.",
    insurance: ["Cash", "Credit Card", "Insurance", "Government Scheme", "EMI"],
    emergencyServices: ["24/7 Emergency", "Trauma Center", "Ambulance Service", "Emergency Pharmacy"],
    doctors: [
      { name: "Dr. A. Kumar", specialty: "Cardiology", available: true, experience: "15 years", education: "MBBS, MD (Cardiology)" },
      { name: "Dr. S. Singh", specialty: "Neurology", available: true, experience: "12 years", education: "MBBS, DM (Neurology)" },
      { name: "Dr. P. Gupta", specialty: "Emergency Medicine", available: true, experience: "10 years", education: "MBBS, MD (Emergency)" },
      { name: "Dr. R. Sharma", specialty: "General Medicine", available: false, experience: "20 years", education: "MBBS, MD (Medicine)" },
      { name: "Dr. M. Verma", specialty: "Pediatrics", available: true, experience: "8 years", education: "MBBS, MD (Pediatrics)" },
      { name: "Dr. N. Sinha", specialty: "Orthopedics", available: true, experience: "14 years", education: "MBBS, MS (Orthopedics)" }
    ],
    specialties: ["Cardiology", "Emergency", "Neurology", "General Medicine", "Pediatrics", "Orthopedics", "Gynecology", "Oncology"],
    facilities: ["ICU", "Operation Theater", "Blood Bank", "Pharmacy 24/7", "Radiology", "Cafeteria", "ATM", "Ambulance", "Parking", "Wheelchair Access", "Laboratory", "ECG", "X-Ray", "MRI", "CT Scan"],
    estimatedArrival: "5 mins"
  },
  '2': {
    id: '2',
    name: "Santevita Hospital",
    address: "Harmu Housing Colony, Ranchi, Jharkhand 834002",
    distance: "5.1 km",
    distanceValue: 5.1,
    rating: 4.5,
    rating_count: 856,
    phone: "+91 651 224 4555",
    emergency: true,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 10,
    totalBeds: 35,
    bloodUnits: 15,
    icuAvailable: 3,
    occupancyRate: 71,
    doctorAvailability: 65,
    emergencyRoomWait: 10,
    bloodBankStock: 'medium',
    admissionChance: 62,
    established: "2010",
    website: "https://santevita.com",
    ambulance: true,
    parking: true,
    wheelchair: true,
    description: "Santevita Hospital is a modern multi-specialty hospital in Ranchi, known for its patient-centric approach and advanced medical treatments.",
    insurance: ["Cash", "Credit Card", "Insurance"],
    emergencyServices: ["24/7 Emergency", "Ambulance Service"],
    doctors: [
      { name: "Dr. M. Verma", specialty: "Cardiology", available: true, experience: "12 years", education: "MBBS, MD (Cardiology)" },
      { name: "Dr. N. Sinha", specialty: "Orthopedics", available: true, experience: "10 years", education: "MBBS, MS (Orthopedics)" },
      { name: "Dr. K. Pandey", specialty: "Pediatrics", available: false, experience: "8 years", education: "MBBS, MD (Pediatrics)" }
    ],
    specialties: ["Cardiology", "Orthopedics", "Pediatrics", "Emergency", "General Medicine"],
    facilities: ["ICU", "Pharmacy", "Blood Bank", "X-Ray", "Laboratory", "Parking", "Ambulance"],
    estimatedArrival: "12 mins"
  }
};

// Get specialty icon
const getSpecialtyIcon = (specialty: string) => {
  const icons: { [key: string]: any } = {
    'Cardiology': HeartPulse,
    'Neurology': Brain,
    'Pediatrics': Baby,
    'Orthopedics': Bone,
    'Gynecology': Baby,
    'Oncology': Microscope,
    'Emergency': Ambulance,
    'General Medicine': Stethoscope,
    'Ophthalmology': Eye,
    'Dental': Scissors,
  };
  return icons[specialty] || Stethoscope;
};

// Get facility icon
const getFacilityIcon = (facility: string) => {
  if (facility.includes('ICU')) return Activity;
  if (facility.includes('Pharmacy')) return Pill;
  if (facility.includes('Blood')) return Droplet;
  if (facility.includes('Parking')) return Car;
  if (facility.includes('Cafeteria')) return Coffee;
  if (facility.includes('ATM')) return Wallet;
  if (facility.includes('Wheelchair')) return Users;
  if (facility.includes('Ambulance')) return Ambulance;
  if (facility.includes('Radiology') || facility.includes('X-Ray')) return Microscope;
  if (facility.includes('Laboratory')) return FlaskConical;
  if (facility.includes('Operation')) return Scissors;
  return Shield;
};

export default function HospitalDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'specialties' | 'facilities' | 'doctors'>('overview');
  const [saved, setSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    // Fetch hospital data based on ID
    setTimeout(() => {
      if (id && MOCK_HOSPITALS[id]) {
        setHospital(MOCK_HOSPITALS[id]);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const getChanceColor = (chance: number = 0) => {
    if (chance >= 70) return 'text-green-600 bg-green-100 border-green-200';
    if (chance >= 50) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    if (chance >= 30) return 'text-orange-600 bg-orange-100 border-orange-200';
    return 'text-red-600 bg-red-100 border-red-200';
  };

  const getBloodStockColor = (stock?: 'high' | 'medium' | 'low') => {
    switch (stock) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <Heart className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">Loading hospital details...</p>
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hospital Not Found</h2>
          <p className="text-gray-600 mb-6">The hospital you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white font-sans pb-24 md:pb-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:block">Back</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSaved(!saved)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  saved 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-white' : ''}`} />
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: hospital.name,
                      text: `Check out ${hospital.name}`,
                      url: window.location.href,
                    });
                  }
                }}
                className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Fixed overlapping */}
      <div className="relative min-h-[280px] md:min-h-[320px] bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Abstract Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 20 L50 20 L38 30 L43 45 L30 35 L17 45 L22 30 L10 20 L25 20 Z' fill='white' /%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Animated Circles */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Hospital Info Overlay - Fixed positioning */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
              {/* Left side - Hospital info */}
              <div className="space-y-2">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30">
                    {hospital.emergency ? '🚨 Emergency Available' : '🏥 General Hospital'}
                  </span>
                  <span className="inline-flex px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full border border-white/30">
                    {hospital.distance}
                  </span>
                </div>
                
                {/* Hospital Name */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white break-words">
                  {hospital.name}
                </h1>
                
                {/* Rating and Status - Flex wrap for mobile */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-white/90">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1 flex-shrink-0" />
                    <span className="font-medium">{hospital.rating}</span>
                    <span className="text-white/60 ml-1 text-sm">({hospital.rating_count || 1000}+)</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="text-sm">{hospital.waitTime}</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${hospital.open ? 'bg-green-400' : 'bg-red-400'} mr-2 flex-shrink-0`}></div>
                    <span className="text-sm">{hospital.open ? 'Open Now' : 'Closed'}</span>
                  </div>
                </div>
              </div>
              
              {/* Admission Chance Badge - Hidden on mobile, shown on desktop */}
              <div className="hidden md:block">
                <div className={`px-4 py-2 rounded-xl border-2 backdrop-blur-sm ${getChanceColor(hospital.admissionChance || 0)}`}>
                  <div className="text-xs font-medium opacity-80">Admission Chance</div>
                  <div className="text-2xl font-bold">{hospital.admissionChance}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 md:-mt-10 relative z-10">
        {/* Quick Info Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-6 mb-6">
          {/* Address with Map Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-sm text-gray-800 font-medium break-words">{hospital.address}</p>
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${hospital.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <Navigation className="w-4 h-4" />
              <span>View Map</span>
            </a>
          </div>

          {/* Mobile Admission Chance */}
          <div className="md:hidden mb-4">
            <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border ${getChanceColor(hospital.admissionChance || 0)}`}>
              <span className="text-xs font-medium mr-1">Admission Chance:</span>
              <span className="font-bold">{hospital.admissionChance}%</span>
            </div>
          </div>

          {/* Stats Grid - Responsive */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 text-center group hover:shadow-md transition-all">
              <Bed className="w-5 h-5 text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-base md:text-lg font-bold text-gray-800">{hospital.bedsAvailable}/{hospital.totalBeds}</div>
              <div className="text-[10px] text-gray-500 truncate">Beds Available</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 text-center group hover:shadow-md transition-all">
              <Activity className="w-5 h-5 text-purple-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-base md:text-lg font-bold text-gray-800">{hospital.icuAvailable || 0}</div>
              <div className="text-[10px] text-gray-500 truncate">ICU Beds</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-3 text-center group hover:shadow-md transition-all">
              <Droplet className="w-5 h-5 text-red-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-base md:text-lg font-bold text-red-600">{hospital.bloodUnits || 0}U</div>
              <div className="text-[10px] text-gray-500 truncate">Blood Units</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-3 text-center group hover:shadow-md transition-all">
              <Users className="w-5 h-5 text-green-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="text-base md:text-lg font-bold text-gray-800">{hospital.doctorAvailability || 0}%</div>
              <div className="text-[10px] text-gray-500 truncate">Doctors Available</div>
            </div>
          </div>
        </div>

        {/* Emergency Services Banner */}
        {hospital.emergencyServices && (
          <div className="bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl p-4 mb-6 border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center shrink-0">
                <Ambulance className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 mb-1">Emergency Services</h3>
                <div className="flex flex-wrap gap-2">
                  {hospital.emergencyServices.map((service, index) => (
                    <span key={index} className="px-2 py-1 bg-white text-red-600 text-xs rounded-full shadow-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'specialties', label: 'Specialties', icon: Stethoscope },
              { id: 'facilities', label: 'Facilities', icon: Shield },
              { id: 'doctors', label: 'Doctors', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-[90px] px-3 py-3 text-xs md:text-sm font-medium transition-all flex items-center justify-center space-x-1 md:space-x-2 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 mb-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* About Section */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                  <span>About {hospital.name}</span>
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {hospital.description || `Established in ${hospital.established}, ${hospital.name} is a leading healthcare facility in Ranchi providing comprehensive medical services with state-of-the-art infrastructure.`}
                </p>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                  <span>Contact Information</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a href={`tel:${hospital.phone}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors shrink-0">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{hospital.phone}</p>
                    </div>
                  </a>
                  {hospital.website && (
                    <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors group">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors shrink-0">
                        <Globe className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Website</p>
                        <p className="text-sm font-medium text-gray-800 truncate">Visit Website</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>

              {/* Amenities Grid */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                  <span>Amenities & Services</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { icon: Ambulance, label: 'Ambulance', available: hospital.ambulance },
                    { icon: Car, label: 'Parking', available: hospital.parking },
                    { icon: Users, label: 'Wheelchair', available: hospital.wheelchair },
                    { icon: Coffee, label: 'Cafeteria', available: true },
                    { icon: Wifi, label: 'Free WiFi', available: true },
                    { icon: Wallet, label: 'ATM', available: true },
                    { icon: Pill, label: '24/7 Pharmacy', available: true },
                    { icon: FlaskConical, label: 'Lab Services', available: true }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className={`p-2 rounded-lg ${item.available ? 'bg-green-50' : 'bg-gray-50'} flex items-center space-x-2`}>
                        <Icon className={`w-3.5 h-3.5 ${item.available ? 'text-green-600' : 'text-gray-400'} shrink-0`} />
                        <span className={`text-xs ${item.available ? 'text-gray-700' : 'text-gray-400'} truncate`}>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insurance Accepted */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Wallet className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                  <span>Insurance & Payment</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hospital.insurance?.map((item, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specialties' && (
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Medical Specialties</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {hospital.specialties.map((specialty, index) => {
                  const Icon = getSpecialtyIcon(specialty);
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all group">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="text-xs md:text-sm font-medium text-gray-700 truncate">{specialty}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'facilities' && (
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Hospital Facilities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {hospital.facilities.map((facility, index) => {
                  const Icon = getFacilityIcon(facility);
                  return (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group">
                      <Icon className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform shrink-0" />
                      <span className="text-xs text-gray-700 truncate">{facility}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base md:text-lg font-semibold text-gray-800">Our Doctors</h3>
                <span className="text-xs text-gray-500">{hospital.doctors?.length} specialists</span>
              </div>
              <div className="space-y-3">
                {hospital.doctors?.map((doctor, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 truncate">{doctor.name}</p>
                        <p className="text-xs text-gray-500 truncate">{doctor.specialty}</p>
                        {doctor.experience && (
                          <p className="text-[10px] text-gray-400 mt-1 truncate">{doctor.experience}</p>
                        )}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-medium self-start sm:self-center ${doctor.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {doctor.available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl group px-2"
          >
            <Navigation className="w-4 h-4 group-hover:rotate-12 transition-transform shrink-0" />
            <span className="truncate">Get Directions</span>
          </a>
          <a
            href={`tel:${hospital.phone}`}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl group px-2"
          >
            <Phone className="w-4 h-4 group-hover:scale-110 transition-transform shrink-0" />
            <span className="truncate">Call Now</span>
          </a>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}