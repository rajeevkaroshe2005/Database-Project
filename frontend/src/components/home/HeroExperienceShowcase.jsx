import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  Star,
  Building,
  Plane,
  Film,
  Trophy,
  Utensils,
  Compass
} from 'lucide-react';

// Procedural 3D Destination Pin
function DestinationPin({ position, label, color, isSelected, onClick }) {
  const pinRef = useRef();

  useFrame((state) => {
    if (pinRef.current) {
      const t = state.clock.getElapsedTime();
      pinRef.current.scale.setScalar(isSelected ? 1.4 : 1 + Math.sin(t * 3 + position[0]) * 0.12);
    }
  });

  return (
    <group position={position}>
      {/* Outer Pulse Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.16, 24]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={isSelected ? 0.95 : 0.45} />
      </mesh>

      {/* Central Pin Sphere */}
      <mesh
        ref={pinRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.8 : 0.6}
          roughness={0.2}
          metalness={0.7}
        />
      </mesh>

      {/* Vertical Pin Beam */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

// 3D Flight Arc Connecting Cities
function FlightArc({ start, end, color = '#C9A96E' }) {
  const points = useMemo(() => {
    const p1 = new THREE.Vector3(...start);
    const p2 = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const dist = p1.distanceTo(p2);
    mid.normalize().multiplyScalar(2.45 + dist * 0.22);

    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    return curve.getPoints(32);
  }, [start, end]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1.8}
      transparent
      opacity={0.65}
    />
  );
}

// 3D Luxury Destination Globe Core
function GlobeCore({ activeIndex, onSelectDestination, destinations }) {
  const globeRef = useRef();

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Main Sphere: Warm Pearl Ivory */}
      <Sphere args={[2.0, 48, 48]}>
        <meshStandardMaterial
          color="#FAF6EE"
          roughness={0.5}
          metalness={0.3}
        />
      </Sphere>

      {/* Sand Wireframe Grid Layer */}
      <Sphere args={[2.01, 28, 28]}>
        <meshBasicMaterial
          color="#D8C7AD"
          wireframe
          transparent
          opacity={0.45}
        />
      </Sphere>

      {/* Subtle Warm Atmosphere Halo */}
      <Sphere args={[2.12, 32, 32]}>
        <meshBasicMaterial
          color="#C9A96E"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Golden Orbital Equator Ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[2.65, 2.68, 64]} />
        <meshBasicMaterial color="#C9A96E" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Terracotta Inclined Ring */}
      <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <ringGeometry args={[2.95, 2.97, 64]} />
        <meshBasicMaterial color="#B86B4B" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Flight Arcs Connecting Cities */}
      <FlightArc start={[0.5, 1.2, 1.5]} end={[0.7, 0.6, 1.8]} color="#B86B4B" />
      <FlightArc start={[0.5, 1.2, 1.5]} end={[0.2, 0.8, 1.9]} color="#C9A96E" />
      <FlightArc start={[0.7, 0.6, 1.8]} end={[0.8, 1.6, 1.0]} color="#243B35" />

      {/* Destination Pins */}
      {destinations.map((d, idx) => (
        <DestinationPin
          key={d.id}
          position={d.position}
          label={d.city}
          color={d.pinColor}
          isSelected={activeIndex === idx}
          onClick={() => onSelectDestination(idx)}
        />
      ))}
    </group>
  );
}

export default function HeroExperienceShowcase({ onSelectService, services = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const showcaseDestinations = [
    {
      id: 'hotel',
      category: 'HOTEL',
      icon: Building,
      label: 'Luxury Villa',
      title: 'The Azure Bay Cliffside Pool Villa',
      city: 'North Goa',
      price: '₹14,000',
      priceUnit: '/night',
      rating: 4.95,
      reviews: 142,
      position: [0.2, 0.8, 1.9],
      pinColor: '#B86B4B',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'flight',
      category: 'TRANSPORT',
      icon: Plane,
      label: 'Executive Flight',
      title: 'Akasa Air Premier Boeing 787',
      city: 'Mumbai → Bengaluru',
      price: '₹4,200',
      priceUnit: '/seat',
      rating: 4.88,
      reviews: 310,
      position: [0.7, 0.6, 1.8],
      pinColor: '#C9A96E',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'movie',
      category: 'ENTERTAINMENT',
      icon: Film,
      label: 'IMAX 4K Laser',
      title: 'PVR INOX IMAX Laser Cinema',
      city: 'Mumbai (BKC)',
      price: '₹480',
      priceUnit: '/ticket',
      rating: 4.92,
      reviews: 840,
      position: [0.5, 1.2, 1.5],
      pinColor: '#B86B4B',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'turf',
      category: 'SPORTS',
      icon: Trophy,
      label: 'FIFA AstroTurf',
      title: 'KickOff Pro 7v7 Arena',
      city: 'Mumbai (Andheri)',
      price: '₹1,200',
      priceUnit: '/hour',
      rating: 4.84,
      reviews: 195,
      position: [0.8, 1.6, 1.0],
      pinColor: '#243B35',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'restaurant',
      category: 'RESTAURANT',
      icon: Utensils,
      label: 'Skyline Dining',
      title: 'Spice Symphony Rooftop Lounge',
      city: 'Delhi NCR',
      price: '₹1,800',
      priceUnit: '/table',
      rating: 4.89,
      reviews: 240,
      position: [0.4, 1.4, 1.6],
      pinColor: '#B86B4B',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const current = showcaseDestinations[activeIndex];

  const matchedService = services.find(s => {
    return s.title?.toLowerCase().includes(current.title.toLowerCase().split(' ')[0]) ||
           s.parent_type === current.category;
  }) || services[0];

  return (
    <div className="relative w-full h-[520px] sm:h-[560px] lg:h-[600px] rounded-3xl overflow-hidden bg-white border border-[#D4C8B8] shadow-2xl flex flex-col justify-between select-none">
      {/* Top Header: Vertical Switcher Chips */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-[#DDD3C4] shadow-sm">
          {showcaseDestinations.map((dest, idx) => {
            const Icon = dest.icon;
            const isSelected = activeIndex === idx;
            return (
              <button
                key={dest.id}
                onClick={() => setActiveIndex(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#B86B4B] text-white shadow-terracotta'
                    : 'text-[#38342F] hover:text-[#171513] hover:bg-[#FAF8F3]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#B86B4B]'}`} />
                <span>{dest.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Interactive Luxury Globe */}
      <div className="w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas
          camera={{ position: [0, 1.2, 5.2], fov: 44 }}
          gl={{ antialias: true, alpha: true }}
          className="w-full h-full"
        >
          <ambientLight intensity={1.1} />
          <directionalLight position={[15, 20, 10]} intensity={1.8} color="#FFF9ED" />
          <directionalLight position={[-15, 10, -10]} intensity={1.0} color="#F7EDE1" />
          <pointLight position={[0, 6, 0]} intensity={0.9} color="#C9A96E" />

          <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.25}>
            <GlobeCore
              activeIndex={activeIndex}
              onSelectDestination={setActiveIndex}
              destinations={showcaseDestinations}
            />
          </Float>

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={3.8}
            maxDistance={7.5}
            rotateSpeed={0.5}
            dampingFactor={0.06}
          />
        </Canvas>
      </div>

      {/* Bottom Live Experience Showcase Card */}
      <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl border border-[#DDD3C4] p-4 sm:p-5 shadow-xl pointer-events-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Thumbnail & Details */}
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={current.image}
              alt={current.title}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border border-[#DDD3C4] shadow-sm shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF8F3] text-[#B86B4B] border border-[#DDD3C4]">
                  {current.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-[#171513]">
                  <Star className="w-3.5 h-3.5 text-[#C9A96E] fill-[#C9A96E]" />
                  <span>{current.rating}</span>
                  <span className="text-[#786F62] font-normal">({current.reviews})</span>
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#171513] truncate font-serif">
                {current.title}
              </h3>
              <p className="text-xs text-[#5C554B] mt-0.5 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#B86B4B] shrink-0" />
                <span>{current.city} • Verified Instant Lock</span>
              </p>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8DFD1]">
            <div className="text-left sm:text-right shrink-0">
              <div className="text-[10px] uppercase font-bold text-[#786F62] tracking-wider">Starting from</div>
              <div className="text-base sm:text-lg font-black text-[#171513]">
                {current.price}
                <span className="text-xs font-normal text-[#786F62] ml-0.5">{current.priceUnit}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (onSelectService && matchedService) {
                  onSelectService(matchedService);
                } else {
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-terracotta flex items-center gap-1.5 shrink-0"
            >
              <span>Reserve Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
