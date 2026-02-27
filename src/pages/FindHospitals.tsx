// src/pages/FindHospitals.tsx
import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  AlertCircle, 
  Heart, 
  Star, 
  Shield,
  Ambulance,
  Search,
  ChevronRight,
  Loader2,
  Hospital,
  Building2,
  Stethoscope,
  Scissors,
  Activity,
  Bed,
  Filter,
  X,
  FileText,
  Brain,
  Droplet,
  TrendingUp,
  Users,
  Activity as ActivityIcon,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  image?: string;
  occupancyRate?: number;
  doctorAvailability?: number;
  emergencyRoomWait?: number;
  icuAvailable?: number;
  bloodBankStock?: 'high' | 'medium' | 'low';
  admissionChance?: number;
}

// Real hospitals near Ranchi area
const MOCK_HOSPITALS: Hospital[] = [
  {
    id: '1',
    name: "RIMS Ranchi",
    address: "Bariatu, Ranchi, Jharkhand 834009",
    distance: "2.1 km",
    distanceValue: 2.1,
    rating: 4.3,
    phone: "+91 651 254 6333",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 25,
    totalBeds: 50,
    specialties: ["Emergency", "Cardiology", "Neurology", "General Medicine"],
    occupancyRate: 50,
    doctorAvailability: 80,
    emergencyRoomWait: 15,
    icuAvailable: 8,
    bloodBankStock: 'high',
    admissionChance: 85
  },
  {
    id: '2',
    name: "Santevita Hospital",
    address: "Harmu Housing Colony, Ranchi, Jharkhand 834002",
    distance: "5.1 km",
    distanceValue: 5.1,
    rating: 4.5,
    phone: "+91 651 224 4555",
    emergency: true,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 10,
    totalBeds: 35,
    specialties: ["Emergency", "Cardiology", "Orthopedics", "Pediatrics"],
    occupancyRate: 71,
    doctorAvailability: 65,
    emergencyRoomWait: 10,
    icuAvailable: 3,
    bloodBankStock: 'medium',
    admissionChance: 62
  },
  {
    id: '3',
    name: "Orchid Medical Centre",
    address: "Circular Road, Ranchi, Jharkhand 834001",
    distance: "4.2 km",
    distanceValue: 4.2,
    rating: 4.2,
    phone: "+91 651 233 5678",
    emergency: true,
    open: true,
    waitTime: "20-25 min",
    bedsAvailable: 8,
    totalBeds: 30,
    specialties: ["Emergency", "General Medicine", "Gynecology", "Pediatrics"],
    occupancyRate: 73,
    doctorAvailability: 70,
    emergencyRoomWait: 20,
    icuAvailable: 2,
    bloodBankStock: 'medium',
    admissionChance: 58
  },
  {
    id: '4',
    name: "Bhagwan Mahavir Medica Hospital",
    address: "Hinoo, Ranchi, Jharkhand 834002",
    distance: "3.4 km",
    distanceValue: 3.4,
    rating: 4.4,
    phone: "+91 651 234 5678",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 6,
    totalBeds: 40,
    specialties: ["Emergency", "Cardiology", "Neurology", "Surgery"],
    occupancyRate: 85,
    doctorAvailability: 60,
    emergencyRoomWait: 18,
    icuAvailable: 1,
    bloodBankStock: 'low',
    admissionChance: 45
  },
  {
    id: '5',
    name: "Raj Hospital Ranchi",
    address: "Main Road, Ranchi, Jharkhand 834001",
    distance: "3.9 km",
    distanceValue: 3.9,
    rating: 4.1,
    phone: "+91 651 222 3344",
    emergency: false,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 5,
    totalBeds: 25,
    specialties: ["General Medicine", "Orthopedics", "Dental", "ENT"],
    occupancyRate: 80,
    doctorAvailability: 75,
    emergencyRoomWait: 12,
    icuAvailable: 0,
    bloodBankStock: 'medium',
    admissionChance: 52
  },
  {
    id: '6',
    name: "Medica Superspecialty Hospital",
    address: "Ratu Road, Ranchi, Jharkhand 834005",
    distance: "4.8 km",
    distanceValue: 4.8,
    rating: 4.6,
    phone: "+91 651 345 6789",
    emergency: true,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 15,
    totalBeds: 80,
    specialties: ["Emergency", "Cardiology", "Neurology", "Oncology", "Surgery"],
    occupancyRate: 81,
    doctorAvailability: 85,
    emergencyRoomWait: 12,
    icuAvailable: 12,
    bloodBankStock: 'high',
    admissionChance: 78
  },
  {
    id: '7',
    name: "Life Care Hospital",
    address: "Kokar, Ranchi, Jharkhand 834001",
    distance: "2.8 km",
    distanceValue: 2.8,
    rating: 4.0,
    phone: "+91 651 256 7890",
    emergency: false,
    open: true,
    waitTime: "5-10 min",
    bedsAvailable: 3,
    totalBeds: 20,
    specialties: ["General Medicine", "Pediatrics", "Gynecology"],
    occupancyRate: 85,
    doctorAvailability: 55,
    emergencyRoomWait: 8,
    icuAvailable: 0,
    bloodBankStock: 'low',
    admissionChance: 38
  },
  {
    id: 'j1',
    name: "Tata Main Hospital (TMH)",
    address: "C Road West, Northern Town, Bistupur, Jamshedpur, Jharkhand 831001",
    distance: "2.3 km",
    distanceValue: 2.3,
    rating: 4.8,
    phone: "+91 657 242 3301",
    emergency: true,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 45,
    totalBeds: 350,
    icuAvailable: 28,
    occupancyRate: 72,
    doctorAvailability: 88,
    emergencyRoomWait: 12,
    bloodBankStock: 'high',
    admissionChance: 82,
    specialties: ["Cardiology", "Neurology", "Oncology", "Emergency", "Pediatrics", "Orthopedics", "Burns Unit"],

  },
  {
    id: 'j2',
    name: "Brahmanyam Hospital",
    address: "Q Road, Sakchi, Jamshedpur, Jharkhand 831001",
    distance: "3.1 km",
    distanceValue: 3.1,
    rating: 4.3,
    phone: "+91 657 222 4567",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 18,
    totalBeds: 75,
    icuAvailable: 6,
    occupancyRate: 76,
    doctorAvailability: 72,
    emergencyRoomWait: 18,
    bloodBankStock: 'medium',
    admissionChance: 68,
    specialties: ["Cardiology", "General Medicine", "Orthopedics", "Pediatrics"],
    
  },
  {
    id: 'j3',
    name: "Al-Karim Hospital",
    address: "Main Road, Bistupur, Jamshedpur, Jharkhand 831001",
    distance: "2.8 km",
    distanceValue: 2.8,
    rating: 4.2,
    phone: "+91 657 223 7890",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 12,
    totalBeds: 50,
    
    icuAvailable: 4,
    occupancyRate: 78,
    doctorAvailability: 70,
    emergencyRoomWait: 20,
    bloodBankStock: 'medium',
    admissionChance: 62,
    specialties: ["General Medicine", "Gynecology", "Pediatrics", "ENT"],
    
  },
  {
    id: 'j4',
    name: "Mercy Hospital",
    address: "Dimna Road, Mango, Jamshedpur, Jharkhand 831012",
    distance: "5.2 km",
    distanceValue: 5.2,
    rating: 4.0,
    phone: "+91 657 236 5432",
    emergency: true,
    open: true,
    waitTime: "20-25 min",
    bedsAvailable: 8,
    totalBeds: 40,
    
    icuAvailable: 2,
    occupancyRate: 82,
    doctorAvailability: 65,
    emergencyRoomWait: 22,
    bloodBankStock: 'low',
    admissionChance: 48,
    specialties: ["General Medicine", "Pediatrics", "Gynecology"],
    
    
  },
  {
    id: 'j5',
    name: "Lifeline Hospital",
    address: "Telco Colony, Jamshedpur, Jharkhand 831004",
    distance: "6.5 km",
    distanceValue: 6.5,
    rating: 4.1,
    phone: "+91 657 248 1122",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 14,
    totalBeds: 55,
    
    icuAvailable: 3,
    occupancyRate: 75,
    doctorAvailability: 68,
    emergencyRoomWait: 18,
    bloodBankStock: 'medium',
    admissionChance: 58,
    specialties: ["General Medicine", "Orthopedics", "Dental", "ENT"],
    
    
  },
  {
    id: 'j6',
    name: "SRS Hospital",
    address: "Adityapur, Jamshedpur, Jharkhand 831013",
    distance: "7.8 km",
    distanceValue: 7.8,
    rating: 4.0,
    phone: "+91 657 255 6789",
    emergency: false,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 9,
    totalBeds: 35,
    
    icuAvailable: 1,
    occupancyRate: 74,
    doctorAvailability: 70,
    emergencyRoomWait: 15,
    bloodBankStock: 'low',
    admissionChance: 52,
    specialties: ["General Medicine", "Pediatrics", "Gynecology"],
    
    
  },
  {
    id: 'j7',
    name: "Krishna Hospital",
    address: "Golmuri, Jamshedpur, Jharkhand 831003",
    distance: "4.3 km",
    distanceValue: 4.3,
    rating: 4.2,
    phone: "+91 657 234 5678",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 11,
    totalBeds: 45,
    
    icuAvailable: 3,
    occupancyRate: 76,
    doctorAvailability: 72,
    emergencyRoomWait: 18,
    bloodBankStock: 'medium',
    admissionChance: 60,
    specialties: ["General Medicine", "Orthopedics", "Pediatrics"],
  
  },
  {
    id: 'j8',
    name: "Sheetal Hospital",
    address: "Bistupur, Jamshedpur, Jharkhand 831001",
    distance: "2.5 km",
    distanceValue: 2.5,
    rating: 4.3,
    phone: "+91 657 222 8899",
    emergency: true,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 16,
    totalBeds: 60,
   
    icuAvailable: 5,
    occupancyRate: 73,
    doctorAvailability: 75,
    emergencyRoomWait: 14,
    bloodBankStock: 'medium',
    admissionChance: 68,
    specialties: ["Cardiology", "General Medicine", "Neurology", "Pediatrics"],
    
  },
  {
    id: 'j9',
    name: "M.G.M. Medical College",
    address: "Sakchi, Jamshedpur, Jharkhand 831001",
    distance: "3.5 km",
    distanceValue: 3.5,
    rating: 4.4,
    phone: "+91 657 222 3344",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 32,
    totalBeds: 150,
   
    icuAvailable: 12,
    occupancyRate: 78,
    doctorAvailability: 82,
    emergencyRoomWait: 16,
    bloodBankStock: 'high',
    admissionChance: 74,
    specialties: ["Cardiology", "Neurology", "Pediatrics", "Gynecology", "Orthopedics", "Emergency"],
    
  },
  {
    id: 'j10',
    name: "Arya Hospital",
    address: "Sonari, Jamshedpur, Jharkhand 831011",
    distance: "5.8 km",
    distanceValue: 5.8,
    rating: 4.0,
    phone: "+91 657 245 6789",
    emergency: false,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 7,
    totalBeds: 30,
    
    icuAvailable: 1,
    occupancyRate: 77,
    doctorAvailability: 68,
    emergencyRoomWait: 12,
    bloodBankStock: 'low',
    admissionChance: 48,
    specialties: ["General Medicine", "Dental", "ENT"],
   
  }
];

// Dhanbad Hospitals
export const DHANBAD_HOSPITALS = [
  {
    id: 'd1',
    name: "Central Hospital (BCCL)",
    address: "Koyla Nagar, Dhanbad, Jharkhand 826005",
    distance: "2.8 km",
    distanceValue: 2.8,
    rating: 4.5,
    phone: "+91 326 223 0456",
    emergency: true,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 38,
    totalBeds: 200,
    bloodUnits: 35,
    icuAvailable: 14,
    occupancyRate: 70,
    doctorAvailability: 85,
    emergencyRoomWait: 12,
    bloodBankStock: 'high',
    admissionChance: 80,
    specialties: ["Cardiology", "Neurology", "General Medicine", "Pediatrics", "Orthopedics", "Emergency"],
    facilities: ["ICU", "Operation Theater", "Blood Bank", "Pharmacy", "Radiology", "MRI", "CT Scan"],
    estimatedArrival: "10 mins"
  },
  {
    id: 'd2',
    name: "Shahid Nirmal Mahto Medical College",
    address: "Hirapur, Dhanbad, Jharkhand 826001",
    distance: "3.2 km",
    distanceValue: 3.2,
    rating: 4.3,
    phone: "+91 326 231 2345",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 42,
    totalBeds: 180,
    bloodUnits: 30,
    icuAvailable: 12,
    occupancyRate: 75,
    doctorAvailability: 80,
    emergencyRoomWait: 16,
    bloodBankStock: 'high',
    admissionChance: 76,
    specialties: ["Cardiology", "Neurology", "Pediatrics", "Gynecology", "Emergency", "Orthopedics"],
    facilities: ["ICU", "Operation Theater", "Blood Bank", "Pharmacy", "Radiology", "Laboratory"],
    estimatedArrival: "12 mins"
  },
  {
    id: 'd3',
    name: "Asian Hospital",
    address: "Bartand, Dhanbad, Jharkhand 826001",
    distance: "3.5 km",
    distanceValue: 3.5,
    rating: 4.2,
    phone: "+91 326 222 5678",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 15,
    totalBeds: 70,
    bloodUnits: 12,
    icuAvailable: 4,
    occupancyRate: 78,
    doctorAvailability: 72,
    emergencyRoomWait: 18,
    bloodBankStock: 'medium',
    admissionChance: 62,
    specialties: ["Cardiology", "General Medicine", "Orthopedics", "Pediatrics"],
    facilities: ["ICU", "Operation Theater", "Pharmacy", "X-Ray", "ECG", "Laboratory"],
    estimatedArrival: "12 mins"
  },
  {
    id: 'd4',
    name: "City Hospital",
    address: "Bank More, Dhanbad, Jharkhand 826001",
    distance: "2.1 km",
    distanceValue: 2.1,
    rating: 4.0,
    phone: "+91 326 230 7890",
    emergency: true,
    open: true,
    waitTime: "20-25 min",
    bedsAvailable: 8,
    totalBeds: 40,
    bloodUnits: 6,
    icuAvailable: 2,
    occupancyRate: 82,
    doctorAvailability: 65,
    emergencyRoomWait: 22,
    bloodBankStock: 'low',
    admissionChance: 48,
    specialties: ["General Medicine", "Pediatrics", "Gynecology"],
    facilities: ["ICU", "Pharmacy", "Laboratory", "X-Ray"],
    estimatedArrival: "8 mins"
  },
  {
    id: 'd5',
    name: "AIIMS Dhanbad",
    address: "Basuria, Dhanbad, Jharkhand 826001",
    distance: "5.5 km",
    distanceValue: 5.5,
    rating: 4.7,
    phone: "+91 326 249 1122",
    emergency: true,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 52,
    totalBeds: 250,
    bloodUnits: 48,
    icuAvailable: 22,
    occupancyRate: 68,
    doctorAvailability: 92,
    emergencyRoomWait: 10,
    bloodBankStock: 'high',
    admissionChance: 88,
    specialties: ["Cardiology", "Neurology", "Oncology", "Pediatrics", "Emergency", "Orthopedics", "Pulmonology"],
    facilities: ["ICU", "Operation Theater", "Blood Bank", "Pharmacy 24/7", "Radiology", "Cath Lab", "Trauma Center", "MRI", "CT Scan", "Research Center"],
    estimatedArrival: "18 mins"
  },
  {
    id: 'd6',
    name: "R.K. Hospital",
    address: "Saraidhela, Dhanbad, Jharkhand 828127",
    distance: "6.2 km",
    distanceValue: 6.2,
    rating: 3.9,
    phone: "+91 326 255 3344",
    emergency: false,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 6,
    totalBeds: 25,
    bloodUnits: 3,
    icuAvailable: 1,
    occupancyRate: 76,
    doctorAvailability: 60,
    emergencyRoomWait: 12,
    bloodBankStock: 'low',
    admissionChance: 42,
    specialties: ["General Medicine", "Dental", "ENT"],
    facilities: ["Pharmacy", "Dental Clinic", "X-Ray"],
    estimatedArrival: "22 mins"
  },
  {
    id: 'd7',
    name: "Jeevan Jyoti Hospital",
    address: "Jharia, Dhanbad, Jharkhand 828111",
    distance: "7.5 km",
    distanceValue: 7.5,
    rating: 4.0,
    phone: "+91 326 244 5566",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 10,
    totalBeds: 45,
    bloodUnits: 7,
    icuAvailable: 2,
    occupancyRate: 78,
    doctorAvailability: 68,
    emergencyRoomWait: 18,
    bloodBankStock: 'medium',
    admissionChance: 52,
    specialties: ["General Medicine", "Pediatrics", "Gynecology"],
    facilities: ["ICU", "Pharmacy", "Laboratory", "Ultrasound"],
    estimatedArrival: "25 mins"
  },
  {
    id: 'd8',
    name: "Grace Hospital",
    address: "Hirapur, Dhanbad, Jharkhand 826001",
    distance: "3.8 km",
    distanceValue: 3.8,
    rating: 4.1,
    phone: "+91 326 232 7788",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 12,
    totalBeds: 50,
    bloodUnits: 9,
    icuAvailable: 3,
    occupancyRate: 76,
    doctorAvailability: 70,
    emergencyRoomWait: 18,
    bloodBankStock: 'medium',
    admissionChance: 58,
    specialties: ["General Medicine", "Orthopedics", "Pediatrics"],
    facilities: ["ICU", "Pharmacy", "X-Ray", "Laboratory", "ECG"],
    estimatedArrival: "14 mins"
  },
  {
    id: 'd9',
    name: "Kusum Devi Hospital",
    address: "Bank More, Dhanbad, Jharkhand 826001",
    distance: "2.5 km",
    distanceValue: 2.5,
    rating: 4.2,
    phone: "+91 326 230 1122",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 14,
    totalBeds: 55,
    bloodUnits: 10,
    icuAvailable: 4,
    occupancyRate: 75,
    doctorAvailability: 72,
    emergencyRoomWait: 16,
    bloodBankStock: 'medium',
    admissionChance: 62,
    specialties: ["Cardiology", "General Medicine", "Gynecology", "Pediatrics"],
    facilities: ["ICU", "Operation Theater", "Pharmacy", "X-Ray", "Laboratory"],
    estimatedArrival: "9 mins"
  },
  {
    id: 'd10',
    name: "Surya Hospital",
    address: "Bartand, Dhanbad, Jharkhand 826001",
    distance: "3.3 km",
    distanceValue: 3.3,
    rating: 4.0,
    phone: "+91 326 223 9900",
    emergency: false,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 7,
    totalBeds: 30,
    bloodUnits: 4,
    icuAvailable: 1,
    occupancyRate: 77,
    doctorAvailability: 65,
    emergencyRoomWait: 14,
    bloodBankStock: 'low',
    admissionChance: 46,
    specialties: ["General Medicine", "ENT", "Dental"],
    facilities: ["Pharmacy", "Dental Clinic", "X-Ray"],
    estimatedArrival: "12 mins"
  },
  {
    id: 'd11',
    name: "Maulana Azad Medical College",
    address: "Jharia Road, Dhanbad, Jharkhand 828109",
    distance: "6.8 km",
    distanceValue: 6.8,
    rating: 4.3,
    phone: "+91 326 246 7788",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 22,
    totalBeds: 120,
    bloodUnits: 18,
    icuAvailable: 8,
    occupancyRate: 73,
    doctorAvailability: 78,
    emergencyRoomWait: 16,
    bloodBankStock: 'high',
    admissionChance: 72,
    specialties: ["Cardiology", "Neurology", "General Medicine", "Pediatrics", "Emergency"],
    facilities: ["ICU", "Operation Theater", "Blood Bank", "Pharmacy", "Radiology", "Laboratory"],
    estimatedArrival: "22 mins"
  },
  {
    id: 'd12',
    name: "B.C.C.L. Regional Hospital",
    address: "Koyla Nagar, Dhanbad, Jharkhand 826005",
    distance: "3.0 km",
    distanceValue: 3.0,
    rating: 4.4,
    phone: "+91 326 223 4567",
    emergency: true,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 28,
    totalBeds: 150,
    bloodUnits: 22,
    icuAvailable: 10,
    occupancyRate: 72,
    doctorAvailability: 82,
    emergencyRoomWait: 14,
    bloodBankStock: 'high',
    admissionChance: 76,
    specialties: ["Cardiology", "Neurology", "General Medicine", "Orthopedics", "Emergency"],
    facilities: ["ICU", "Operation Theater", "Blood Bank", "Pharmacy", "Radiology", "MRI"],
    estimatedArrival: "11 mins"
  }

];

// Function to calculate admission chance
const calculateAdmissionChance = (hospital: Hospital): number => {
  const weights = {
    bedsAvailable: 0.4,
    occupancyRate: 0.2,
    doctorAvailability: 0.2,
    icuAvailable: 0.1,
    bloodBankStock: 0.1
  };

  const bedScore = (hospital.bedsAvailable / hospital.totalBeds) * 100;
  const occupancyScore = 100 - (hospital.occupancyRate || 70);
  const doctorScore = hospital.doctorAvailability || 70;
  const icuScore = Math.min(((hospital.icuAvailable || 0) / 5) * 100, 100);
  
  let bloodScore = 50;
  if (hospital.bloodBankStock === 'high') bloodScore = 100;
  else if (hospital.bloodBankStock === 'low') bloodScore = 20;
  
  const totalScore = 
    (bedScore * weights.bedsAvailable) +
    (occupancyScore * weights.occupancyRate) +
    (doctorScore * weights.doctorAvailability) +
    (icuScore * weights.icuAvailable) +
    (bloodScore * weights.bloodBankStock);
  
  return Math.round(totalScore);
};

// Sort hospitals by admission chance
const sortByAdmissionChance = (hospitals: Hospital[]): Hospital[] => {
  return [...hospitals].sort((a, b) => {
    const chanceA = a.admissionChance || calculateAdmissionChance(a);
    const chanceB = b.admissionChance || calculateAdmissionChance(b);
    return chanceB - chanceA;
  });
};

export default function FindHospitals() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [userName, setUserName] = useState('');
  const [sortBy, setSortBy] = useState<'chance' | 'beds' | 'distance'>('chance');

  useEffect(() => {
    const name = localStorage.getItem('userName') || 'Guest';
    setUserName(name);

    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          
          setTimeout(() => {
            const hospitalsWithChance = MOCK_HOSPITALS.map(h => ({
              ...h,
              admissionChance: h.admissionChance || calculateAdmissionChance(h)
            }));
            
            const sortedHospitals = sortByAdmissionChance(hospitalsWithChance);
            setHospitals(sortedHospitals);
            setFilteredHospitals(sortedHospitals);
            setLoading(false);
          }, 1000);
        },
        (err) => {
          setError('Could not get your location. Showing default hospitals.');
          const hospitalsWithChance = MOCK_HOSPITALS.map(h => ({
            ...h,
            admissionChance: h.admissionChance || calculateAdmissionChance(h)
          }));
          const sortedHospitals = sortByAdmissionChance(hospitalsWithChance);
          setHospitals(sortedHospitals);
          setFilteredHospitals(sortedHospitals);
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      const hospitalsWithChance = MOCK_HOSPITALS.map(h => ({
        ...h,
        admissionChance: h.admissionChance || calculateAdmissionChance(h)
      }));
      const sortedHospitals = sortByAdmissionChance(hospitalsWithChance);
      setHospitals(sortedHospitals);
      setFilteredHospitals(sortedHospitals);
      setLoading(false);
    }
  }, []);

  // Apply search and filter
  useEffect(() => {
    let results = [...hospitals];

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(hospital =>
        hospital.name.toLowerCase().includes(query) ||
        hospital.address.toLowerCase().includes(query) ||
        hospital.specialties.some(s => s.toLowerCase().includes(query))
      );
    }

    if (selectedFilter === 'emergency') {
      results = results.filter(h => h.emergency === true);
    }

    if (sortBy === 'chance') {
      results = sortByAdmissionChance(results);
    } else if (sortBy === 'beds') {
      results = [...results].sort((a, b) => b.bedsAvailable - a.bedsAvailable);
    } else if (sortBy === 'distance') {
      results = [...results].sort((a, b) => a.distanceValue - b.distanceValue);
    }

    setFilteredHospitals(results);
  }, [searchQuery, selectedFilter, hospitals, sortBy]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const getChanceColor = (chance: number = 0) => {
    if (chance >= 70) return 'text-green-600 bg-green-100';
    if (chance >= 50) return 'text-yellow-600 bg-yellow-100';
    if (chance >= 30) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      {/* Welcome Section - Desktop & Mobile */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Desktop Welcome */}
        <div className="hidden md:block relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between backdrop-blur-sm bg-white/5 rounded-3xl p-6 border border-white/10">
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {userName}! 👋
              </h1>
              <p className="text-blue-100 text-sm md:text-base flex items-center">
                <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                {location ? 'Showing hospitals near your location' : 'Using default location'}
              </p>
            </div>
            <div className="mt-4 md:mt-0 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl inline-flex items-center self-start md:self-center border border-white/20">
              <Hospital className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{filteredHospitals.length} hospitals found</span>
            </div>
          </div>
        </div>

        {/* Mobile Welcome - Compact */}
        <div className="md:hidden px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-bold">
                Welcome, {userName}! 
              </h1>
              <p className="text-xs text-blue-100 flex items-center mt-0.5">
                <MapPin className="w-3 h-3 mr-1" />
                {location ? 'Near your location' : 'Default location'}
              </p>
            </div>
            <div className="bg-white/20 px-3 py-1.5 rounded-full">
              <span className="text-xs font-medium">{filteredHospitals.length} found</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Desktop Search Section */}
          <div className="flex-1 mb-4">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hospitals by name, address, or specialty..."
                  className="w-full pl-9 pr-8 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                    selectedFilter === 'all'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter('emergency')}
                  className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap flex items-center space-x-1 transition-all ${
                    selectedFilter === 'emergency'
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Ambulance className="w-4 h-4" />
                  <span>Emergency</span>
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-500">Sort by:</span>
                <button
                  onClick={() => setSortBy('chance')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    sortBy === 'chance'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  Admission Chance
                </button>
                <button
                  onClick={() => setSortBy('beds')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    sortBy === 'beds'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Bed className="w-3 h-3 inline mr-1" />
                  Available Beds
                </button>
                <button
                  onClick={() => setSortBy('distance')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    sortBy === 'distance'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <MapPin className="w-3 h-3 inline mr-1" />
                  Distance
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals..."
              className="w-full pl-9 pr-8 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Pills - 2 Column */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`py-3 rounded-xl font-medium text-sm transition-all ${
                selectedFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              All Hospitals
            </button>
            <button
              onClick={() => setSelectedFilter('emergency')}
              className={`py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-1 transition-all ${
                selectedFilter === 'emergency'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              <Ambulance className="w-4 h-4" />
              <span>Emergency</span>
            </button>
          </div>

          {/* Mobile Sort Options */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Sort by:</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setSortBy('chance')}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  sortBy === 'chance'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Chance
              </button>
              <button
                onClick={() => setSortBy('beds')}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  sortBy === 'beds'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                <Bed className="w-3 h-3 inline mr-1" />
                Beds
              </button>
              <button
                onClick={() => setSortBy('distance')}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  sortBy === 'distance'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                <MapPin className="w-3 h-3 inline mr-1" />
                Distance
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Shared between mobile and desktop */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 text-center">
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">TOTAL</div>
            <div className="text-xl font-bold text-gray-800">
              {hospitals.reduce((sum, h) => sum + h.bedsAvailable, 0)}
            </div>
            <div className="text-[10px] text-gray-500 flex items-center justify-center mt-0.5">
              <Bed className="w-3 h-3 mr-1" />
              Beds
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-3 text-center">
            <div className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">ACTIVE</div>
            <div className="text-xl font-bold text-gray-800">
              {hospitals.filter(h => h.emergency).length}
            </div>
            <div className="text-[10px] text-gray-500 flex items-center justify-center mt-0.5">
              <Ambulance className="w-3 h-3 mr-1" />
              Centers
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-3 text-center">
            <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-1">AVG</div>
            <div className="text-xl font-bold text-gray-800">
              {Math.round(hospitals.reduce((sum, h) => sum + (h.admissionChance || 0), 0) / hospitals.length)}%
            </div>
            <div className="text-[10px] text-gray-500 flex items-center justify-center mt-0.5">
              <TrendingUp className="w-3 h-3 mr-1" />
              Chance
            </div>
          </div>
        </div>

        {/* Emergency Button - Mobile */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => navigate('/emergency-search', { state: { location } })}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-semibold shadow-md flex items-center justify-center space-x-2 text-sm"
          >
            <Ambulance className="w-4 h-4" />
            <span>Emergency Search</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Emergency Button - Desktop */}
        <div className="hidden md:flex md:justify-start md:mb-6">
          <button
            onClick={() => navigate('/emergency-search', { state: { location } })}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-semibold shadow-lg flex items-center justify-center space-x-2 text-base"
          >
            <Ambulance className="w-5 h-5" />
            <span>Emergency Hospital Search</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <div className="bg-yellow-50 text-yellow-700 p-4 rounded-xl flex items-start gap-3 border border-yellow-200 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-4 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hospital List */}
        {!loading && (
          <>
            {/* Results count */}
            <div className="mb-3 text-sm text-gray-600">
              Showing <span className="font-semibold text-blue-600">{filteredHospitals.length}</span> hospitals 
              {searchQuery && ` matching "${searchQuery}"`}
              {sortBy === 'chance' && ' • Sorted by chance'}
              {sortBy === 'beds' && ' • Sorted by beds'}
              {sortBy === 'distance' && ' • Sorted by distance'}
            </div>

            {/* Hospital Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHospitals.map((hospital) => (
                <div
    key={hospital.id}
    onClick={() => navigate(`/hospital/${hospital.id}`)}
    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border border-gray-200 cursor-pointer hover:border-blue-200 active:scale-[0.98]"
  >
                  {/* Hospital Header */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{hospital.name}</h3>
                    <div className="flex flex-col items-end gap-1">
                      {hospital.emergency && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full flex items-center whitespace-nowrap">
                          <Ambulance className="w-3 h-3 mr-1" />
                          24/7
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${getChanceColor(hospital.admissionChance)}`}>
                        {hospital.admissionChance}%
      <span className="md:hidden"> Chance</span>
                      </span>
                    </div>
                  </div>

                  {/* Location and Rating */}
                  <div className="flex items-center gap-2 mb-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 text-gray-400 mr-1" />
                      <span>{hospital.distance}</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                      <span>{hospital.rating}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{hospital.address}</p>

                  {/* Resource Indicators */}
                  <div className="grid grid-cols-3 gap-1 mb-3">
                    <div className="text-center p-1 bg-gray-50 rounded-lg">
                      <div className="text-[10px] font-medium text-gray-500">Beds</div>
                      <div className="text-xs font-bold text-gray-700">{hospital.bedsAvailable}/{hospital.totalBeds}</div>
                    </div>
                    <div className="text-center p-1 bg-gray-50 rounded-lg">
                      <div className="text-[10px] font-medium text-gray-500">ICU</div>
                      <div className="text-xs font-bold text-gray-700">{hospital.icuAvailable || 0}</div>
                    </div>
                    <div className="text-center p-1 bg-gray-50 rounded-lg">
                      <div className="text-[10px] font-medium text-gray-500">Blood</div>
                      <div className={`text-xs font-bold ${
                        hospital.bloodBankStock === 'high' ? 'text-green-600' :
                        hospital.bloodBankStock === 'medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {hospital.bloodBankStock === 'high' ? '🟢 High' :
                         hospital.bloodBankStock === 'medium' ? '🟡 Med' : '🔴 Low'}
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hospital.specialties.slice(0, 3).map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                    {hospital.specialties.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{hospital.specialties.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${hospital.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-3 rounded-lg font-medium text-xs flex items-center justify-center gap-1 hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Directions</span>
                    </a>
                    <a
                      href={`tel:${hospital.phone}`}
                      className="w-9 h-8 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-all"
                      title="Call Hospital"
                    >
                      <Phone className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredHospitals.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <Hospital className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No hospitals found</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto px-4">
                  Try adjusting your search or filter to find more hospitals near you.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Custom styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .bg-grid-white {
          background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}