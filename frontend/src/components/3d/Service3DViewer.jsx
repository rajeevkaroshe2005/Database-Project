import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import {
  Compass,
  Play,
  Pause,
  Gauge,
  Camera,
  Layers,
  Sparkles,
  MapPin,
  ArrowRight,
  Eye,
  CheckCircle2,
  Building2,
  Film,
  Trophy,
  UtensilsCrossed,
  PlaneTakeoff,
  RotateCcw
} from 'lucide-react';
import CityTour3DScene from './CityTour3DScene';

// 1. Stylized 3D Aeroplane Model
const AirplaneModel = () => {
  const planeRef = useRef();
  useFrame((state) => {
    if (planeRef.current) {
      planeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
      planeRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  return (
    <group ref={planeRef} scale={[0.85, 0.85, 0.85]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.25, 3.2, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.2, 1.2]}>
        <boxGeometry args={[0.3, 0.15, 0.4]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.2, 0.05, 0.8]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-1.1, -0.25, -0.1]}>
        <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.1, -0.25, -0.1]}>
        <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.5, -1.3]} rotation={[-Math.PI / 6, 0, 0]}>
        <boxGeometry args={[0.06, 0.8, 0.5]} />
        <meshStandardMaterial color="#2563eb" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
};

// 2. Stylized 3D High-Speed Bullet Train
const TrainModel = () => {
  const trainRef = useRef();
  useFrame((state) => {
    if (trainRef.current) {
      trainRef.current.position.z = Math.sin(state.clock.elapsedTime * 1.2) * 0.4;
    }
  });

  return (
    <group ref={trainRef} scale={[0.9, 0.9, 0.9]}>
      <RoundedBox args={[0.8, 0.9, 3.4]} radius={0.1} smoothness={4} position={[0, 0.45, 0]}>
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
      </RoundedBox>
      <mesh position={[0, 0.35, 1.9]} rotation={[Math.PI / 6, 0, 0]}>
        <coneGeometry args={[0.42, 0.8, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.84, 0.08, 3.3]} />
        <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[0.82, 0.22, 2.8]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[-0.3, -0.05, 0]}>
        <boxGeometry args={[0.06, 0.08, 4.5]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} />
      </mesh>
      <mesh position={[0.3, -0.05, 0]}>
        <boxGeometry args={[0.06, 0.08, 4.5]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} />
      </mesh>
    </group>
  );
};

// 3. Stylized 3D Cinema Auditorium
const CinemaModel = () => {
  const cinemaRef = useRef();
  useFrame((state) => {
    if (cinemaRef.current) {
      cinemaRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  return (
    <group ref={cinemaRef} scale={[0.8, 0.8, 0.8]} position={[0, -0.3, 0]}>
      <mesh position={[0, 1.2, 1.6]}>
        <boxGeometry args={[3.2, 1.8, 0.1]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2.0} roughness={0.1} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[3.8, 0.1, 4.0]} />
        <meshStandardMaterial color="#1e1e24" />
      </mesh>
      {[-0.8, -0.2, 0.4, 1.0].map((z, rowIdx) => (
        <group key={rowIdx} position={[0, rowIdx * 0.25, z]}>
          {[-1.2, -0.6, 0, 0.6, 1.2].map((x, seatIdx) => (
            <mesh key={seatIdx} position={[x, 0.2, 0]}>
              <boxGeometry args={[0.35, 0.4, 0.35]} />
              <meshStandardMaterial color="#ef4444" roughness={0.6} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

// 4. Stylized 3D Sports Turf / Arena
const StadiumModel = () => {
  const stadiumRef = useRef();
  useFrame((state) => {
    if (stadiumRef.current) {
      stadiumRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={stadiumRef} scale={[0.75, 0.75, 0.75]} position={[0, -0.2, 0]}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[2.8, 2.8, 0.2, 32]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.68, 32]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
      </mesh>
      {[-1.8, 1.8].map((x, idx) => (
        <mesh key={idx} position={[x, 0.5, 0]}>
          <boxGeometry args={[0.08, 0.7, 1.4]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.0} />
        </mesh>
      ))}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.5} />
      </mesh>
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => {
        const x = Math.cos(angle) * 2.4;
        const z = Math.sin(angle) * 2.4;
        return (
          <group key={idx} position={[x, 0, z]}>
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.04, 0.06, 2.4]} />
              <meshStandardMaterial color="#64748b" metalness={0.8} />
            </mesh>
            <mesh position={[0, 2.4, 0]}>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
            </mesh>
            <pointLight position={[0, 2.3, 0]} intensity={1.5} distance={5} color="#e0f2fe" />
          </group>
        );
      })}
    </group>
  );
};

// 5. Stylized 3D Luxury Hotel Tower
const HotelModel = () => {
  const hotelRef = useRef();
  useFrame((state) => {
    if (hotelRef.current) {
      hotelRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <group ref={hotelRef} scale={[0.85, 0.85, 0.85]} position={[0, -0.5, 0]}>
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[1.6, 2.8, 1.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>
      {[0.4, 1.0, 1.6, 2.2].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0.72]}>
          <boxGeometry args={[1.5, 0.25, 0.1]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.85} />
        </mesh>
      ))}
      <mesh position={[0, 2.85, 0]}>
        <boxGeometry args={[1.3, 0.1, 1.1]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.0, 0.2, 2.6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};

export default function Service3DViewer({ services = [], onSelectService }) {
  const [viewMode, setViewMode] = useState('tour'); // 'tour' | 'inspector'
  const [activeInspectorTab, setActiveInspectorTab] = useState('flight');

  // Tour Controls State
  const [isDriving, setIsDriving] = useState(true);
  const [speedLevel, setSpeedLevel] = useState('express'); // 'cruise' | 'express' | 'turbo'
  const [cameraMode, setCameraMode] = useState('chase'); // 'chase' | 'orbit' | 'hood'
  const [currentLandmark, setCurrentLandmark] = useState({
    id: 'hotel',
    title: 'The Azure Bay Cliffside Pool Villa',
    category: 'HOTEL',
    city: 'Goa',
    price: '₹14,000/night'
  });

  const speedMultiplier = speedLevel === 'cruise' ? 0.75 : speedLevel === 'express' ? 1.3 : 2.2;
  const speedKmh = speedLevel === 'cruise' ? 45 : speedLevel === 'express' ? 80 : 120;

  const inspectorModels = [
    { id: 'flight', label: 'Air Transport', component: <AirplaneModel />, desc: 'Commercial Boeing 787 Dreamliner with realistic wing sweep and twin jet turbines.' },
    { id: 'train', label: 'High-Speed Rail', component: <TrainModel />, desc: 'Vande Bharat aerodynamic 160 km/h cruising engine with glowing panoramic cabins.' },
    { id: 'cinema', label: 'IMAX Cinema', component: <CinemaModel />, desc: 'Curved laser projection screen with 12-channel acoustic layout and tiered recliners.' },
    { id: 'stadium', label: 'Sports Arena', component: <StadiumModel />, desc: '50mm FIFA AstroTurf pitch with night floodlights and tournament dugouts.' },
    { id: 'hotel', label: 'Luxury Resort', component: <HotelModel />, desc: 'High-tech architectural glass tower featuring rooftop infinity plunge pool.' }
  ];

  const currentInspector = inspectorModels.find(m => m.id === activeInspectorTab);

  // Match current passing landmark to database services
  const matchedDbService = services.find(s => {
    if (!currentLandmark) return false;
    return s.title?.toLowerCase().includes(currentLandmark.title?.toLowerCase().split(' ')[0]) ||
           s.parent_type === currentLandmark.category;
  }) || services[0];

  const getLandmarkIcon = (cat) => {
    switch (cat) {
      case 'HOTEL': return <Building2 className="w-4 h-4 text-cyan-400" />;
      case 'ENTERTAINMENT': return <Film className="w-4 h-4 text-purple-400" />;
      case 'SPORTS': return <Trophy className="w-4 h-4 text-emerald-400" />;
      case 'RESTAURANT': return <UtensilsCrossed className="w-4 h-4 text-amber-400" />;
      case 'TRANSPORT': return <PlaneTakeoff className="w-4 h-4 text-blue-400" />;
      default: return <Compass className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 lg:p-8 border border-white/10 relative overflow-hidden space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Interactive 3D Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Three.js GPU Rendered</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
            {viewMode === 'tour' ? 'BookSphere Express: 3D City & Highway Tour' : '3D Venue & Vehicle Model Inspector'}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {viewMode === 'tour'
              ? 'Watch our luxury cruiser travel down the illuminated highway, passing real booking venues across Hotels, IMAX Cinemas, AstroTurfs, and Restaurants in real-time 3D.'
              : 'Rotate, zoom, and inspect individual architectural models and transport vehicles in high detail.'}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setViewMode('tour')}
            className={"flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all " +
              (viewMode === 'tour'
                ? 'bg-cyan-500 text-white shadow-glow-cyan'
                : 'text-slate-400 hover:text-white')}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>🚌 3D City Tour</span>
          </button>
          <button
            onClick={() => setViewMode('inspector')}
            className={"flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all " +
              (viewMode === 'inspector'
                ? 'bg-purple-600 text-white shadow-glow-purple'
                : 'text-slate-400 hover:text-white')}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>🔍 3D Model Inspector</span>
          </button>
        </div>
      </div>

      {/* 1. CITY TOUR VIEW */}
      {viewMode === 'tour' && (
        <div className="space-y-4">
          {/* Highway Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-space-900/80 border border-white/10 text-xs">
            {/* Play/Pause & Speed */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDriving(!isDriving)}
                className={"p-2 rounded-xl border font-bold flex items-center gap-1.5 transition-all " +
                  (isDriving
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40")}
                title={isDriving ? "Pause Cruise" : "Resume Cruise"}
              >
                {isDriving ? <Pause className="w-3.5 h-3.5 fill-emerald-300" /> : <Play className="w-3.5 h-3.5 fill-amber-300" />}
                <span>{isDriving ? 'Cruising' : 'Paused'}</span>
              </button>

              <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

              <div className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1" />
                <span className="text-slate-400 text-[11px] mr-1">Speed:</span>
                {[
                  { id: 'cruise', label: '45 km/h' },
                  { id: 'express', label: '80 km/h' },
                  { id: 'turbo', label: '120 km/h 🚀' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSpeedLevel(s.id)}
                    className={"px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all " +
                      (speedLevel === s.id
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                        : "text-slate-400 hover:text-white")}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Camera View Mode */}
            <div className="flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-purple-400 mr-1" />
              <span className="text-slate-400 text-[11px] mr-1">Camera:</span>
              {[
                { id: 'chase', label: '🎥 Chase Cam' },
                { id: 'orbit', label: '🚁 Free 3D Orbit' },
                { id: 'hood', label: '🚏 Roadside/Hood' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setCameraMode(c.id)}
                  className={"px-2.5 py-1 rounded-lg text-[11px] transition-all " +
                    (cameraMode === c.id
                      ? "bg-purple-600/30 text-purple-200 border border-purple-400/40 font-bold"
                      : "text-slate-400 hover:text-white")}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Canvas Box */}
          <div className="relative w-full h-[400px] lg:h-[460px] rounded-3xl bg-gradient-to-b from-space-950 via-space-900 to-space-950 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
            <CityTour3DScene
              speed={speedMultiplier}
              isDriving={isDriving}
              cameraMode={cameraMode}
              onLandmarkChange={setCurrentLandmark}
            />

            {/* Floating Top Telemetry Pill */}
            <div className="absolute top-4 right-4 glass-panel px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-mono text-cyan-300 flex items-center gap-2 pointer-events-none shadow-lg backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{isDriving ? `${speedKmh} km/h • Route BKC Express` : 'Idle at Roadside'}</span>
            </div>

            {/* Floating Live Passing Landmark HUD Card */}
            {currentLandmark && (
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md glass-panel p-4 rounded-2xl border border-cyan-500/30 bg-space-950/80 backdrop-blur-md shadow-glow-cyan animate-in fade-in space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white/10 border border-white/10">
                      {getLandmarkIcon(currentLandmark.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                          Now Passing Venue:
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-white/10 text-slate-300 text-[10px] font-mono">
                          {currentLandmark.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white mt-0.5 leading-tight">
                        {currentLandmark.title}
                      </h4>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {currentLandmark.city}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">{currentLandmark.price}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectService && matchedDbService) {
                        onSelectService(matchedDbService);
                      } else {
                        const el = document.getElementById('catalog-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="glow-button px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-glow-cyan flex items-center gap-1.5"
                  >
                    <span>Book Venue</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. INDIVIDUAL MODEL INSPECTOR VIEW */}
      {viewMode === 'inspector' && (
        <div className="space-y-4">
          {/* Model Tabs */}
          <div className="flex flex-wrap gap-2">
            {inspectorModels.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveInspectorTab(m.id)}
                className={"px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all " +
                  (activeInspectorTab === m.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                    : 'glass-panel text-slate-400 hover:text-white border-white/10')}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Model Canvas */}
          <div className="relative w-full h-[380px] lg:h-[420px] rounded-3xl bg-space-950/80 border border-white/10 flex items-center justify-center overflow-hidden">
            <Canvas
              camera={{ position: [0, 1.8, 4.5], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              className="cursor-grab active:cursor-grabbing"
            >
              <ambientLight intensity={0.9} />
              <directionalLight position={[10, 10, 5]} intensity={1.5} color="#60a5fa" />
              <pointLight position={[-8, -4, -4]} intensity={0.8} color="#8b5cf6" />
              <pointLight position={[0, 6, 2]} intensity={1.2} color="#00f2fe" />

              <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.25}>
                {currentInspector?.component}
              </Float>

              <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={2.5}
                maxDistance={7}
                dampingFactor={0.05}
              />
            </Canvas>

            {/* Description Pill */}
            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-md glass-panel px-4 py-2.5 rounded-2xl border border-white/10 text-xs text-slate-300 pointer-events-none">
              <div className="font-bold text-white mb-0.5">{currentInspector?.label} Model</div>
              <p className="text-slate-400 leading-relaxed text-[11px]">{currentInspector?.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
