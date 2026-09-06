import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// ==========================================
// 1. REALISTIC LUXURY TRAVEL CRUISER (BUS)
// ==========================================
function RealisticLuxuryBus({ speed, isDriving }) {
  const busGroup = useRef();
  const wheelsRef = useRef([]);

  useFrame((state, delta) => {
    if (isDriving) {
      const rotSpeed = speed * delta * 14;
      wheelsRef.current.forEach(w => {
        if (w) w.rotation.x += rotSpeed;
      });

      if (busGroup.current) {
        // Natural highway suspension physics: subtle vibration & road-feel roll
        const t = state.clock.elapsedTime;
        busGroup.current.position.y = 0.65 + Math.sin(t * 11) * 0.01 + Math.sin(t * 5) * 0.006;
        busGroup.current.rotation.z = Math.sin(t * 3.5) * 0.004;
        busGroup.current.rotation.x = Math.sin(t * 7) * 0.003;
      }
    }
  });

  return (
    <group ref={busGroup} position={[0, 0.65, 0]}>
      {/* --- LOWER CHASSIS & AERODYNAMIC SKIRTING --- */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[1.72, 0.35, 5.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.7} />
      </mesh>

      {/* --- MAIN COACH BODY (Metallic Sapphire Blue Finish) --- */}
      <RoundedBox args={[1.7, 1.45, 5.6]} radius={0.16} smoothness={5} position={[0, 0.85, 0]}>
        <meshStandardMaterial
          color="#0369a1"
          metalness={0.88}
          roughness={0.18}
          envMapIntensity={1.5}
        />
      </RoundedBox>

      {/* Modern Silver Aerodynamic Accent Stripe */}
      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[1.73, 0.08, 5.4]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Cyan Neon Underglow Stripe */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[1.72, 0.04, 5.2]} />
        <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={2.5} />
      </mesh>
      <pointLight position={[0, 0.1, 0]} intensity={1.5} distance={3} color="#00f2fe" />

      {/* --- ROOF STRUCTURE & CLIMATE CONTROL UNIT --- */}
      <RoundedBox args={[1.62, 0.18, 5.4]} radius={0.08} smoothness={4} position={[0, 1.62, 0]}>
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.4} />
      </RoundedBox>
      {/* Roof AC Pod 1 */}
      <mesh position={[0, 1.78, -0.6]}>
        <boxGeometry args={[1.1, 0.16, 1.6]} />
        <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.6} />
      </mesh>
      {/* Roof AC Pod 2 */}
      <mesh position={[0, 1.76, 1.2]}>
        <boxGeometry args={[0.9, 0.14, 1.1]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* --- FRONT AERODYNAMIC FACE --- */}
      {/* Swept Curved Panoramic Windshield */}
      <mesh position={[0, 1.05, 2.76]} rotation={[-0.18, 0, 0]}>
        <boxGeometry args={[1.62, 0.95, 0.12]} />
        <meshStandardMaterial
          color="#0c4a6e"
          roughness={0.05}
          metalness={0.95}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Digital Destination Board above Windshield */}
      <mesh position={[0, 1.52, 2.68]}>
        <boxGeometry args={[1.2, 0.18, 0.06]} />
        <meshStandardMaterial color="#0284c7" emissive="#00f2fe" emissiveIntensity={2.2} />
      </mesh>

      {/* Front Chrome Radiator Grille */}
      <mesh position={[0, 0.42, 2.82]}>
        <boxGeometry args={[1.2, 0.32, 0.06]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Front Brand Emblem */}
      <mesh position={[0, 0.48, 2.86]}>
        <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#38bdf8" emissive="#00f2fe" emissiveIntensity={2} />
      </mesh>

      {/* High-Tech Projector LED Headlamps (Left & Right) */}
      {[-0.62, 0.62].map((x, i) => (
        <group key={i} position={[x, 0.45, 2.82]}>
          <mesh>
            <boxGeometry args={[0.3, 0.14, 0.06]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={4} />
          </mesh>
          {/* LED DRL Brow */}
          <mesh position={[0, 0.09, 0.01]}>
            <boxGeometry args={[0.32, 0.03, 0.05]} />
            <meshStandardMaterial color="#38bdf8" emissive="#00f2fe" emissiveIntensity={3} />
          </mesh>
          {/* Powerful Forward Headlight Beams */}
          <spotLight
            position={[0, 0, 0.2]}
            target-position={[0, -0.4, 25]}
            angle={0.45}
            penumbra={0.7}
            intensity={4.5}
            color="#e0f2fe"
            distance={26}
          />
        </group>
      ))}

      {/* Aerodynamic Side Rear-View Mirrors (Stalks & Mirrors) */}
      {[-0.96, 0.96].map((x, i) => (
        <group key={i} position={[x, 1.1, 2.5]}>
          <mesh rotation={[0, 0, x > 0 ? -0.3 : 0.3]}>
            <cylinderGeometry args={[0.025, 0.025, 0.3]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          <mesh position={[x > 0 ? 0.08 : -0.08, 0.12, 0]}>
            <boxGeometry args={[0.06, 0.32, 0.15]} />
            <meshStandardMaterial color="#0369a1" metalness={0.8} />
          </mesh>
          <mesh position={[x > 0 ? 0.05 : -0.05, 0.12, -0.07]}>
            <boxGeometry args={[0.02, 0.28, 0.02]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.98} roughness={0.05} />
          </mesh>
        </group>
      ))}

      {/* --- SIDE PRIVACY WINDOW PANELS WITH WARM INTERIOR GLOW --- */}
      {[-0.86, 0.86].map((x, i) => (
        <group key={i} position={[x, 1.05, 0.1]}>
          <mesh>
            <boxGeometry args={[0.05, 0.72, 4.6]} />
            <meshStandardMaterial
              color="#0c4a6e"
              metalness={0.9}
              roughness={0.05}
              transparent
              opacity={0.85}
            />
          </mesh>
          {[-1.6, -0.8, 0, 0.8, 1.6].map((z, pIdx) => (
            <mesh key={pIdx} position={[0.01, 0, z]}>
              <boxGeometry args={[0.06, 0.73, 0.06]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Interior Luxury Passenger Cabin Light */}
      <pointLight position={[0, 1.1, 0]} intensity={2.2} distance={4.5} color="#fef08a" />
      {[-1.5, -0.7, 0.1, 0.9, 1.7].map((z, sIdx) => (
        <group key={sIdx} position={[0, 0.75, z]}>
          <mesh position={[-0.45, 0, 0]}>
            <boxGeometry args={[0.42, 0.45, 0.35]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          <mesh position={[0.45, 0, 0]}>
            <boxGeometry args={[0.42, 0.45, 0.35]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>
      ))}

      {/* --- REAR MODERN HORIZONTAL LED LIGHTBAR & TAIL LIGHTS --- */}
      <mesh position={[0, 0.65, -2.82]}>
        <boxGeometry args={[1.5, 0.12, 0.05]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3.5} />
      </mesh>
      {[-0.65, 0.65].map((x, i) => (
        <group key={i} position={[x, 0.65, -2.83]}>
          <mesh>
            <boxGeometry args={[0.25, 0.22, 0.04]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={4} />
          </mesh>
          <mesh position={[x > 0 ? -0.1 : 0.1, -0.06, 0.01]}>
            <boxGeometry args={[0.08, 0.06, 0.04]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
          </mesh>
        </group>
      ))}
      {/* Rear Number Plate */}
      <mesh position={[0, 0.28, -2.83]}>
        <boxGeometry args={[0.48, 0.14, 0.04]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Dual Chrome Exhaust Tips */}
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.06, -2.84]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.14, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}

      {/* --- 6 HIGH-DETAIL WHEELS (Rubber Tires + Multi-Spoke Alloy Rims) --- */}
      {[
        [-0.86, 1.8], [0.86, 1.8],
        [-0.86, -1.2], [0.86, -1.2],
        [-0.86, -2.1], [0.86, -2.1]
      ].map(([x, z], idx) => (
        <group
          key={idx}
          ref={el => (wheelsRef.current[idx] = el)}
          position={[x, -0.22, z]}
        >
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.42, 0.42, 0.24, 24]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[x > 0 ? 0.02 : -0.02, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.24, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.95} roughness={0.08} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[x > 0 ? 0.12 : -0.12, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.06, 12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ==========================================
// 2. LANDMARK 1: THE AZURE BAY LUXURY RESORT
// ==========================================
function RealisticHotel() {
  return (
    <group>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[6.5, 0.4, 6.0]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      <mesh position={[0, 4.2, 0]}>
        <boxGeometry args={[4.4, 7.6, 3.8]} />
        <meshStandardMaterial color="#091424" metalness={0.85} roughness={0.15} />
      </mesh>
      {[1.6, 2.8, 4.0, 5.2, 6.4, 7.4].map((y, row) => (
        <group key={row}>
          <mesh position={[0, y, 1.95]}>
            <boxGeometry args={[4.2, 0.48, 0.18]} />
            <meshStandardMaterial
              color={row % 2 === 0 ? "#38bdf8" : "#fef08a"}
              emissive={row % 2 === 0 ? "#0284c7" : "#f59e0b"}
              emissiveIntensity={0.85}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0, y + 0.1, 2.06]}>
            <boxGeometry args={[4.25, 0.25, 0.04]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} transparent opacity={0.7} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 8.1, 0]}>
        <boxGeometry args={[3.8, 0.25, 3.2]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={2.2} />
      </mesh>
      <pointLight position={[0, 8.4, 0]} intensity={3} color="#06b6d4" distance={8} />
      <mesh position={[0, 0.9, 2.8]}>
        <boxGeometry args={[3.2, 0.15, 1.8]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} />
      </mesh>
      <pointLight position={[0, 1.1, 2.8]} intensity={3} color="#fef08a" distance={6} />
      <mesh position={[0, 8.7, 0]}>
        <boxGeometry args={[3.4, 0.65, 0.15]} />
        <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={2.5} />
      </mesh>
      {[-2.2, 2.2].map((x, i) => (
        <group key={i} position={[x, 0.4, 2.4]}>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.08, 0.14, 2.2, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.3, 0]}>
            <coneGeometry args={[0.9, 1.2, 7]} />
            <meshStandardMaterial color="#15803d" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ==========================================
// 3. LANDMARK 2: PVR INOX IMAX LASER CINEMA
// ==========================================
function RealisticCinema() {
  return (
    <group>
      <mesh position={[0, 2.8, 0]}>
        <boxGeometry args={[5.8, 5.2, 4.8]} />
        <meshStandardMaterial color="#111827" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 3.4, 2.45]}>
        <boxGeometry args={[4.8, 2.4, 0.12]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={3.2}
          roughness={0.1}
        />
      </mesh>
      <pointLight position={[0, 3.4, 3.0]} intensity={3.5} color="#8b5cf6" distance={8} />
      {[-2.2, 2.2].map((x, i) => (
        <mesh key={i} position={[x, 3.0, 2.46]}>
          <boxGeometry args={[0.08, 4.4, 0.08]} />
          <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={3} />
        </mesh>
      ))}
      <mesh position={[0, 1.1, 2.8]}>
        <boxGeometry args={[4.2, 0.2, 1.8]} />
        <meshStandardMaterial color="#7c3aed" metalness={0.8} />
      </mesh>
      <pointLight position={[0, 1.3, 3.0]} intensity={3} color="#f43f5e" distance={6} />
      <mesh position={[0, 0.08, 3.2]}>
        <boxGeometry args={[2.2, 0.04, 2.4]} />
        <meshStandardMaterial color="#dc2626" roughness={0.4} />
      </mesh>
      {[-2.0, 2.0].map((x, i) => (
        <spotLight
          key={i}
          position={[x, 5.4, 1.8]}
          target-position={[x * 3, 25, 0]}
          angle={0.25}
          penumbra={0.8}
          intensity={6}
          color="#a855f7"
          distance={35}
        />
      ))}
    </group>
  );
}

// ==========================================
// 4. LANDMARK 3: KICKOFF PRO ASTROTURF BKC
// ==========================================
function RealisticSportsArena() {
  return (
    <group>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[6.8, 0.12, 5.4]} />
        <meshStandardMaterial color="#15803d" roughness={0.85} />
      </mesh>
      {[-2.0, -0.6, 0.8, 2.2].map((x, i) => (
        <mesh key={i} position={[x, 0.13, 0]}>
          <boxGeometry args={[0.65, 0.01, 5.3]} />
          <meshStandardMaterial color="#16a34a" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[6.2, 0.01, 0.08]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.01, 24]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} wireframe />
      </mesh>
      {[-2.8, 2.8].map((x, i) => (
        <group key={i} position={[x, 0.55, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 0.9, 1.8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[x > 0 ? 0.2 : -0.2, 0, 0]}>
            <boxGeometry args={[0.3, 0.85, 1.7]} />
            <meshStandardMaterial color="#e2e8f0" wireframe transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.3} />
      </mesh>
      {[
        [-3.2, 2.4], [3.2, 2.4], [-3.2, -2.4], [3.2, -2.4]
      ].map(([x, z], idx) => (
        <group key={idx} position={[x, 0, z]}>
          <mesh position={[0, 2.4, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 4.8, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 4.8, 0]}>
            <boxGeometry args={[0.6, 0.35, 0.4]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} />
          </mesh>
          <spotLight
            position={[0, 4.8, 0]}
            target-position={[-x * 0.5, 0, -z * 0.5]}
            angle={0.7}
            penumbra={0.4}
            intensity={5.5}
            color="#f8fafc"
            distance={16}
          />
        </group>
      ))}
      <mesh position={[0, 0.45, 2.65]}>
        <boxGeometry args={[6.4, 0.5, 0.08]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

// ==========================================
// 5. LANDMARK 4: SPICE SYMPHONY GOURMET DINE
// ==========================================
function RealisticRestaurant() {
  return (
    <group>
      <mesh position={[0, 2.0, -0.8]}>
        <boxGeometry args={[5.2, 3.8, 3.4]} />
        <meshStandardMaterial color="#1c1917" roughness={0.4} />
      </mesh>
      <mesh position={[0, 4.0, -0.6]} rotation={[0.12, 0, 0]}>
        <boxGeometry args={[5.6, 0.25, 3.8]} />
        <meshStandardMaterial color="#c2410c" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.8, 0.95]}>
        <boxGeometry args={[4.4, 1.9, 0.1]} />
        <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[0, 2.0, 1.4]} intensity={2.5} color="#f59e0b" distance={6} />
      <mesh position={[0, 0.15, 1.8]}>
        <boxGeometry args={[5.4, 0.25, 3.0]} />
        <meshStandardMaterial color="#78350f" roughness={0.7} />
      </mesh>
      {[-1.6, 0, 1.6].map((x, idx) => (
        <group key={idx} position={[x, 0.28, 1.8]}>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.45, 0.45, 0.06, 16]} />
            <meshStandardMaterial color="#f8fafc" />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.45]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          <mesh position={[0, 1.6, 0]}>
            <coneGeometry args={[1.0, 0.45, 12]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} />
          </mesh>
        </group>
      ))}
      {[-2.0, -1.0, 0, 1.0, 2.0].map((x, idx) => (
        <mesh key={idx} position={[x, 2.3, 1.8]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={3} />
        </mesh>
      ))}
      <mesh position={[0, 3.2, 1.0]}>
        <boxGeometry args={[3.6, 0.55, 0.1]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

// ==========================================
// 6. LANDMARK 5: SKYPORT INTERNATIONAL TERMINAL
// ==========================================
function RealisticAirport() {
  return (
    <group>
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[7.2, 3.4, 4.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.15} />
      </mesh>
      <mesh position={[0, 1.9, 2.25]}>
        <boxGeometry args={[6.6, 2.0, 0.12]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={1.4} transparent opacity={0.88} />
      </mesh>
      <group position={[-2.8, 0, -1.2]}>
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.45, 0.6, 5.2, 12]} />
          <meshStandardMaterial color="#475569" metalness={0.8} />
        </mesh>
        <mesh position={[0, 6.3, 0]}>
          <cylinderGeometry args={[0.95, 0.7, 1.0, 12]} />
          <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={1.5} />
        </mesh>
        <pointLight position={[0, 7.0, 0]} intensity={4} color="#ef4444" distance={12} />
      </group>
      <group position={[1.8, 0.75, 3.6]} rotation={[0, -0.35, 0]} scale={[0.65, 0.65, 0.65]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.32, 3.8, 24]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4.6, 0.06, 0.9]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} />
        </mesh>
        {[-1.2, 1.2].map((x, i) => (
          <mesh key={i} position={[x, -0.28, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.8, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 0.6, -1.5]} rotation={[-0.35, 0, 0]}>
          <boxGeometry args={[0.06, 1.0, 0.6]} />
          <meshStandardMaterial color="#0369a1" metalness={0.7} />
        </mesh>
      </group>
      {[-3.0, -1.5, 0, 1.5, 3.0].map((x, i) => (
        <mesh key={i} position={[x, 0.1, 4.8]}>
          <boxGeometry args={[0.12, 0.18, 0.12]} />
          <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={4} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// 7. HIGHWAY INFRASTRUCTURE & PASSING ENGINE
// ==========================================
function HighwayWorld({ speed, isDriving, onLandmarkDetected }) {
  const roadZRef = useRef(0);

  const landmarkData = useMemo(() => [
    { id: 'hotel', title: 'The Azure Bay Cliffside Pool Villa', category: 'HOTEL', city: 'Goa', price: '₹14,000/night', component: <RealisticHotel />, side: 1, baseZ: 28 },
    { id: 'cinema', title: 'PVR INOX IMAX Laser Cinema', category: 'ENTERTAINMENT', city: 'Mumbai', price: '₹350/ticket', component: <RealisticCinema />, side: -1, baseZ: 62 },
    { id: 'turf', title: 'KickOff Pro 7v7 AstroTurf BKC', category: 'SPORTS', city: 'Mumbai', price: '₹1,200/hour', component: <RealisticSportsArena />, side: 1, baseZ: 96 },
    { id: 'restaurant', title: 'Spice Symphony Fine Dine', category: 'RESTAURANT', city: 'Delhi', price: '₹1,800 for two', component: <RealisticRestaurant />, side: -1, baseZ: 130 },
    { id: 'airport', title: 'Flight AI-804 Mumbai -> Delhi', category: 'TRANSPORT', city: 'Mumbai', price: '₹4,200/seat', component: <RealisticAirport />, side: 1, baseZ: 164 }
  ], []);

  const [landmarkOffsets, setLandmarkOffsets] = useState(landmarkData.map(l => l.baseZ));
  const LOOP_LENGTH = 170;

  useFrame((state, delta) => {
    if (!isDriving) return;

    const shift = speed * delta * 15;

    setLandmarkOffsets(prev => {
      const next = prev.map(z => {
        let newZ = z - shift;
        if (newZ < -30) {
          newZ += LOOP_LENGTH;
        }
        return newZ;
      });

      let closestIdx = -1;
      let minDistance = 999;
      next.forEach((z, idx) => {
        const dist = Math.abs(z - 1.5);
        if (dist < 12 && dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      if (closestIdx !== -1 && onLandmarkDetected) {
        onLandmarkDetected(landmarkData[closestIdx]);
      }

      return next;
    });

    roadZRef.current = (roadZRef.current - shift) % 12;
  });

  return (
    <group>
      {/* 1. Multi-Lane Asphalt Highway */}
      <mesh position={[0, -0.01, 25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.8, 200]} />
        <meshStandardMaterial color="#0b1120" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Shoulder Solid Yellow Lines */}
      <mesh position={[-4.2, 0.01, 25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.18, 200]} />
        <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={1} />
      </mesh>
      <mesh position={[4.2, 0.01, 25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.18, 200]} />
        <meshStandardMaterial color="#facc15" emissive="#eab308" emissiveIntensity={1} />
      </mesh>

      {/* Center Dashed White Lane Dividers */}
      {Array.from({ length: 28 }).map((_, i) => {
        const zPos = ((i * 7.5 + roadZRef.current) % 190) - 20;
        return (
          <mesh key={i} position={[0, 0.015, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.22, 3.8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1.8} />
          </mesh>
        );
      })}

      {/* Concrete Highway Guardrails / Jersey Barriers */}
      {[-4.6, 4.6].map((x, idx) => (
        <mesh key={idx} position={[x, 0.22, 25]}>
          <boxGeometry args={[0.35, 0.45, 200]} />
          <meshStandardMaterial color="#334155" roughness={0.8} />
        </mesh>
      ))}

      {/* Modern Arched Streetlight Gantries */}
      {Array.from({ length: 11 }).map((_, i) => {
        const zPos = ((i * 18 + roadZRef.current) % 190) - 20;
        return (
          <group key={i} position={[5.2, 0, zPos]}>
            <mesh position={[0, 2.6, 0]}>
              <cylinderGeometry args={[0.07, 0.1, 5.2]} />
              <meshStandardMaterial color="#475569" metalness={0.9} />
            </mesh>
            <mesh position={[-1.2, 5.1, 0]} rotation={[0, 0, 0.35]}>
              <boxGeometry args={[2.5, 0.08, 0.15]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            <mesh position={[-2.2, 4.8, 0]}>
              <boxGeometry args={[0.5, 0.1, 0.25]} />
              <meshStandardMaterial color="#ffffff" emissive="#00f2fe" emissiveIntensity={4} />
            </mesh>
            <pointLight position={[-2.2, 4.4, 0]} intensity={2.8} distance={11} color="#e0f2fe" />
          </group>
        );
      })}

      {/* Roadside Landscaping Verge (Grass & Trees) */}
      <mesh position={[-18, -0.04, 25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 200]} />
        <meshStandardMaterial color="#021a1a" roughness={0.95} />
      </mesh>
      <mesh position={[18, -0.04, 25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 200]} />
        <meshStandardMaterial color="#021a1a" roughness={0.95} />
      </mesh>

      {/* Distant City Skyline Skyscraper Backdrop */}
      {[-32, -26, -20, 20, 26, 32].map((x, sIdx) => {
        const height = 12 + ((sIdx * 7) % 14);
        return (
          <group key={sIdx} position={[x, height / 2, 35]}>
            <mesh>
              <boxGeometry args={[4.5, height, 4.5]} />
              <meshStandardMaterial color="#050b14" metalness={0.8} roughness={0.3} />
            </mesh>
            {Array.from({ length: 6 }).map((_, wIdx) => (
              <mesh key={wIdx} position={[0, (wIdx * 2.2) - (height / 2) + 2, 2.3]}>
                <boxGeometry args={[3.8, 0.35, 0.08]} />
                <meshStandardMaterial
                  color={wIdx % 2 === 0 ? "#38bdf8" : "#fef08a"}
                  emissive={wIdx % 2 === 0 ? "#0284c7" : "#d97706"}
                  emissiveIntensity={0.7}
                />
              </mesh>
            ))}
            <mesh position={[0, (height / 2) + 0.5, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 1.0]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3} />
            </mesh>
          </group>
        );
      })}

      {/* Passing Landmarks along Highway */}
      {landmarkData.map((l, idx) => {
        const currentZ = landmarkOffsets[idx];
        const posX = l.side * 8.4;
        return (
          <group key={l.id} position={[posX, 0, currentZ]}>
            {l.component}
          </group>
        );
      })}
    </group>
  );
}

// ==========================================
// 8. DYNAMIC CAMERA RIG
// ==========================================
function CameraRig({ cameraMode }) {
  useFrame((state) => {
    if (cameraMode === 'chase') {
      state.camera.position.lerp(new THREE.Vector3(2.6, 3.4, -7.2), 0.09);
      state.camera.lookAt(0, 1.4, 9.0);
    } else if (cameraMode === 'hood') {
      state.camera.position.lerp(new THREE.Vector3(0, 1.6, 2.4), 0.12);
      state.camera.lookAt(0, 1.4, 30.0);
    }
  });

  return null;
}

// ==========================================
// 9. MAIN CITY TOUR 3D CANVAS COMPONENT
// ==========================================
export default function CityTour3DScene({ speed = 1.0, isDriving = true, cameraMode = 'chase', onLandmarkChange }) {
  return (
    <Canvas
      camera={{ position: [2.6, 3.4, -7.2], fov: 46 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      className="cursor-grab active:cursor-grabbing w-full h-full"
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[20, 25, 15]} intensity={1.8} color="#93c5fd" />
      <directionalLight position={[-20, 15, -15]} intensity={1.1} color="#c084fc" />
      <fog attach="fog" args={['#030712', 30, 110]} />

      <RealisticLuxuryBus speed={speed} isDriving={isDriving} />
      <HighwayWorld speed={speed} isDriving={isDriving} onLandmarkDetected={onLandmarkChange} />

      {cameraMode !== 'orbit' ? (
        <CameraRig cameraMode={cameraMode} />
      ) : (
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={4.0}
          maxDistance={22}
          maxPolarAngle={Math.PI / 2.05}
          dampingFactor={0.06}
        />
      )}
    </Canvas>
  );
}
