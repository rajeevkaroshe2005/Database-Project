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
  Clock
} from 'lucide-react';

export default function FloatingSearchBar({ onSearchSubmit }) {
  const [activeTab, setActiveTab] = useState('TRANSPORT');

  const [transportMode, setTransportMode] = useState('all');
  const [fromCity, setFromCity] = useState('Mumbai');
  const [toCity, setToCity] = useState('Bengaluru');
  const [selectedCity, setSelectedCity] = useState('All Cities');
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

  const destinationCities = [
    'All Cities',
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
      city: activeTab === 'TRANSPORT' ? fromCity : (selectedCity === 'All Cities' ? 'All' : selectedCity),
      toCity: activeTab === 'TRANSPORT' ? toCity : undefined,
      transportMode,
      date: searchDate,
      guests: guestCount,
      sportType,
      keyword: movieQuery.trim()
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl p-4 sm:p-6 border border-[#D4C8B8] shadow-xl">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none border-b border-[#E8DFD1]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#B86B4B] text-white shadow-terracotta'
                  : 'text-[#38342F] hover:text-[#171513] hover:bg-[#FAF8F3]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#B86B4B]'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Search Fields per Category */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end">
        {/* TRANSPORT TAB FIELDS */}
        {activeTab === 'TRANSPORT' && (
          <>
            <div>
              <label className="block text-xs font-bold text-[#171513] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B86B4B]" />
                From Location
              </label>
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#D4C8B8] text-[#171513] font-semibold rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#B86B4B] focus:border-[#B86B4B] outline-none"
              >
                {indianCities.map((c) => (
                  <option key={c} value={c} className="bg-white text-[#171513]">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171513] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B86B4B]" />
                To Destination
              </label>
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#D4C8B8] text-[#171513] font-semibold rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#B86B4B] focus:border-[#B86B4B] outline-none"
              >
                {indianCities.map((c) => (
                  <option key={c} value={c} className="bg-white text-[#171513]">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171513] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B86B4B]" />
                Departure Date
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#D4C8B8] text-[#171513] font-semibold rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#B86B4B] focus:border-[#B86B4B] outline-none"
              />
            </div>
          </>
        )}

        {/* ENTERTAINMENT TAB FIELDS */}
        {activeTab === 'ENTERTAINMENT' && (
          <>
            <div>
              <label className="block text-xs font-bold text-[#171513] mb-1.5 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-[#B86B4B]" />
                Movie / Event
              </label>
              <input
                type="text"
                placeholder="Oppenheimer, Zakir Khan, Martin Garrix..."
                value={movieQuery}
                onChange={(e) => setMovieQuery(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#D4C8B8] text-[#171513] font-semibold rounded-xl px-3 py-2 text-xs placeholder:text-[#8C8275] focus:ring-1 focus:ring-[#B86B4B] focus:border-[#B86B4B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171513] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B86B4B]" />
                City / Arena
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#D4C8B8] text-[#171513] font-semibold rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#B86B4B] focus:border-[#B86B4B] outline-none"
              >
                {destinationCities.map((c) => (
                  <option key={c} value={c} className="bg-white text-[#171513]">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171513] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B86B4B]" />
                Show Date
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#D4C8B8] text-[#171513] font-semibold rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#B86B4B] focus:border-[#B86B4B] outline-none"
              />
            </div>
          </>
        )}

        {/* SPORTS TAB FIELDS */}
        {activeTab === 'SPORTS' && (
          <>
            <div>
              <label className="block text-xs font-bold text-[#171513] mb-1.5 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#B86B4B]" />
                Sport Type
              </label>
              <select
                value={sportType}
                onChange={(e) => setSportType(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#D4C8B8] text-[#171513] font-semibold rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#B86B4B] focus:border-[#B86B4B] outline-none"
              >
                <option value="turf" className="bg-white text-[#171513]">Football / Box Turf</option>
                <option value="pool" className="bg-white text-[#171513]">Olympic Swimming Pool</option>
                <option value="court" className="bg-white text-[#171513]">Badminton / Tennis Court</option>
                <option value="ground" className="bg-white text-[#171513]">Cricket Ground</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171513] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B86B4B]" />
                City / Complex
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#D4C8B8] text-[#171513] font-semibold rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#B86B4B] focus:border-[#B86B4B] outline-none"
              >
                {destinationCities.map((c) => (
                  <option key={c} value={c} className="bg-white text-[#171513]">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171513] mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B86B4B]" />
                Time Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#D4C8B8] text-[#171513] font-semibold rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#B86B4B] focus:border-[#B86B4B] outline-none"
              >
                <option value="06:00 AM" className="bg-white text-[#171513]">06:00 AM - 07:00 AM</option>
                <option value="07:00 PM" className="bg-white text-[#171513]">07:00 PM - 08:00 PM</option>
                <option value="08:00 PM" className="bg-white text-[#171513]">08:00 PM - 09:00 PM</option>
                <option value="09:00 PM" className="bg-white text-[#171513]">09:00 PM - 10:00 PM</option>
              </select>
            </div>
          </>
        )}

        {/* HOTEL & RESTAURANT TAB FIELDS */}
        {(activeTab === 'HOTEL' || activeTab === 'RESTAURANT' || activeTab === 'EXPERIENCE') && (
          <>
            <div>
              <label className="block text-xs font-bold text-[#171513] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B86B4B]" />
                Destination / City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#D4C8B8] text-[#171513] font-semibold rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#B86B4B] focus:border-[#B86B4B] outline-none"
              >
                {destinationCities.map((c) => (
                  <option key={c} value={c} className="bg-white text-[#171513]">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171513] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B86B4B]" />
                {activeTab === 'HOTEL' ? 'Check-in Date' : 'Reservation Date'}
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full bg-[#FAF8F3] border border-[#D4C8B8] text-[#171513] font-semibold rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#B86B4B] focus:border-[#B86B4B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171513] mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#B86B4B]" />
                Guests / Party Size
              </label>
              <select
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                className="w-full bg-[#FAF8F3] border border-[#D4C8B8] text-[#171513] font-semibold rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-[#B86B4B] focus:border-[#B86B4B] outline-none"
              >
                <option value={1} className="bg-white text-[#171513]">1 Guest</option>
                <option value={2} className="bg-white text-[#171513]">2 Guests</option>
                <option value={4} className="bg-white text-[#171513]">4 Guests (Booth / Table)</option>
                <option value={6} className="bg-white text-[#171513]">6+ Guests (Family / Group)</option>
              </select>
            </div>
          </>
        )}

        {/* Action Button */}
        <div>
          <button
            type="submit"
            className="w-full btn-primary py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-terracotta"
          >
            <Search className="w-4 h-4" />
            <span>Search Experiences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
