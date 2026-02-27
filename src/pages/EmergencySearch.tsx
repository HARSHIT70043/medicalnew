// src/pages/EmergencySearch.tsx
import { useState, useEffect, useRef } from 'react';
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
  Hospital as HospitalIcon,
  Building2,
  Stethoscope,
  Scissors,
  Activity,
  Bed,
  Thermometer,
  Pill,
  Syringe,
  Timer,
  AlertTriangle,
  ChevronLeft,
  Droplet,
  TrendingUp,
  ChevronDown,
  Filter,
  Bot,
  X,
  MessageCircle,
  Activity as PulseIcon,
  Minimize2,
  Mic,
  Send
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix for Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
  lat?: number;
  lng?: number;
}

interface Location {
  lat: number;
  lng: number;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Premium Golden Hour Timer Component
const GoldenHourTimer = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate percentage remaining
  const percentageRemaining = (timeLeft / 3600) * 100;
  
  // Determine color based on urgency
  const getGradientColor = () => {
    if (percentageRemaining > 50) return 'from-green-500 to-green-600';
    if (percentageRemaining > 20) return 'from-yellow-500 to-amber-600';
    return 'from-red-500 to-rose-600';
  };

  const getGlowColor = () => {
    if (percentageRemaining > 50) return 'shadow-green-500/30';
    if (percentageRemaining > 20) return 'shadow-yellow-500/30';
    return 'shadow-red-500/30';
  };

  return (
    <div className="sticky top-14 z-80 w-full px-4 py-2 bg-gradient-to-b from-slate-50/80 to-transparent backdrop-blur-sm">
      {/* Desktop Version - Centered Pill */}
      <div className="hidden md:block max-w-2xl mx-auto top-0">
        <div className={`
          relative overflow-hidden
          bg-gradient-to-r ${getGradientColor()}
          rounded-2xl shadow-2xl ${getGlowColor()}
          border border-white/20
          transition-all duration-500
          animate-subtlePulse
        `}>
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-white/20 blur-xl opacity-50"></div>
          
          {/* Content */}
          <div className="relative px-6 py-4 flex items-center justify-between">
            {/* Left Section - Icon & Label */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <PulseIcon className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-medium text-white/80 tracking-wider">EMERGENCY</span>
                <p className="text-sm font-semibold text-white">Golden Hour Remaining</p>
              </div>
            </div>

            {/* Right Section - Timer */}
            <div className="flex items-center space-x-4">
              {/* Digital Timer */}
              <div className="text-right">
                <div className="text-3xl font-mono font-bold text-white tabular-nums">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-[10px] text-white/70 tracking-wider">TIME REMAINING</div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div 
              className="h-full bg-white transition-all duration-1000 ease-linear"
              style={{ width: `${percentageRemaining}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Version - Full Width Pill */}
      <div className="md:hidden">
        <div className={`
          relative overflow-hidden
          bg-gradient-to-r ${getGradientColor()}
          rounded-xl shadow-2xl ${getGlowColor()}
          border border-white/20
          transition-all duration-500
          animate-subtlePulse
        `}>
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-white/20 blur-xl opacity-50"></div>
          
          {/* Content */}
          <div className="relative p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PulseIcon className="w-5 h-5 text-white animate-pulse" />
                <span className="text-xs font-semibold text-white">Golden Hour</span>
              </div>
              <div className="text-xl font-mono font-bold text-white tabular-nums">
                {formatTime(timeLeft)}
              </div>
              <div className="text-[8px] text-white/70 tracking-wider">REMAINING</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Desktop Map Component with Leaflet
const DesktopMap = ({ 
  userLocation, 
  hospital, 
  onClose 
}: { 
  userLocation: Location | null; 
  hospital: Hospital | null;
  onClose: () => void;
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; time: string } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || !userLocation || !hospital) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView(
      [userLocation.lat, userLocation.lng], 
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add user marker
    const userMarker = L.marker([userLocation.lat, userLocation.lng])
      .bindPopup('Your Location')
      .addTo(map);

    // Generate hospital coordinates (slightly offset from user for demo)
    // In a real app, you would use actual hospital coordinates
    const hospitalLat = userLocation.lat + (Math.random() - 0.5) * 0.1;
    const hospitalLng = userLocation.lng + (Math.random() - 0.5) * 0.1;
    
    // Add hospital marker
    const hospitalMarker = L.marker([hospitalLat, hospitalLng])
      .bindPopup(hospital.name)
      .addTo(map);

    // Add routing between points
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation.lat, userLocation.lng),
        L.latLng(hospitalLat, hospitalLng)
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      lineOptions: {
        styles: [{ color: '#3b82f6', weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      }
    }).addTo(map);

    // Get route information
    routingControl.on('routesfound', function(e: any) {
      const routes = e.routes;
      if (routes && routes.length > 0) {
        const summary = routes[0].summary;
        const distance = (summary.totalDistance / 1000).toFixed(1);
        const time = Math.round(summary.totalTime / 60);
        setRouteInfo({ distance: `${distance} km`, time: `${time} min` });
      }
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [userLocation, hospital]);

  if (!hospital) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-90 flex items-center justify-center p-4 animate-fadeIn ">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-slideUp">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Directions to {hospital.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row h-[70vh]">
          {/* Left side - Hospital info */}
          <div className="w-full md:w-2/5 p-4 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto">
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">{hospital.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{hospital.address}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{hospital.distance} from your location</span>
              </div>
            </div>

            {routeInfo && (
              <div className="bg-green-50 rounded-xl p-4 mb-4 animate-fadeIn">
                <h4 className="font-medium text-gray-800 mb-2">Route Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Distance:</span>
                    <span className="font-semibold text-gray-800">{routeInfo.distance}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estimated Time:</span>
                    <span className="font-semibold text-gray-800">{routeInfo.time}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Bed className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <div className="text-sm font-bold text-gray-800">{hospital.bedsAvailable}/{hospital.totalBeds}</div>
                <div className="text-[10px] text-gray-500">Beds</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <Activity className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <div className="text-sm font-bold text-gray-800">{hospital.icuAvailable || 0}</div>
                <div className="text-[10px] text-gray-500">ICU</div>
              </div>
            </div>

            <div className="mt-4">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Right side - Map */}
          <div className="w-full md:w-3/5 h-[300px] md:h-full rounded-b-2xl md:rounded-r-2xl overflow-hidden">
            <div ref={mapContainerRef} className="w-full h-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Desktop AI Chatbot Component
const DesktopAIChatbot = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello, I'm your AI medical assistant. I can help you with emergency guidance, first aid information, and hospital recommendations. How can I assist you?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMedicalResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('concussion') || lowerQuery.includes('head injury')) {
      return "For a suspected concussion: Keep the person awake, apply cold pack, watch for vomiting or confusion. Seek emergency care immediately. RIMS Ranchi (2.1km) has neurology department available.";
    }
    
    if (lowerQuery.includes('bleed') || lowerQuery.includes('blood')) {
      return "To control bleeding: Apply firm pressure with clean cloth, elevate the area. If bleeding doesn't stop in 10 minutes, call emergency services (108). Santevita Hospital has emergency services available.";
    }
    
    if (lowerQuery.includes('heart') || lowerQuery.includes('chest pain')) {
      return "⚠️ CHEST PAIN: Call 108 immediately. Have them sit or lie down. If unconscious, start CPR. RIMS Ranchi has cardiology specialists available now with 8 ICU beds.";
    }
    
    return "I understand you need medical assistance. Please tell me more about the specific emergency (e.g., chest pain, bleeding, head injury).";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getMedicalResponse(inputMessage);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col max-h-[500px]">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold text-sm">AI Medical Assistant</span>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[350px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-2.5 rounded-xl ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-800 border border-gray-100'
              }`}
            >
              <p className="text-xs leading-relaxed">{message.text}</p>
              <p className="text-[8px] mt-1 opacity-60">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-100">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Describe symptoms..."
            className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Mobile AI Chatbot - Compact Floating Widget
const MobileAIChatbot = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello, I'm your AI medical assistant. I can help you with emergency guidance, first aid information, and hospital recommendations. How can I assist you?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getMedicalResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('concussion') || lowerQuery.includes('head injury')) {
      return "For a suspected concussion: Keep the person awake, apply cold pack, watch for vomiting or confusion. Seek emergency care immediately. RIMS Ranchi (2.1km) has neurology department available.";
    }
    
    if (lowerQuery.includes('bleed') || lowerQuery.includes('blood')) {
      return "To control bleeding: Apply firm pressure with clean cloth, elevate the area. If bleeding doesn't stop in 10 minutes, call emergency services (108). Santevita Hospital has emergency services available.";
    }
    
    if (lowerQuery.includes('heart') || lowerQuery.includes('chest pain')) {
      return "⚠️ CHEST PAIN: Call 108 immediately. Have them sit or lie down. If unconscious, start CPR. RIMS Ranchi has cardiology specialists available now with 8 ICU beds.";
    }
    
    return "I understand you need medical assistance. Please tell me more about the specific emergency.";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setUnreadCount(0);

    setTimeout(() => {
      const botResponse = getMedicalResponse(inputMessage);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    { label: "🚨 Emergency", query: "I need emergency help" },
    { label: "🩸 Bleeding", query: "how to stop bleeding" },
    { label: "❤️ Chest Pain", query: "chest pain" },
    { label: "🧠 Stroke", query: "stroke symptoms" },
    { label: "🤕 Head Injury", query: "concussion" },
    { label: "🏥 Hospitals", query: "hospitals near me" }
  ];

  // Floating button when minimized
  if (isMinimized) {
    return (
      <div className="fixed bottom-20 right-4 z-50 md:hidden">
        <button
          onClick={() => setIsMinimized(false)}
          className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 md:hidden"
        onClick={() => setIsMinimized(true)}
      />
      
      {/* Chat Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-slideUp">
        <div className="bg-white rounded-t-2xl shadow-2xl max-h-[60vh] flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-sm">AI Medical Assistant</h3>
                <p className="text-[10px] text-gray-500">Emergency guidance & hospital support</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Minimize2 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-2.5 rounded-xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-50 text-gray-800 border border-gray-100'
                  }`}
                >
                  <p className="text-xs leading-relaxed">{message.text}</p>
                  <p className="text-[8px] mt-1 opacity-60">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions - Horizontal Scroll */}
          <div className="px-3 py-2 overflow-x-auto border-t border-gray-100">
            <div className="flex gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputMessage(action.query);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full whitespace-nowrap transition-colors flex-shrink-0"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Describe symptoms..."
                className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

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
  const icuScore = Math.min(((hospital.icuAvailable || 0) / 10) * 100, 100);
  
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

// 20+ Hospitals in Ranchi
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
    bloodUnits: 25,
    icuAvailable: 8,
    occupancyRate: 50,
    doctorAvailability: 80,
    emergencyRoomWait: 15,
    bloodBankStock: 'high',
    admissionChance: 85,
    specialties: ["Cardiology", "Emergency", "Neurology", "General Medicine"],
    facilities: ["ICU", "Operation Theater", "Blood Bank", "Pharmacy", "Radiology"],
    estimatedArrival: "5 mins"
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
    bloodUnits: 15,
    icuAvailable: 3,
    occupancyRate: 71,
    doctorAvailability: 65,
    emergencyRoomWait: 10,
    bloodBankStock: 'medium',
    admissionChance: 62,
    specialties: ["Cardiology", "Orthopedics", "Pediatrics", "Emergency"],
    facilities: ["ICU", "Pharmacy", "Blood Bank", "X-Ray"],
    estimatedArrival: "12 mins"
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
    bloodUnits: 8,
    icuAvailable: 2,
    occupancyRate: 73,
    doctorAvailability: 70,
    emergencyRoomWait: 20,
    bloodBankStock: 'medium',
    admissionChance: 58,
    specialties: ["General Medicine", "Gynecology", "Pediatrics", "Emergency"],
    facilities: ["Pharmacy", "Laboratory", "Ultrasound"],
    estimatedArrival: "10 mins"
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
    bloodUnits: 12,
    icuAvailable: 1,
    occupancyRate: 85,
    doctorAvailability: 60,
    emergencyRoomWait: 18,
    bloodBankStock: 'low',
    admissionChance: 45,
    specialties: ["Emergency", "Cardiology", "Neurology", "Surgery"],
    facilities: ["ICU", "Operation Theater", "Pharmacy", "Radiology"],
    estimatedArrival: "8 mins"
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
    bloodUnits: 5,
    icuAvailable: 0,
    occupancyRate: 80,
    doctorAvailability: 75,
    emergencyRoomWait: 12,
    bloodBankStock: 'medium',
    admissionChance: 52,
    specialties: ["General Medicine", "Orthopedics", "Dental", "ENT"],
    facilities: ["Pharmacy", "Dental Clinic", "X-Ray"],
    estimatedArrival: "12 mins"
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
    bloodUnits: 30,
    icuAvailable: 12,
    occupancyRate: 81,
    doctorAvailability: 85,
    emergencyRoomWait: 12,
    bloodBankStock: 'high',
    admissionChance: 78,
    specialties: ["Emergency", "Cardiology", "Neurology", "Oncology", "Surgery"],
    facilities: ["ICU", "Operation Theater", "Pharmacy", "Blood Bank", "Radiology", "Research Center"],
    estimatedArrival: "7 mins"
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
    bloodUnits: 4,
    icuAvailable: 0,
    occupancyRate: 85,
    doctorAvailability: 55,
    emergencyRoomWait: 8,
    bloodBankStock: 'low',
    admissionChance: 38,
    specialties: ["General Medicine", "Pediatrics", "Gynecology"],
    facilities: ["Pharmacy", "Laboratory"],
    estimatedArrival: "15 mins"
  },
  {
    id: '8',
    name: "Sheetal Hospital",
    address: "Hindpiri, Ranchi, Jharkhand 834001",
    distance: "3.2 km",
    distanceValue: 3.2,
    rating: 4.0,
    phone: "+91 651 220 1234",
    emergency: true,
    open: true,
    waitTime: "15-20 min",
    bedsAvailable: 12,
    totalBeds: 40,
    bloodUnits: 10,
    icuAvailable: 4,
    occupancyRate: 70,
    doctorAvailability: 65,
    emergencyRoomWait: 15,
    bloodBankStock: 'medium',
    admissionChance: 62,
    specialties: ["General Medicine", "Gynecology", "Pediatrics"],
    facilities: ["ICU", "Pharmacy", "X-Ray"],
    estimatedArrival: "8 mins"
  },
  {
    id: '9',
    name: "Arya Hospital",
    address: "Lalpur, Ranchi, Jharkhand 834001",
    distance: "4.5 km",
    distanceValue: 4.5,
    rating: 4.1,
    phone: "+91 651 221 5678",
    emergency: true,
    open: true,
    waitTime: "10-15 min",
    bedsAvailable: 8,
    totalBeds: 30,
    bloodUnits: 6,
    icuAvailable: 2,
    occupancyRate: 73,
    doctorAvailability: 70,
    emergencyRoomWait: 12,
    bloodBankStock: 'medium',
    admissionChance: 58,
    specialties: ["Cardiology", "General Medicine", "Orthopedics"],
    facilities: ["ICU", "Pharmacy", "ECG"],
    estimatedArrival: "10 mins"
  },
  {
    id: '10',
    name: "Mahavir Netralaya",
    address: "Purulia Road, Ranchi, Jharkhand 834001",
    distance: "5.5 km",
    distanceValue: 5.5,
    rating: 4.5,
    phone: "+91 651 222 3456",
    emergency: false,
    open: true,
    waitTime: "5-10 min",
    bedsAvailable: 4,
    totalBeds: 15,
    bloodUnits: 2,
    icuAvailable: 0,
    occupancyRate: 73,
    doctorAvailability: 80,
    emergencyRoomWait: 5,
    bloodBankStock: 'low',
    admissionChance: 42,
    specialties: ["Ophthalmology", "General Medicine"],
    facilities: ["Pharmacy", "Eye Clinic", "Laser Center"],
    estimatedArrival: "12 mins"
  }
  
];

// Medical conditions for dropdown
const MEDICAL_CONDITIONS = [
  { value: 'heart-attack', label: 'Heart Attack', emergency: true, specialties: ['Cardiology'], priority: 1 },
  { value: 'stroke', label: 'Stroke', emergency: true, specialties: ['Neurology'], priority: 1 },
  { value: 'severe-bleeding', label: 'Severe Bleeding', emergency: true, specialties: ['Emergency', 'Surgery'], priority: 1 },
  { value: 'difficulty-breathing', label: 'Difficulty Breathing', emergency: true, specialties: ['Emergency', 'Pulmonology'], priority: 2 },
  { value: 'head-injury', label: 'Head Injury', emergency: true, specialties: ['Neurology', 'Emergency'], priority: 2 },
  { value: 'fracture', label: 'Fracture', emergency: false, specialties: ['Orthopedics'], priority: 3 },
  { value: 'burn', label: 'Burn Injury', emergency: true, specialties: ['Emergency', 'Surgery'], priority: 2 },
  { value: 'poisoning', label: 'Poisoning', emergency: true, specialties: ['Emergency', 'Toxicology'], priority: 1 },
  { value: 'seizure', label: 'Seizure', emergency: true, specialties: ['Neurology'], priority: 2 },
  { value: 'pregnancy', label: 'Pregnancy Emergency', emergency: true, specialties: ['Gynecology', 'Obstetrics'], priority: 2 },
  { value: 'general', label: 'General Emergency', emergency: true, specialties: ['Emergency', 'General Medicine'], priority: 3 },
];

export default function EmergencySearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'chance' | 'beds' | 'distance'>('chance');
  const [showDesktopChatbot, setShowDesktopChatbot] = useState(false);
  const [showMobileChatbot, setShowMobileChatbot] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [selectedHospitalForMap, setSelectedHospitalForMap] = useState<Hospital | null>(null);

  useEffect(() => {
    const state = location.state as any;
    if (state?.location) {
      setUserLocation(state.location);
    } else {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    }
    
    // Calculate admission chance for all hospitals
    const hospitalsWithChance = MOCK_HOSPITALS.map(h => ({
      ...h,
      admissionChance: calculateAdmissionChance(h)
    }));
    setHospitals(hospitalsWithChance);
  }, [location]);

  const handleSearch = () => {
    setLoading(true);
    setHasSearched(true);
    setShowTimer(true); // Start the timer when search is performed

    setTimeout(() => {
      let results = [...hospitals];

      // Filter by selected condition specialties
      if (selectedCondition) {
        results = results.filter(hospital => 
          hospital.specialties.some(s => selectedCondition.specialties.includes(s))
        );
      }

      // Filter by search query (combines with condition filter)
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim();
        results = results.filter(hospital =>
          hospital.name.toLowerCase().includes(query) ||
          hospital.address.toLowerCase().includes(query) ||
          hospital.specialties.some(s => s.toLowerCase().includes(query))
        );
      }

      // Apply sorting
      if (sortBy === 'chance') {
        results.sort((a, b) => (b.admissionChance || 0) - (a.admissionChance || 0));
      } else if (sortBy === 'beds') {
        results.sort((a, b) => b.bedsAvailable - a.bedsAvailable);
      } else if (sortBy === 'distance') {
        results.sort((a, b) => a.distanceValue - b.distanceValue);
      }

      setFilteredHospitals(results);
      setLoading(false);
    }, 800);
  };

  const selectCondition = (condition: any) => {
    setSelectedCondition(condition);
    setIsDropdownOpen(false);
  };

  const getChanceColor = (chance: number = 0) => {
    if (chance >= 70) return 'text-green-600 bg-green-100';
    if (chance >= 50) return 'text-yellow-600 bg-yellow-100';
    if (chance >= 30) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const toggleChatbot = () => {
    if (window.innerWidth < 768) {
      setShowMobileChatbot(!showMobileChatbot);
      if (showDesktopChatbot) setShowDesktopChatbot(false);
    } else {
      setShowDesktopChatbot(!showDesktopChatbot);
      if (showMobileChatbot) setShowMobileChatbot(false);
    }
  };

  const handleDirections = (hospital: Hospital) => {
    // For mobile, open Google Maps externally
    if (window.innerWidth < 768) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.name}`, '_blank');
    } else {
      // For desktop, show embedded map
      setSelectedHospitalForMap(hospital);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white font-sans pb-24 md:pb-6">
      {/* Desktop Map Modal */}
      {selectedHospitalForMap && (
        <DesktopMap
          userLocation={userLocation}
          hospital={selectedHospitalForMap}
          onClose={() => setSelectedHospitalForMap(null)}
        />
      )}

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            Emergency Hospital Finder
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto lg:mx-0">
            Find the nearest hospital for your emergency with real-time bed availability and golden hour tracking
          </p>
        </div>
      </div>

      {/* Golden Hour Timer - Shows after search */}
      {showTimer && <GoldenHourTimer />}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
          {/* Emergency Type Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Type
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 text-left text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all flex items-center justify-between"
              >
                <span className={selectedCondition ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedCondition ? selectedCondition.label : 'Select emergency type...'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  <div className="py-1">
                    {MEDICAL_CONDITIONS.map((condition) => (
                      <button
                        key={condition.value}
                        onClick={() => selectCondition(condition)}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 transition-colors flex items-center justify-between ${
                          selectedCondition?.value === condition.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                        }`}
                      >
                        <span>{condition.label}</span>
                        {condition.emergency && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">🚨 Emergency</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Hospital or Specialty
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., Cardiology, RIMS..."
                className="w-full pl-9 pr-4 py-3 text-sm bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Sort by:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSortBy('chance')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  sortBy === 'chance'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Chance
              </button>
              <button
                onClick={() => setSortBy('beds')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  sortBy === 'beds'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bed className="w-3 h-3 inline mr-1" />
                Beds
              </button>
              <button
                onClick={() => setSortBy('distance')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  sortBy === 'distance'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <MapPin className="w-3 h-3 inline mr-1" />
                Distance
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleSearch}
            disabled={loading || !selectedCondition}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Finding Hospitals...</span>
              </>
            ) : (
              <>
                <Ambulance className="w-4 h-4" />
                <span>Find Emergency Hospitals</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Section Divider */}
        {hasSearched && (
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-xs font-medium text-gray-500">RESULTS</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
        )}

        {/* Results Section */}
        {hasSearched && (
          <>
            {filteredHospitals.length > 0 ? (
              <div>
                {/* Results count */}
                <div className="mb-4 text-sm text-gray-600">
                  Found <span className="font-semibold text-blue-600">{filteredHospitals.length}</span> hospitals
                  {selectedCondition && ` for ${selectedCondition.label}`}
                  {searchQuery && ` matching "${searchQuery}"`}
                </div>

                {/* Hospital Cards - Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredHospitals.map((hospital) => (
                    <div
                      key={hospital.id}
                      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 border ${
                        selectedHospitalForMap?.id === hospital.id 
                          ? 'border-blue-500 ring-2 ring-blue-200' 
                          : 'border-gray-200'
                      }`}
                    >
                      {/* Header with Chance Badge */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 line-clamp-1">{hospital.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span>{hospital.distance}</span>
                            <span>•</span>
                            <span>⭐ {hospital.rating}</span>
                            <span>•</span>
                            <span>⏱️ {hospital.estimatedArrival}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {hospital.emergency && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-medium rounded-full">
                              24/7
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getChanceColor(hospital.admissionChance)}`}>
                            {hospital.admissionChance}% Chance
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{hospital.address}</p>

                      {/* Resources */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <div className="text-[10px] font-medium text-blue-600">BEDS</div>
                          <div className="text-sm font-semibold text-gray-800">{hospital.bedsAvailable}/{hospital.totalBeds}</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2 text-center">
                          <div className="text-[10px] font-medium text-purple-600">ICU</div>
                          <div className="text-sm font-semibold text-gray-800">{hospital.icuAvailable || 0}</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 text-center">
                          <div className="text-[10px] font-medium text-red-600">BLOOD</div>
                          <div className="text-sm font-semibold text-red-600">{hospital.bloodUnits || 0}U</div>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {hospital.specialties.slice(0, 3).map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                            {s}
                          </span>
                        ))}
                        {hospital.specialties.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                            +{hospital.specialties.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => handleDirections(hospital)}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-medium text-center hover:bg-blue-700 transition-colors"
                        >
                          Directions
                        </button>
                        <a
                          href={`tel:${hospital.phone}`}
                          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition-colors"
                        >
                          Call
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No hospitals found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search or selecting a different condition</p>
              </div>
            )}
          </>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className="text-center py-12 bg-white/50 rounded-xl border border-dashed border-gray-200">
            <Ambulance className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Select an emergency type to begin</p>
          </div>
        )}
      </div>

      {/* AI Chatbot Icon - Single button for both platforms */}
      <button
        onClick={toggleChatbot}
        className="fixed bottom-24 right-4 md:bottom-6 md:right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Desktop AI Chatbot */}
      {showDesktopChatbot && <DesktopAIChatbot onClose={() => setShowDesktopChatbot(false)} />}

      {/* Mobile AI Chatbot */}
      {showMobileChatbot && <MobileAIChatbot onClose={() => setShowMobileChatbot(false)} />}

      {/* Custom Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        .font-sans { font-family: 'Inter', sans-serif; }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes subtlePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.98; transform: scale(1.01); }
        }
        
        .animate-subtlePulse {
          animation: subtlePulse 2s ease-in-out infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        .delay-100 {
          animation-delay: 100ms;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
        
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