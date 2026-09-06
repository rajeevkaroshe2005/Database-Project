import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';

// 1. BUS 3D MODEL
function LuxuryBus({ speed, isDriving }) {
  const busRef = useRef();
  const frontLeftWheel = useRef();
  const frontRightWheel = useRef();
  const rearLeftWheel1 = useRef();
  const rearRightWheel1 = useRef();
  const rearLeftWheel2 = useRef();
  const rearRightWheel2 = useRef();

  useFrame((state, delta) => {
    if (isDriving) {
      const rotSpeed = speed * delta * 12;
      [frontLeftWheel, frontRightWheel, rearLeftWheel1, rearRightWheel1, rearLeftWheel2, rearRightWheel2].forEach(w => {
        if (w.current) w.current.rotation.x += rotSpeed;
      });

      if (busRef.current) {
        // Subtle driving suspension bobbing
        busRef.current.position.y = 0.55 + Math.sin(state.clock.elapsedTime * 9) * 0.012;
        busRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 4.5) * 0.005;
      }
    }
  });

  return (
    <group ref={busRef} position={[0, 0.55, 0]}>
      {/* Main Bus Chassis / Body (Aerodynamic Streamlined Luxury Coach) */}
      <RoundedBox args={[1.5, 1.4, 4.8]} radius={0.15} smoothness={4} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#0284c7" metalness={0.75} roughness={0.25} />
      </RoundedBox>

      {/* Roof Cap (Clean White with AC Unit) */}
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[1.44, 0.12, 4.6]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.38, -0.6]}>
        <boxGeometry args={[0.9, 0.16, 1.4]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.7} />
      </mesh>

      {/* Front Windshield (Aerodynamic Curved Glass) */}
      <mesh position={[0, 0.65, 2.38]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[1.42, 0.75, 0.12]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.88} />
      </mesh>

      {/* Side Panoramic Windows (Both sides) */}
      <mesh position={[0.76, 0.65, 0.1]}>
        <boxGeometry args={[0.04, 0.62, 3.8]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.76, 0.65, 0.1]}>
        <boxGeometry args={[0.04, 0.62, 3.8]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.8} transparent opacity={0.85} />
      </mesh>

      {/* Interior Warm Passenger Glow */}
      <pointLight position={[0, 0.7, 0]} intensity={1.8} distance={3} color="#fef08a" />

      {/* Headlights (High-beam LED lamps casting light on road) */}
      <mesh position={[-0.55, 0.15, 2.42]}>
        <boxGeometry args={[0.25, 0.15, 0.08]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.55, 0.15, 2.42]}>
        <boxGeometry args={[0.25, 0.15, 0.08]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
      </mesh>
      <spotLight position={[-0.55, 0.2, 2.5]} target-position={[-0.55, -0.2, 10]} angle={0.4} penumbra={0.6} intensity={3.5} color="#e0f2fe" distance={18} />
      <spotLight position={[0.55, 0.2, 2.5]} target-position={[0.55, -0.2, 10]} angle={0.4} penumbra={0.6} intensity={3.5} color="#e0f2fe" distance={18} />

      {/* Rear Tail Lights (Neon Ruby LED) */}
      <mesh position={[-0.6, 0.25, -2.42]}>
        <boxGeometry args={[0.22, 0.18, 0.05]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0.6, 0.25, -2.42]}>
        <boxGeometry args={[0.22, 0.18, 0.05]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={2.5} />
      </mesh>

      {/* Brand Stripe (Cyan Glow) */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[1.52, 0.08, 4.6]} />
        <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={1.8} />
      </mesh>

      {/* Wheels with Rims */}
      {/* Front Left */}
      <group ref={frontLeftWheel} position={[-0.78, -0.25, 1.4]}>
        <cylinderGeometry args={[0.34, 0.34, 0.22, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </group>
      {/* Front Right */}
      <group ref={frontRightWheel} position={[0.78, -0.25, 1.4]}>
        <cylinderGeometry args={[0.34, 0.34, 0.22, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </group>
      {/* Rear Left 1 */}
      <group ref={rearLeftWheel1} position={[-0.78, -0.25, -1.1]}>
        <cylinderGeometry args={[0.34, 0.34, 0.22, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </group>
      {/* Rear Right 1 */}
      <group ref={rearRightWheel1} position={[0.78, -0.25, -1.1]}>
        <cylinderGeometry args={[0.34, 0.34, 0.22, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </group>
      {/* Rear Left 2 (Multi-axle luxury coach) */}
      <group ref={rearLeftWheel2} position={[-0.78, -0.25, -1.85]}>
        <cylinderGeometry args={[0.34, 0.34, 0.22, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </group>
      {/* Rear Right 2 */}
      <group ref={rearRightWheel2} position={[0.78, -0.25, -1.85]}>
        <cylinderGeometry args={[0.34, 0.34, 0.22, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </group>
    </group>
  );
}

// 2. LANDMARK 1: AZURE BAY LUXURY HOTEL & RESORT
function HotelLandmark() {
  return (
    <group>
      {/* Podium Foundation */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[4.5, 0.4, 4.5]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Main Hotel Tower */}
      <mesh position={[0, 2.8, 0]}>
        <boxGeometry args={[3.2, 4.8, 2.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Glass Balconies / Illuminated Room Rows */}
      {[1.2, 2.0, 2.8, 3.6, 4.4].map((y, idx) => (
        <mesh key={idx} position={[0, y, 1.45]}>
          <boxGeometry args={[3.0, 0.35, 0.15]} />
          <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} roughness={0.1} />
        </mesh>
      ))}

      {/* Rooftop Infinity Pool with Cyan Glow */}
      <mesh position={[0, 5.25, 0]}>
        <boxGeometry args={[2.6, 0.15, 2.2]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={1.8} />
      </mesh>

      {/* Hotel Entrance Canopy */}
      <mesh position={[0, 0.5, 2.2]}>
        <boxGeometry args={[2.0, 0.08, 1.2]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.9} />
      </mesh>
      <pointLight position={[0, 0.7, 2.2]} intensity={2} color="#f59e0b" distance={4} />

      {/* Neon Sign Billboard: HOTEL */}
      <mesh position={[0, 5.7, 0]}>
        <boxGeometry args={[2.2, 0.5, 0.1]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2} />
      </mesh>

      {/* Palm Trees */}
      <mesh position={[2.0, 0.8, 1.8]}>
        <cylinderGeometry args={[0.08, 0.12, 1.6]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[2.0, 1.7, 1.8]}>
        <coneGeometry args={[0.7, 0.9, 7]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
    </group>
  );
}

// 3. LANDMARK 2: PVR INOX IMAX LASER CINEMA
function CinemaLandmark() {
  return (
    <group>
      {/* Base Building Structure */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[4.4, 3.6, 4.0]} />
        <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Giant Curved IMAX Marquee Screen */}
      <mesh position={[0, 2.4, 2.05]}>
        <boxGeometry args={[3.6, 1.8, 0.1]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={2.5} />
      </mesh>

      {/* Entrance Marquee with Neon Bulbs */}
      <mesh position={[0, 0.7, 2.2]}>
        <boxGeometry args={[3.2, 0.15, 1.4]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[0, 0.9, 2.4]} intensity={2.5} color="#ec4899" distance={5} />

      {/* Red Carpet Entrance */}
      <mesh position={[0, 0.05, 2.6]}>
        <boxGeometry args={[1.6, 0.04, 1.8]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>

      {/* Roof Arch Details */}
      <mesh position={[0, 3.7, 0]}>
        <cylinderGeometry args={[1.8, 1.8, 4.2, 16]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#312e81" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// 4. LANDMARK 3: KICKOFF PRO ASTROTURF SPORTS ARENA
function SportsArenaLandmark() {
  return (
    <group>
      {/* Green Turf Pitch Surface */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[5.2, 0.1, 4.2]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>

      {/* White Pitch Boundary & Center Line */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[4.8, 0.02, 0.08]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.02, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} wireframe />
      </mesh>

      {/* Goal Posts */}
      <mesh position={[-2.2, 0.45, 0]}>
        <boxGeometry args={[0.08, 0.8, 1.4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>
      <mesh position={[2.2, 0.45, 0]}>
        <boxGeometry args={[0.08, 0.8, 1.4]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>

      {/* Wireframe Perimeter Fence */}
      <mesh position={[0, 0.8, 2.1]}>
        <boxGeometry args={[5.2, 1.5, 0.05]} />
        <meshStandardMaterial color="#64748b" wireframe transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 0.8, -2.1]}>
        <boxGeometry args={[5.2, 1.5, 0.05]} />
        <meshStandardMaterial color="#64748b" wireframe transparent opacity={0.5} />
      </mesh>

      {/* 4 Stadium Floodlight Towers with Bright White Spotlights */}
      {[
        [-2.4, 1.8], [2.4, 1.8], [-2.4, -1.8], [2.4, -1.8]
      ].map(([x, z], idx) => (
        <group key={idx} position={[x, 0, z]}>
          <mesh position={[0, 1.8, 0]}>
            <cylinderGeometry args={[0.06, 0.08, 3.6]} />
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </mesh>
          <mesh position={[0, 3.6, 0]}>
            <boxGeometry args={[0.4, 0.25, 0.4]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4} />
          </mesh>
          <pointLight position={[0, 3.5, 0]} intensity={2.8} distance={8} color="#e0f2fe" />
        </group>
      ))}

      {/* Illuminated Signboard: TURF 24x7 */}
      <mesh position={[0, 2.2, 2.1]}>
        <boxGeometry args={[2.0, 0.4, 0.1]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

// 5. LANDMARK 4: SPICE SYMPHONY GOURMET RESTAURANT
function RestaurantLandmark() {
  return (
    <group>
      {/* Base Restaurant Building */}
      <mesh position={[0, 1.4, -0.6]}>
        <boxGeometry args={[3.8, 2.8, 2.6]} />
        <meshStandardMaterial color="#292524" roughness={0.5} />
      </mesh>

      {/* Terracotta / Modern Slanted Roof */}
      <mesh position={[0, 2.9, -0.6]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[4.2, 0.2, 3.0]} />
        <meshStandardMaterial color="#b45309" roughness={0.3} />
      </mesh>

      {/* Warm Front Windows */}
      <mesh position={[0, 1.3, 0.72]}>
        <boxGeometry args={[3.2, 1.4, 0.08]} />
        <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={0.8} />
      </mesh>

      {/* Outdoor Dining Timber Deck Patio */}
      <mesh position={[0, 0.1, 1.4]}>
        <boxGeometry args={[4.2, 0.2, 2.2]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>

      {/* Outdoor Bistro Tables with Umbrella Parasols */}
      {[-1.2, 1.2].map((x, idx) => (
        <group key={idx} position={[x, 0.2, 1.4]}>
          {/* Table */}
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.06, 12]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.4]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          {/* Parasol Umbrella */}
          <mesh position={[0, 1.4, 0]}>
            <coneGeometry args={[0.9, 0.4, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Hanging Amber Bistro Lanterns */}
      <pointLight position={[0, 1.8, 1.4]} intensity={2.5} distance={6} color="#f59e0b" />

      {/* Restaurant Neon Signboard */}
      <mesh position={[0, 2.4, 0.75]}>
        <boxGeometry args={[2.4, 0.45, 0.08]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

// 6. LANDMARK 5: SKYPORT INTERNATIONAL AIRPORT TERMINAL
function AirportLandmark() {
  return (
    <group>
      {/* Terminal Wing Building */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[5.4, 2.4, 3.2]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Blue Panoramic Glass Observation Wall */}
      <mesh position={[0, 1.3, 1.62]}>
        <boxGeometry args={[4.8, 1.5, 0.08]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.9} transparent opacity={0.85} />
      </mesh>

      {/* Air Traffic Control Tower */}
      <mesh position={[-2.0, 2.6, -1.0]}>
        <cylinderGeometry args={[0.3, 0.4, 2.8]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>
      <mesh position={[-2.0, 4.0, -1.0]}>
        <cylinderGeometry args={[0.7, 0.5, 0.7, 8]} />
        <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[-2.0, 4.4, -1.0]} intensity={3} color="#ef4444" distance={8} />

      {/* Mini Commercial Passenger Jet Parked on Apron */}
      <group position={[1.4, 0.6, 2.6]} rotation={[0, -0.4, 0]} scale={[0.5, 0.5, 0.5]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.25, 2.8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.7} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2, 0.04, 0.6]} />
          <meshStandardMaterial color="#38bdf8" metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.4, -1.1]} rotation={[-0.4, 0, 0]}>
          <boxGeometry args={[0.05, 0.7, 0.4]} />
          <meshStandardMaterial color="#2563eb" />
        </mesh>
      </group>

      {/* Runway Edge Blue Guideway Lights */}
      {[-2.0, -0.6, 0.8, 2.2].map((x, idx) => (
        <mesh key={idx} position={[x, 0.08, 3.6]}>
          <boxGeometry args={[0.1, 0.15, 0.1]} />
          <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={3} />
        </mesh>
      ))}
    </group>
  );
}

// 7. MOVING ROAD & PASSING LANDMARKS CONTROLLER
function MovingWorld({ speed, isDriving, onLandmarkDetected }) {
  const roadZRef = useRef(0);
  const roadMeshRef = useRef();

  // Landmarks list with initial spacing along the road
  const landmarkData = useMemo(() => [
    { id: 'hotel', title: 'The Azure Bay Cliffside Pool Villa', category: 'HOTEL', city: 'Goa', price: '₹14,000/night', component: <HotelLandmark />, side: 1, baseZ: 25 },
    { id: 'cinema', title: 'PVR INOX IMAX Laser Cinema', category: 'ENTERTAINMENT', city: 'Mumbai', price: '₹350/ticket', component: <CinemaLandmark />, side: -1, baseZ: 55 },
    { id: 'turf', title: 'KickOff Pro 7v7 AstroTurf BKC', category: 'SPORTS', city: 'Mumbai', price: '₹1,200/hour', component: <SportsArenaLandmark />, side: 1, baseZ: 85 },
    { id: 'restaurant', title: 'Spice Symphony Fine Dine', category: 'RESTAURANT', city: 'Delhi', price: '₹1,800 for two', component: <RestaurantLandmark />, side: -1, baseZ: 115 },
    { id: 'airport', title: 'Flight AI-804 Mumbai -> Delhi', category: 'TRANSPORT', city: 'Mumbai', price: '₹4,200/seat', component: <AirportLandmark />, side: 1, baseZ: 145 }
  ], []);

  const [landmarkOffsets, setLandmarkOffsets] = useState(landmarkData.map(l => l.baseZ));
  const LOOP_LENGTH = 150;

  useFrame((state, delta) => {
    if (!isDriving) return;

    const shift = speed * delta * 14;

    // Shift landmark positions backwards
    setLandmarkOffsets(prevOffsets => {
      const next = prevOffsets.map(z => {
        let newZ = z - shift;
        if (newZ < -25) {
          newZ += LOOP_LENGTH;
        }
        return newZ;
      });

      // Detect which landmark is currently closest to the bus (Z between -4 and 8)
      let closestIdx = -1;
      let minDistance = 999;
      next.forEach((z, idx) => {
        const dist = Math.abs(z - 1.5);
        if (dist < 10 && dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      if (closestIdx !== -1 && onLandmarkDetected) {
        onLandmarkDetected(landmarkData[closestIdx]);
      }

      return next;
    });

    // Move road stripe texture illusion
    roadZRef.current = (roadZRef.current - shift) % 10;
  });

  return (
    <group>
      {/* 1. Endless Highway Pavement */}
      <mesh position={[0, -0.01, 20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.5, 180]} />
        <meshStandardMaterial color="#090d16" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Road Shoulder / Curbs (Left & Right) */}
      <mesh position={[-3.8, 0.05, 20]}>
        <boxGeometry args={[0.3, 0.12, 180]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>
      <mesh position={[3.8, 0.05, 20]}>
        <boxGeometry args={[0.3, 0.12, 180]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      {/* Center Dashed White Lines */}
      {Array.from({ length: 25 }).map((_, i) => {
        const zPos = ((i * 7 + roadZRef.current) % 170) - 15;
        return (
          <mesh key={i} position={[0, 0.01, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.18, 3.2]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
          </mesh>
        );
      })}

      {/* Roadside Green Verge / Terrain */}
      <mesh position={[-16, -0.05, 20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 180]} />
        <meshStandardMaterial color="#04121a" roughness={1} />
      </mesh>
      <mesh position={[16, -0.05, 20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[24, 180]} />
        <meshStandardMaterial color="#04121a" roughness={1} />
      </mesh>

      {/* Street Lamps along the highway */}
      {Array.from({ length: 10 }).map((_, i) => {
        const zPos = ((i * 18 + roadZRef.current) % 170) - 15;
        return (
          <group key={i} position={[4.4, 0, zPos]}>
            <mesh position={[0, 2.2, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 4.4]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
            <mesh position={[-0.4, 4.4, 0]}>
              <boxGeometry args={[0.8, 0.1, 0.2]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            <mesh position={[-0.7, 4.3, 0]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color="#38bdf8" emissive="#00f2fe" emissiveIntensity={3} />
            </mesh>
            <pointLight position={[-0.7, 4.0, 0]} intensity={1.8} distance={8} color="#38bdf8" />
          </group>
        );
      })}

      {/* Passing Landmarks Instances along road */}
      {landmarkData.map((l, idx) => {
        const currentZ = landmarkOffsets[idx];
        const posX = l.side * 7.2;
        return (
          <group key={l.id} position={[posX, 0, currentZ]}>
            {l.component}
          </group>
        );
      })}
    </group>
  );
}

// 8. CAMERA CONTROLLER
function CameraRig({ cameraMode }) {
  useFrame((state) => {
    if (cameraMode === 'chase') {
      // Dynamic Chase Cam: Positioned behind and above the cruising bus
      state.camera.position.lerp(new THREE.Vector3(2.4, 3.2, -6.2), 0.08);
      state.camera.lookAt(0, 1.2, 8.0);
    } else if (cameraMode === 'hood') {
      // Front Cockpit / Windshield Road Cam
      state.camera.position.lerp(new THREE.Vector3(0, 1.4, 2.0), 0.1);
      state.camera.lookAt(0, 1.2, 25.0);
    }
  });

  return null;
}

// 9. MAIN CITY TOUR 3D CANVAS COMPONENT
export default function CityTour3DScene({ speed = 1.0, isDriving = true, cameraMode = 'chase', onLandmarkChange }) {
  return (
    <Canvas
      camera={{ position: [2.4, 3.2, -6.2], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
      className="cursor-grab active:cursor-grabbing w-full h-full"
    >
      {/* Ambient & Atmospheric Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[15, 20, 10]} intensity={1.5} color="#93c5fd" />
      <directionalLight position={[-15, 10, -10]} intensity={0.8} color="#a855f7" />

      {/* Gentle Distant Fog to give highway horizon depth */}
      <fog attach="fog" args={['#020617', 25, 95]} />

      {/* The Central Bus */}
      <LuxuryBus speed={speed} isDriving={isDriving} />

      {/* The Scrolling Roadway & Passing Landmarks */}
      <MovingWorld speed={speed} isDriving={isDriving} onLandmarkDetected={onLandmarkChange} />

      {/* Camera Rig (Handles Chase vs Hood vs Orbit) */}
      {cameraMode !== 'orbit' ? (
        <CameraRig cameraMode={cameraMode} />
      ) : (
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3.5}
          maxDistance={18}
          maxPolarAngle={Math.PI / 2.05}
          dampingFactor={0.05}
        />
      )}
    </Canvas>
  );
}
