// src/pages/Home.tsx
import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  MapPin, 
  Brain, 
  FileText, 
  Ambulance,
  Bell,
  User,
  Search,
  ChevronRight,
  Clock,
  Phone,
  Video,
  Shield
} from 'lucide-react';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');

  const findHospitals = () => {
    setIsLoading(true);
    // Simulate hospital search
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-red-500" fill="#ef4444" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HealthConnect
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Services</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Contact</a>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-md">
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Health,{' '}
                <span className="text-yellow-300">Our Priority</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8">
                Connect with healthcare services instantly. Find hospitals, track medical history, 
                and get AI-powered health assistance - all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 shadow-lg">
                  <Video className="w-5 h-5" />
                  <span>Consult Now</span>
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>Emergency</span>
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Healthcare professionals"
                  className="rounded-2xl shadow-2xl relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: MapPin, label: 'Find Hospitals', color: 'bg-blue-500', active: true },
            { icon: Activity, label: 'Live Dashboard', color: 'bg-green-500', active: true },
            { icon: FileText, label: 'Medical History', color: 'bg-purple-500', active: true },
            { icon: Brain, label: 'AI Assistant', color: 'bg-orange-500', active: true }
          ].map((item, index) => (
            <button
              key={index}
              className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 p-6"
            >
              <div className={`absolute top-0 right-0 w-20 h-20 ${item.color} rounded-full filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 text-white`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800">{item.label}</h3>
              <p className="text-sm text-gray-500 mt-1">Click to access</p>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Hospitals Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <MapPin className="w-6 h-6 text-red-500 mr-2" />
              Nearby Hospitals
            </h2>
            <p className="text-gray-600 mt-1">Find medical facilities around your current location</p>
          </div>
          <div className="flex space-x-4">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your location"
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              onClick={findHospitals}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Find Hospitals</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hospital Cards */}
        {!isLoading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No hospitals loaded</h3>
              <p className="text-gray-600 max-w-md">
                Click the "Find Hospitals" button to search for medical facilities near your current location.
              </p>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose HealthConnect?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive healthcare solutions to make your medical journey seamless and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: '24/7 Access',
                description: 'Round-the-clock access to healthcare services and emergency support.',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: Shield,
                title: 'Secure Records',
                description: 'Your medical history is encrypted and stored securely with privacy first approach.',
                color: 'bg-green-100 text-green-600'
              },
              {
                icon: Ambulance,
                title: 'Emergency Response',
                description: 'Quick emergency response with live tracking and instant ambulance booking.',
                color: 'bg-red-100 text-red-600'
              }
            ].map((feature, index) => (
              <div key={index} className="group hover:shadow-xl transition-all p-6 rounded-2xl">
                <div className={`${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to take control of your health?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust HealthConnect for their healthcare needs.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2 text-lg shadow-xl">
            <span>Get Started Now</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;