import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HeroSection from './components/home/HeroSection';
import CategoryCards from './components/home/CategoryCards';
import DiscoverExperiences from './components/home/DiscoverExperiences';
import Service3DViewer from './components/3d/Service3DViewer';
import ServiceCatalog from './components/home/ServiceCatalog';
import MembershipTiers from './components/home/MembershipTiers';
import BookingModal from './components/booking/BookingModal';
import SearchModal from './components/common/SearchModal';
import AuthModal from './components/auth/AuthModal';
import MyBookings from './components/dashboard/MyBookings';
import AdminDashboard from './components/admin/AdminDashboard';
import SphereBot from './components/common/SphereBot';

export default function App() {
  const [activeView, setActiveView] = useState('home'); // 'home' | 'my-bookings' | 'admin' | category slug
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Fetch all services from backend API
  const fetchServices = async () => {
    try {
      const res = await api.getServices();
      if (res.success) {
        setServices(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch services:', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle category navigation from navbar or cards
  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    setActiveView('home');
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Search Submission from Floating Search Bar
  const handleSearchSubmit = (searchParams) => {
    if (searchParams.type) {
      setActiveCategory(searchParams.type.toLowerCase());
    }
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open booking modal for a specific service
  const handleOpenBooking = (service) => {
    setSelectedService(service);
  };

  // Handle pin click on 3D globe
  const handleGlobePinClick = (pin) => {
    const matched = services.find(
      s => s.parent_type === pin.category || s.city.toLowerCase().includes(pin.label.toLowerCase().split(' ')[0])
    ) || services[0];
    if (matched) {
      setSelectedService(matched);
    }
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={(view) => {
          if (['transport', 'entertainment', 'sports', 'hotel', 'restaurant', 'experiences'].includes(view)) {
            handleSelectCategory(view === 'experiences' ? 'themepark' : view);
          } else {
            setActiveView(view);
          }
        }}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'admin' ? (
          <div className="pt-24 sm:pt-28 pb-16">
            <AdminDashboard />
          </div>
        ) : activeView === 'my-bookings' ? (
          <div className="pt-24 sm:pt-28 pb-16">
            <MyBookings
              onBookNew={() => {
                setActiveView('home');
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          </div>
        ) : (
          <>
            {/* Cinematic 3D Hero with Live 3D Bus City Tour */}
            <HeroSection
              services={services}
              onSelectService={handleGlobePinClick}
              onSearchSubmit={handleSearchSubmit}
              onExploreCatalog={() => {
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 3D Interactive Category Cards */}
            <CategoryCards
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* Horizontally Scrollable Discover Experiences */}
            <DiscoverExperiences
              services={services.filter(s => s.is_featured)}
              onBookNow={handleOpenBooking}
            />

            {/* Interactive 3D City Tour & Service Inspector Section */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Service3DViewer services={services} onSelectService={handleOpenBooking} />
            </section>

            {/* Dynamic Catalog & Real-Time Filter View */}
            <ServiceCatalog
              services={services}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              onBookNow={handleOpenBooking}
            />

            {/* Loyalty Memberships & Points Progression */}
            <MembershipTiers onBookNow={() => {
              const el = document.getElementById('catalog-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleSelectCategory} />

      {/* Modals */}
      {selectedService && (
        <BookingModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onBookingSuccess={() => {
            fetchServices();
          }}
        />
      )}

      {searchModalOpen && (
        <SearchModal
          services={services}
          onClose={() => setSearchModalOpen(false)}
          onSelectService={handleOpenBooking}
        />
      )}

      {authModalOpen && (
        <AuthModal onClose={() => setAuthModalOpen(false)} />
      )}

      {/* Floating AI Concierge */}
      <SphereBot
        services={services}
        onSelectService={handleOpenBooking}
      />
    </div>
  );
}
