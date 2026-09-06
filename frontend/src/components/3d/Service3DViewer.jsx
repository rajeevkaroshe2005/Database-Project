import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

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
      {/* Fuselage (Main Body) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.25, 3.2, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Cockpit Window */}
      <mesh position={[0, 0.2, 1.2]}>
        <boxGeometry args={[0.3, 0.15, 0.4]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Wings */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.2, 0.05, 0.8]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Jet Engines */}
      <mesh position={[-1.1, -0.25, -0.1]}>
        <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.1, -0.25, -0.1]}>
        <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Tail Fin */}
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
      {/* Train Locomotive Carriage */}
      <RoundedBox args={[0.8, 0.9, 3.4]} radius={0.1} smoothness={4} position={[0, 0.45, 0]}>
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
      </RoundedBox>
      {/* Aerodynamic Front Nose */}
      <mesh position={[0, 0.35, 1.9]} rotation={[Math.PI / 6, 0, 0]}>
        <coneGeometry args={[0.42, 0.8, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Glowing Speed Line */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.84, 0.08, 3.3]} />
        <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={1.5} />
      </mesh>
      {/* Train Windows */}
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[0.82, 0.22, 2.8]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.8} roughness={0.1} />
      </mesh>
      {/* Track Rails */}
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
      cinemaRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  return (
    <group ref={cinemaRef} scale={[0.85, 0.85, 0.85]} position={[0, -0.4, 0]}>
      {/* Curved Screen */}
      <mesh position={[0, 1.4, -1.8]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[3.2, 3.2, 1.6, 32, 1, true, -Math.PI / 6, Math.PI / 3]} />
        <meshStandardMaterial color="#f8fafc" emissive="#38bdf8" emissiveIntensity={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Screen Frame Border */}
      <mesh position={[0, 1.4, -1.78]}>
        <cylinderGeometry args={[3.22, 3.22, 1.7, 32, 1, true, -Math.PI / 6, Math.PI / 3]} />
        <meshBasicMaterial color="#0284c7" wireframe side={THREE.DoubleSide} />
      </mesh>
      {/* Tiered Seating Rows */}
      {[-0.6, 0.0, 0.6].map((z, rowIdx) => (
        <group key={rowIdx} position={[0, rowIdx * 0.35, z]}>
          {/* Row Floor */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.4, 0.1, 0.65]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          {/* Recliner Seats in row */}
          {[-1.2, -0.6, 0, 0.6, 1.2].map((x, seatIdx) => (
            <mesh key={seatIdx} position={[x, 0.2, 0]}>
              <boxGeometry args={[0.35, 0.35, 0.35]} />
              <meshStandardMaterial color="#ef4444" roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}
      {/* Projector Light Beam */}
      <mesh position={[0, 2.2, 1.8]} rotation={[-Math.PI / 6, 0, 0]}>
        <coneGeometry args={[1.5, 3.5, 16, 1, true]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// 4. Stylized 3D Sports Turf & Stadium
const StadiumModel = () => {
  const stadiumRef = useRef();

  useFrame((state) => {
    if (stadiumRef.current) {
      stadiumRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={stadiumRef} scale={[0.85, 0.85, 0.85]}>
      {/* Green Turf Pitch */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.6, 0.1, 2.4]} />
        <meshStandardMaterial color="#15803d" roughness={0.6} />
      </mesh>
      {/* White Field Markings */}
      <mesh position={[0, 0.06, 0]}>
        <ringGeometry args={[0.4, 0.44, 32]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <planeGeometry args={[0.04, 2.3]} rotation={[-Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
      {/* Goal Posts */}
      <mesh position={[-1.7, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.45, 0.8]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
      <mesh position={[1.7, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.45, 0.8]} />
        <meshBasicMaterial color="#ffffff" wireframe />
      </mesh>
      {/* Floodlight Towers */}
      {[[-1.8, -1.2], [-1.8, 1.2], [1.8, -1.2], [1.8, 1.2]].map(([px, pz], idx) => (
        <group key={idx} position={[px, 0, pz]}>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.03, 0.05, 1.6, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          <mesh position={[0, 1.6, 0]}>
            <boxGeometry args={[0.3, 0.15, 0.2]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// 5. Stylized 3D Luxury Resort Tower
const HotelModel = () => {
  const hotelRef = useRef();

  useFrame((state) => {
    if (hotelRef.current) {
      hotelRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    }
  });

  return (
    <group ref={hotelRef} scale={[0.85, 0.85, 0.85]} position={[0, -0.5, 0]}>
      {/* Tower Main Structure */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[1.6, 2.8, 1.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Glass Balconies / Windows */}
      {[0.4, 1.0, 1.6, 2.2].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0.72]}>
          <boxGeometry args={[1.5, 0.25, 0.1]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.85} />
        </mesh>
      ))}
      {/* Rooftop Infinity Pool */}
      <mesh position={[0, 2.85, 0]}>
        <boxGeometry args={[1.3, 0.1, 1.1]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} roughness={0.1} />
      </mesh>
      {/* Base Podium & Palm trees representation */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.0, 0.2, 2.6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};

export default function Service3DViewer() {
  const [activeTab, setActiveTab] = useState('flight');

  const models = [
    { id: 'flight', label: 'Air Transport', component: <AirplaneModel />, desc: 'Commercial Boeing 787 Dreamliner with realistic wing sweep and twin jet turbines.' },
    { id: 'train', label: 'High-Speed Rail', component: <TrainModel />, desc: 'Vande Bharat aerodynamic 160 km/h cruising engine with glowing panoramic cabins.' },
    { id: 'cinema', label: 'IMAX Cinema', component: <CinemaModel />, desc: 'Curved laser projection screen with 12-channel acoustic layout and tiered recliners.' },
    { id: 'stadium', label: 'Sports Arena', component: <StadiumModel />, desc: '50mm FIFA AstroTurf pitch with night floodlights and tournament dugouts.' },
    { id: 'hotel', label: 'Luxury Resort', component: <HotelModel />, desc: 'High-tech architectural glass tower featuring rooftop infinity plunge pool.' }
  ];

  const current = models.find(m => m.id === activeTab);

  return (
    <div className="w-full glass-panel rounded-2xl p-6 lg:p-8 border border-white/10 relative overflow-hidden">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-white/5 pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">Interactive 3D Technology</span>
          <h3 className="text-xl lg:text-2xl font-bold text-white mt-0.5">Explore Verticals in 3D</h3>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          {models.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === m.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Box */}
      <div className="relative w-full h-[340px] lg:h-[400px] rounded-xl bg-space-950/60 border border-white/5 flex items-center justify-center overflow-hidden">
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
            {current?.component}
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
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-md glass-panel px-4 py-2.5 rounded-xl border border-white/10 text-xs text-slate-300 pointer-events-none">
          <div className="font-semibold text-white mb-0.5">{current?.label} Model</div>
          <p className="text-slate-400 leading-relaxed">{current?.desc}</p>
        </div>
      </div>
    </div>
  );
}
