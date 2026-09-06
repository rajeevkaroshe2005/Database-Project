import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// Procedural 3D Destination Marker
const Marker = ({ position, label, category, color = '#00f2fe', onClick, onHover }) => {
  const markerRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (markerRef.current) {
      const t = state.clock.getElapsedTime();
      markerRef.current.scale.setScalar(hovered ? 1.4 : 1 + Math.sin(t * 3 + position[0]) * 0.15);
    }
  });

  return (
    <group position={position}>
      {/* Outer Pulse Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.16, 24]} />
        <meshBasicMaterial color={color} side={THREE.DoubleSide} transparent opacity={hovered ? 0.9 : 0.5} />
      </mesh>
      
      {/* Central Pin Sphere */}
      <mesh
        ref={markerRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHover({ label, category, position });
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick({ label, category });
        }}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2 : 0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Vertical Pin Beam */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

// Flight Arc connecting two 3D points
const FlightArc = ({ start, end, color = '#38bdf8' }) => {
  const points = useMemo(() => {
    const p1 = new THREE.Vector3(...start);
    const p2 = new THREE.Vector3(...end);
    const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const distance = p1.distanceTo(p2);
    // Push the midpoint outward away from the globe center to form an arc
    mid.normalize().multiplyScalar(2.6 + distance * 0.18);

    const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
    return curve.getPoints(32);
  }, [start, end]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1.5}
      transparent
      opacity={0.65}
    />
  );
};

// Main Rotating Globe & Atmosphere
const GlobeCore = ({ onMarkerSelect, onMarkerHover }) => {
  const globeRef = useRef();

  useFrame((_, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.12;
    }
  });

  // Destination pins on the 3D globe surface
  const markers = [
    { label: 'Mumbai Metro & IMAX', category: 'ENTERTAINMENT', position: [0.6, 1.3, 1.7], color: '#00f2fe' },
    { label: 'Bengaluru Flight & Arena', category: 'TRANSPORT', position: [0.8, 0.7, 2.0], color: '#38bdf8' },
    { label: 'Goa Oceanfront Villa', category: 'HOTEL', position: [0.3, 0.9, 2.1], color: '#a855f7' },
    { label: 'Delhi NCR Stadium & Rail', category: 'SPORTS', position: [0.9, 1.8, 1.1], color: '#ec4899' },
    { label: 'Pune AstroTurf & Dining', category: 'RESTAURANT', position: [0.5, 1.1, 1.9], color: '#f59e0b' },
  ];

  return (
    <group ref={globeRef}>
      {/* Central Dark Obsidian Sphere */}
      <Sphere args={[2.2, 48, 48]}>
        <meshStandardMaterial
          color="#070c18"
          roughness={0.6}
          metalness={0.7}
        />
      </Sphere>

      {/* Wireframe Grid Layer */}
      <Sphere args={[2.21, 28, 28]}>
        <meshBasicMaterial
          color="#1e293b"
          wireframe
          transparent
          opacity={0.35}
        />
      </Sphere>

      {/* Outer Cyan Atmosphere Glow */}
      <Sphere args={[2.32, 32, 32]}>
        <meshBasicMaterial
          color="#0284c7"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Orbital Equator Ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[2.8, 2.82, 64]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <ringGeometry args={[3.1, 3.12, 64]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Flight Paths */}
      <FlightArc start={[0.6, 1.3, 1.7]} end={[0.8, 0.7, 2.0]} color="#00f2fe" />
      <FlightArc start={[0.6, 1.3, 1.7]} end={[0.3, 0.9, 2.1]} color="#a855f7" />
      <FlightArc start={[0.8, 0.7, 2.0]} end={[0.9, 1.8, 1.1]} color="#38bdf8" />

      {/* Destination Markers */}
      {markers.map((m, idx) => (
        <Marker
          key={idx}
          position={m.position}
          label={m.label}
          category={m.category}
          color={m.color}
          onClick={onMarkerSelect}
          onHover={onMarkerHover}
        />
      ))}
    </group>
  );
};

export default function HeroGlobeScene({ onSelectService }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <div className="relative w-full h-[480px] lg:h-[620px] select-none">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.5, 5.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.4} color="#60a5fa" />
        <pointLight position={[-10, -5, -5]} intensity={0.9} color="#8b5cf6" />
        <pointLight position={[0, 8, 0]} intensity={1.2} color="#00f2fe" />

        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
          <GlobeCore
            onMarkerSelect={(item) => {
              if (onSelectService) onSelectService(item);
            }}
            onMarkerHover={setActiveTooltip}
          />
        </Float>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3.8}
          maxDistance={8.5}
          rotateSpeed={0.6}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Floating Interactive Tooltip */}
      {activeTooltip && (
        <div className="absolute top-6 right-6 pointer-events-none z-10 glass-panel px-4 py-3 rounded-xl border border-cyan-500/40 shadow-glow-cyan animate-fade-in">
          <div className="text-[10px] tracking-wider uppercase font-semibold text-cyan-400">
            {activeTooltip.category}
          </div>
          <div className="text-sm font-bold text-white mt-0.5">
            {activeTooltip.label}
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live bookings available • Click to explore
          </div>
        </div>
      )}

      {/* Subtle Bottom Instruction Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-slate-500 flex items-center gap-2 pointer-events-none">
        <span>Drag to rotate 3D world</span>
        <span>•</span>
        <span>Scroll to zoom</span>
        <span>•</span>
        <span>Tap pins to inspect</span>
      </div>
    </div>
  );
}
