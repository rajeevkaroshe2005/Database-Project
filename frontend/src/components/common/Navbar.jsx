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
  CheckCircle2,
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-space-950/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-3 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-glow-cyan group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-space-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
              BOOK<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">SPHERE</span>
            </span>
            <span className="block text-[8px] uppercase tracking-widest text-slate-400 font-medium -mt-1">
              Online Reservations
            </span>
          </div>
        </div>

        {/* Streamlined Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1 bg-space-900/80 border border-white/10 px-2 py-1 rounded-full backdrop-blur-md">
          {/* Home */}
          <button
            onClick={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeView === 'home'
                ? 'text-white bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </button>

          {/* Categories Dropdown */}
          <div className="relative" ref={categoriesRef}>
            <button
              onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              <span>Categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCategoriesMenu ? 'rotate-180 text-cyan-400' : ''}`} />
            </button>

            {showCategoriesMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 glass-panel rounded-2xl border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1.5 border-b border-white/10 mb-1">
                  15 Verticals • Unified Catalog
                </div>
                {categoryLinks.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setShowCategoriesMenu(false);
                      setActiveView(cat.id);
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-white/10 transition-colors group"
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {cat.label}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">
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
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all relative flex items-center gap-1.5 ${
              activeView === 'my-bookings'
                ? 'text-white bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 shadow-glow-cyan'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>My Bookings</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/40">
              Live
            </span>
          </button>

          {/* Admin Command Center Tab */}
          {(user?.role === 'super_admin' || user?.role === 'admin' || activeView === 'admin') && (
            <button
              onClick={() => setActiveView('admin')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeView === 'admin'
                  ? 'bg-purple-600/40 text-purple-200 border border-purple-500/50 shadow-glow-purple'
                  : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin Hub</span>
            </button>
          )}
        </div>

        {/* Right Section Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Switcher */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-2 py-1 text-xs">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-transparent text-slate-200 outline-none cursor-pointer font-bold text-xs"
            >
              {allCurrencies.map((c) => (
                <option key={c.code} value={c.code} className="bg-space-900 text-white">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search Icon */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
            title="Search Catalog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Reward Points Pill */}
          {user && (
            <div
              onClick={() => setActiveView('my-bookings')}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-purple-500/15 border border-amber-500/30 px-3 py-1.5 rounded-full text-xs cursor-pointer hover:border-amber-400/60 transition-all"
              title="Reward Points Balance"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-amber-300">{user.rewardPoints}</span>
              <span className="text-[10px] text-amber-400/80 font-medium">pts</span>
            </div>
          )}

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/5 relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[10px] font-bold text-space-950 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotifs && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel rounded-2xl border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-bold text-white">Notifications</span>
                  </div>
                  <span className="text-xs text-slate-400">{unreadCount} unread</span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markAsRead(n.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                          n.is_read
                            ? 'bg-white/5 border-white/5 text-slate-400'
                            : 'bg-cyan-950/30 border-cyan-500/30 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-white">{n.title}</span>
                          {!n.is_read && (
                            <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
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
          <div className="flex items-center bg-space-900/90 border border-white/15 rounded-full p-0.5 text-[11px] shadow-sm">
            <button
              onClick={handleSwitchToCustomer}
              className={`px-3 py-1 rounded-full transition-all font-semibold ${
                user?.role === 'user' && activeView !== 'admin'
                  ? 'bg-cyan-500 text-space-950 font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Customer
            </button>
            <button
              onClick={handleSwitchToAdmin}
              className={`px-3 py-1 rounded-full transition-all font-semibold ${
                (user?.role === 'super_admin' || user?.role === 'admin') && activeView === 'admin'
                  ? 'bg-purple-600 text-white font-bold shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
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
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors border border-white/5"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-lg object-cover border border-cyan-500/40"
                />
                <span className="hidden sm:inline text-xs font-medium text-white max-w-[90px] truncate">
                  {user.fullName.split(' ')[0]}
                </span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl border border-white/10 shadow-2xl p-3 z-50">
                  <div className="border-b border-white/10 pb-2 mb-2">
                    <div className="font-semibold text-white text-xs truncate">{user.fullName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-semibold">
                      <Sparkles className="w-2.5 h-2.5" />
                      {user.membership?.tierName || 'Basic'}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('my-bookings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Ticket className="w-3.5 h-3.5 text-cyan-400" />
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
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    Toggle Demo Role ({user.role === 'user' ? 'Switch to Admin' : 'Switch to Customer'})
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-950/30 transition-colors mt-1"
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
              className="glow-button px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white shadow-glow-cyan"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-6 mt-3 animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                activeView === 'home' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setActiveView('my-bookings');
                setMobileMenuOpen(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                activeView === 'my-bookings' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-300 hover:bg-white/5'
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
                className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all ${
                  activeView === item.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-300 hover:bg-white/5'
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
                activeView === 'admin' ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'text-purple-300 bg-purple-950/20 hover:bg-purple-950/40'
              }`}
            >
              🛡️ Admin Management & Analytics
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">Demo Persona:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleSwitchToCustomer();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-medium"
              >
                Customer
              </button>
              <button
                onClick={() => {
                  handleSwitchToAdmin();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-medium"
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
