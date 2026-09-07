import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  Search,
  Bell,
  User,
  Shield,
  Ticket,
  Award,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useCurrency } from '../../context/CurrencyContext';

export default function Navbar({
  activeView,
  setActiveView,
  onOpenSearch,
  onOpenAuth
}) {
  const { user, switchRole, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const { currency, setCurrency, allCurrencies } = useCurrency();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categoriesRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setShowCategoriesMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categoryLinks = [
    { id: 'transport', label: 'Transport', icon: '✈️', desc: 'Flights, Bullet Trains, Cabs' },
    { id: 'entertainment', label: 'Entertainment', icon: '🍿', desc: 'IMAX Cinema, Concerts' },
    { id: 'sports', label: 'Sports', icon: '⚽', desc: 'FIFA Turfs, Pools, Arenas' },
    { id: 'hotel', label: 'Hotels & Villas', icon: '🏨', desc: 'Cliffside Villas, Luxury Resorts' },
    { id: 'restaurant', label: 'Dining & Lounges', icon: '🍽️', desc: 'Skyline Rooftops, Fine Dining' },
  ];

  const handleSwitchToAdmin = () => {
    switchRole('admin');
    setActiveView('admin');
  };

  const handleSwitchToCustomer = () => {
    switchRole('user');
    if (activeView === 'admin') {
      setActiveView('home');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#D8C7AD] shadow-sm py-3 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo: 100% Bold High Contrast Black & Terracotta */}
        <div
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#B86B4B] to-[#C9A96E] p-0.5 shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#FAF8F3] rounded-[10px] flex items-center justify-center">
              <Compass className="w-4 h-4 text-[#B86B4B] group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-[#171513] flex items-center gap-1 font-serif">
              BOOK<span className="text-[#B86B4B] font-serif">SPHERE</span>
            </span>
            <span className="block text-[8px] uppercase tracking-[0.25em] text-[#786F62] font-bold -mt-1">
              Luxury Reservations
            </span>
          </div>
        </div>

        {/* Streamlined Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-[#FAF8F3] border border-[#DDD3C4] px-2 py-1 rounded-full shadow-inner">
          {/* Home */}
          <button
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeView === 'home'
                ? 'text-[#171513] bg-white border border-[#B86B4B]/40 shadow-sm'
                : 'text-[#4A443B] hover:text-[#171513] hover:bg-white/70'
            }`}
          >
            Home
          </button>

          {/* Categories Dropdown */}
          <div className="relative" ref={categoriesRef}>
            <button
              onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#4A443B] hover:text-[#171513] hover:bg-white/70 transition-all"
            >
              <span>Categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCategoriesMenu ? 'rotate-180 text-[#B86B4B]' : 'text-[#786F62]'}`} />
            </button>

            {showCategoriesMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-[#DDD3C4] shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-[10px] uppercase font-bold text-[#786F62] px-3 py-1.5 border-b border-[#E8DFD1] mb-1 tracking-wider">
                  15 Verticals • Unified Catalog
                </div>
                {categoryLinks.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setShowCategoriesMenu(false);
                      setActiveView(cat.id);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-[#FAF8F3] transition-colors group"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-[#171513] group-hover:text-[#B86B4B] transition-colors">
                        {cat.label}
                      </div>
                      <div className="text-[10px] text-[#786F62] leading-tight">
                        {cat.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* My Bookings */}
          <button
            onClick={() => setActiveView('my-bookings')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all relative flex items-center gap-1.5 ${
              activeView === 'my-bookings'
                ? 'text-[#171513] bg-white border border-[#B86B4B]/40 shadow-sm'
                : 'text-[#4A443B] hover:text-[#171513] hover:bg-white/70'
            }`}
          >
            <span>My Bookings</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#B86B4B]/15 text-[#B86B4B] font-bold border border-[#B86B4B]/30">
              Live
            </span>
          </button>

          {/* Admin Command Center Tab */}
          {(user?.role === 'super_admin' || user?.role === 'admin' || activeView === 'admin') && (
            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeView === 'admin'
                  ? 'bg-[#243B35] text-white shadow-sm'
                  : 'text-[#243B35] hover:bg-[#243B35]/10'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>Admin Hub</span>
            </button>
          )}
        </div>

        {/* Right Section Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center bg-[#FAF8F3] border border-[#DDD3C4] rounded-xl px-2.5 py-1.5 text-xs shadow-sm">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-[#171513] outline-none cursor-pointer font-bold text-xs"
            >
              {allCurrencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-white text-[#171513]">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search Icon */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-[#171513] bg-[#FAF8F3] hover:bg-[#F0EAE1] hover:text-[#B86B4B] transition-colors border border-[#DDD3C4] shadow-sm"
            title="Search Catalog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Reward Points Pill */}
          {user && (
            <div
              onClick={() => setActiveView('my-bookings')}
              className="hidden sm:flex items-center gap-1.5 bg-[#FFF9EE] border border-[#ECC87B] px-3 py-1.5 rounded-full text-xs cursor-pointer hover:border-[#D4A017] transition-all shadow-sm"
              title="Reward Points Balance"
            >
              <Award className="w-3.5 h-3.5 text-[#B86B4B]" />
              <span className="font-bold text-[#9E6D0E]">{user.rewardPoints}</span>
              <span className="text-[10px] text-[#B86B4B] font-bold">pts</span>
            </div>
          )}

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-xl text-[#171513] bg-[#FAF8F3] hover:bg-[#F0EAE1] transition-colors border border-[#DDD3C4] shadow-sm relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B86B4B] text-[10px] font-bold text-white flex items-center justify-center shadow-terracotta">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifs && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl border border-[#DDD3C4] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-[#E8DFD1] pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#B86B4B]" />
                    <span className="text-sm font-bold text-[#171513] font-serif">Notifications</span>
                  </div>
                  <span className="text-xs text-[#786F62]">{unreadCount} unread</span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-[#786F62]">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.is_read
                            ? 'bg-[#FAF8F3] border-[#E8DFD1] text-[#786F62]'
                            : 'bg-[#FFF9EE] border-[#ECC87B] text-[#171513]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-[#171513]">{n.title}</span>
                          {!n.is_read && (
                            <span className="w-2 h-2 rounded-full bg-[#B86B4B] mt-1 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-[#5C554B] mt-1 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Role Switcher Pill */}
          <div className="flex items-center bg-[#FAF8F3] border border-[#DDD3C4] rounded-full p-0.5 text-[11px] shadow-sm">
            <button
              onClick={handleSwitchToCustomer}
              className={`px-3 py-1 rounded-full transition-all font-bold ${
                user?.role === 'user' && activeView !== 'admin'
                  ? 'bg-[#B86B4B] text-white shadow-terracotta'
                  : 'text-[#5C554B] hover:text-[#171513]'
              }`}
            >
              Customer
            </button>
            <button
              onClick={handleSwitchToAdmin}
              className={`px-3 py-1 rounded-full transition-all font-bold ${
                (user?.role === 'super_admin' || user?.role === 'admin') && activeView === 'admin'
                  ? 'bg-[#243B35] text-white shadow-sm'
                  : 'text-[#5C554B] hover:text-[#171513]'
              }`}
            >
              Admin
            </button>
          </div>

          {/* User Profile / Auth Toggle */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#FAF8F3] transition-colors border border-[#DDD3C4]"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-lg object-cover border border-[#B86B4B]"
                />
                <span className="hidden sm:inline text-xs font-bold text-[#171513] max-w-[90px] truncate">
                  {user.fullName.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl border border-[#DDD3C4] shadow-2xl p-3 z-50">
                  <div className="border-b border-[#E8DFD1] pb-2 mb-2">
                    <div className="font-bold text-[#171513] text-xs truncate">{user.fullName}</div>
                    <div className="text-[10px] text-[#786F62] truncate">{user.email}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFF9EE] text-[#9E6D0E] text-[10px] font-bold border border-[#ECC87B]">
                      <Sparkles className="w-2.5 h-2.5 text-[#B86B4B]" />
                      {user.membership?.tierName || 'Basic Explorer'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('my-bookings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#171513] hover:bg-[#FAF8F3] transition-colors"
                  >
                    <Ticket className="w-3.5 h-3.5 text-[#B86B4B]" />
                    My Bookings
                  </button>

                  <button
                    onClick={() => {
                      if (user.role === 'admin' || user.role === 'super_admin') {
                        handleSwitchToCustomer();
                      } else {
                        handleSwitchToAdmin();
                      }
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#171513] hover:bg-[#FAF8F3] transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#C9A96E]" />
                    Toggle Persona ({user.role === 'user' ? 'Switch to Admin' : 'Switch to Customer'})
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-colors mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-primary px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-terracotta"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#171513] hover:bg-[#FAF8F3] border border-[#DDD3C4]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#D8C7AD] px-4 pt-3 pb-6 mt-3 animate-in slide-in-from-top-4 shadow-xl">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                activeView === 'home' ? 'bg-[#B86B4B] text-white shadow-sm' : 'text-[#171513] hover:bg-[#FAF8F3]'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveView('my-bookings');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                activeView === 'my-bookings' ? 'bg-[#B86B4B] text-white shadow-sm' : 'text-[#171513] hover:bg-[#FAF8F3]'
              }`}
            >
              My Bookings
            </button>
            {categoryLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                  activeView === item.id ? 'bg-[#B86B4B] text-white' : 'text-[#171513] hover:bg-[#FAF8F3]'
                }`}
              >
                {item.icon} {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                handleSwitchToAdmin();
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all col-span-2 ${
                activeView === 'admin' ? 'bg-[#243B35] text-white' : 'text-[#243B35] bg-[#243B35]/10'
              }`}
            >
              🛡️ Admin Management & Analytics
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E8DFD1] flex items-center justify-between">
            <span className="text-xs font-bold text-[#786F62]">Demo Persona:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleSwitchToCustomer();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1 rounded-lg bg-[#B86B4B] text-white text-xs font-bold shadow-sm"
              >
                Customer
              </button>
              <button
                onClick={() => {
                  handleSwitchToAdmin();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1 rounded-lg bg-[#243B35] text-white text-xs font-bold shadow-sm"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
