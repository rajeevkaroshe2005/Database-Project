import React, { useState } from 'react';
import {
  Search,
  Plane,
  Film,
  Trophy,
  Building,
  Utensils,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  Clock,
  ChevronDown
} from 'lucide-react';

export default function FloatingSearchBar({ onSearchSubmit }) {
  const [activeTab, setActiveTab] = useState('TRANSPORT');

  // Search filter states
  const [transportMode, setTransportMode] = useState('all');
  const [fromCity, setFromCity] = useState('Mumbai');
  const [toCity, setToCity] = useState('Bengaluru');
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
  const [guestCount, setGuestCount] = useState(2);
  const [sportType, setSportType] = useState('turf');
  const [movieQuery, setMovieQuery] = useState('');
  const [timeSlot, setTimeSlot] = useState('07:00 PM');

  const tabs = [
    { id: 'TRANSPORT', label: 'Transport', icon: Plane },
    { id: 'ENTERTAINMENT', label: 'Entertainment', icon: Film },
    { id: 'SPORTS', label: 'Sports & Turf', icon: Trophy },
    { id: 'HOTEL', label: 'Hotels & Villas', icon: Building },
    { id: 'RESTAURANT', label: 'Dining & Bistros', icon: Utensils },
    { id: 'EXPERIENCE', label: 'Experiences', icon: Sparkles },
  ];

  const indianCities = [
    'Mumbai',
    'Pune',
    'Bengaluru',
    'Delhi NCR',
    'Goa',
    'Hyderabad',
    'Chennai'
  ];

  const handleSearch = (e) => {
    e?.preventDefault();
    onSearchSubmit({
      type: activeTab,
      city: activeTab === 'TRANSPORT' ? fromCity : selectedCity,
      toCity: activeTab === 'TRANSPORT' ? toCity : undefined,
      transportMode,
      date: searchDate,
      guests: guestCount,
      sportType,
      keyword: movieQuery
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto glass-panel rounded-2xl p-4 sm:p-6 border border-white/10 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl transition-all">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none border-b border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Search Fields per Category */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
        {/* TRANSPORT TAB FIELDS */}
        {activeTab === 'TRANSPORT' && (
          <>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-cyan-400" />
                From Location
              </label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-cyan-400"
              >
                {indianCities.map((c) => (
                  <option key={c} value={c} className="bg-space-900 text-white">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-purple-400" />
                To Destination
              </label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-cyan-400"
              >
                {indianCities.map((c) => (
                  <option key={c} value={c} className="bg-space-900 text-white">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-cyan-400" />
                Departure Date
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </>
        )}

        {/* ENTERTAINMENT TAB FIELDS */}
        {activeTab === 'ENTERTAINMENT' && (
          <>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Film className="w-3 h-3 text-cyan-400" />
                Movie / Event
              </label>
              <input
                type="text"
                placeholder="Oppenheimer, Zakir Khan, Martin Garrix..."
                value={movieQuery}
                onChange={(e) => setMovieQuery(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-cyan-400" />
                City / Arena
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
              >
                {indianCities.map((c) => (
                  <option key={c} value={c} className="bg-space-900 text-white">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-cyan-400" />
                Show Date
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
          </>
        )}

        {/* SPORTS TAB FIELDS */}
        {activeTab === 'SPORTS' && (
          <>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Trophy className="w-3 h-3 text-cyan-400" />
                Sport Type
              </label>
              <select
                value={sportType}
                onChange={(e) => setSportType(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
              >
                <option value="turf" className="bg-space-900 text-white">Football / Box Turf</option>
                <option value="pool" className="bg-space-900 text-white">Olympic Swimming Pool</option>
                <option value="court" className="bg-space-900 text-white">Badminton / Tennis Court</option>
                <option value="ground" className="bg-space-900 text-white">Cricket Ground</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-cyan-400" />
                City / Complex
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
              >
                {indianCities.map((c) => (
                  <option key={c} value={c} className="bg-space-900 text-white">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-cyan-400" />
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
              >
                <option value="06:00 AM" className="bg-space-900 text-white">06:00 AM - 07:00 AM</option>
                <option value="07:00 PM" className="bg-space-900 text-white">07:00 PM - 08:00 PM</option>
                <option value="08:00 PM" className="bg-space-900 text-white">08:00 PM - 09:00 PM</option>
                <option value="09:00 PM" className="bg-space-900 text-white">09:00 PM - 10:00 PM</option>
              </select>
            </div>
          </>
        )}

        {/* HOTEL & RESTAURANT TAB FIELDS */}
        {(activeTab === 'HOTEL' || activeTab === 'RESTAURANT' || activeTab === 'EXPERIENCE') && (
          <>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-cyan-400" />
                Destination / City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
              >
                {indianCities.map((c) => (
                  <option key={c} value={c} className="bg-space-900 text-white">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-cyan-400" />
                {activeTab === 'HOTEL' ? 'Check-in Date' : 'Reservation Date'}
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-cyan-400" />
                Guests / Party Size
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                className="w-full glass-input rounded-xl px-3 py-2 text-xs font-medium"
              >
                <option value={1} className="bg-space-900 text-white">1 Guest</option>
                <option value={2} className="bg-space-900 text-white">2 Guests</option>
                <option value={4} className="bg-space-900 text-white">4 Guests (Booth / Table)</option>
                <option value={6} className="bg-space-900 text-white">6+ Guests (Family / Group)</option>
              </select>
            </div>
          </>
        )}

        {/* Action Button */}
        <div>
          <button
            type="submit"
            className="w-full glow-button py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-glow-cyan"
          >
            <Search className="w-4 h-4" />
            <span>Search Experiences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
