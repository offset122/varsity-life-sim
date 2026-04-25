import React, { useState, useRef, useMemo, Suspense } from 'react';
import { 
  Environment, 
  ContactShadows, 
  Sky, 
  Stars, 
  BakeShadows, 
  useCursor,
  Float,
  Text,
  PerspectiveCamera,
  SoftShadows
} from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Player from './Player';
import Minion from './Minion';
import BuildingGhost from './BuildingGhost';
import { Building, Vehicle } from '../types/game';

interface ExperienceProps {
  buildings: Building[];
  onPlaceBuilding: (pos: [number, number, number]) => void;
  activeBuildingType: string | null;
  isDriving: boolean;
  currentVehicle: Vehicle | null;
  onExitVehicle: () => void;
  currentSkin: string;
}

const Town: React.FC<{ buildings: Building[] }> = ({ buildings }) => {
  return (
    <group>
      {/* Enhanced Ground with more detail */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Primary Grid for City Layout */}
      <gridHelper args={[1000, 100, "#334155", "#0f172a"]} position={[0, 0.05, 0]} />

      {/* Decorative Outer City Scenery */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 150 + Math.random() * 50;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const height = 15 + Math.random() * 25;
        
        return (
          <group key={`bg-building-${i}`} position={[x, 0, z]}>
            <mesh castShadow position={[0, height / 2, 0]}>
              <boxGeometry args={[15, height, 15]} />
              <meshStandardMaterial color="#334155" roughness={0.5} />
            </mesh>
            {/* Windows */}
            {[...Array(5)].map((_, j) => (
              <mesh key={j} position={[0, (j + 1) * (height / 6), 7.6]}>
                <boxGeometry args={[10, 1, 0.1]} />
                <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Static Central Hub Buildings */}
      {Array.from({ length: 15 }).map((_, i) => {
        const row = Math.floor(i / 5);
        const col = i % 5;
        const x = col * 50 - 100;
        const z = row * -50 - 40;
        const height = 12 + Math.random() * 10;
        const color = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'][i % 5];
        
        return (
          <group key={`static-${i}`} position={[x, 0, z]}>
            <mesh castShadow position={[0, height / 2, 0]}>
              <boxGeometry args={[20, height, 20]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            <mesh castShadow position={[0, height + 5, 0]}>
              <coneGeometry args={[15, 10, 4]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          </group>
        );
      })}

      {/* User Placed Buildings */}
      {buildings.map((b) => (
        <group key={b.id} position={b.position}>
          <mesh castShadow position={[0, 5, 0]}>
            <boxGeometry args={[14, 10, 14]} />
            <meshStandardMaterial 
              color={
                b.type === 'house' ? '#f87171' : 
                b.type === 'lab' ? '#60a5fa' : 
                b.type === 'factory' ? '#34d399' : '#a78bfa'
              } 
            />
          </mesh>
          <mesh castShadow position={[0, 14, 0]}>
             <coneGeometry args={[11, 8, 4]} />
             <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}

      {/* Street Lamps for Night Lighting */}
      {[-60, 0, 60].map((x) => (
        [20, -40, -100, -160].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <mesh position={[0, 5, 0]}>
              <cylinderGeometry args={[0.2, 0.3, 10]} />
              <meshStandardMaterial color="#020617" />
            </mesh>
            <mesh position={[0, 10, 0]}>
              <sphereGeometry args={[0.8]} />
              <meshStandardMaterial color="#fef08a" emissive="#fcd34d" emissiveIntensity={5} />
            </mesh>
            <pointLight position={[0, 10, 0]} intensity={50} color="#fcd34d" distance={40} />
          </group>
        ))
      ))}
    </group>
  );
};

const Experience: React.FC<ExperienceProps> = ({ 
  buildings, 
  onPlaceBuilding, 
  activeBuildingType, 
  isDriving, 
  currentVehicle,
  onExitVehicle,
  currentSkin
}) => {
  const [hoveredPos, setHoveredPos] = useState<[number, number, number] | null>(null);
  const { raycaster, mouse, camera, scene } = useThree();

  useCursor(!!activeBuildingType);

  useFrame(() => {
    if (activeBuildingType) {
      raycaster.setFromCamera(mouse, camera);
      // We only intersect with the floor/ground for placement
      const intersects = raycaster.intersectObjects(scene.children, true);
      const ground = intersects.find(i => i.object.type === 'Mesh' && Math.abs(i.point.y) < 0.5);
      if (ground) {
        // Snap to grid
        const snappedX = Math.round(ground.point.x / 10) * 10;
        const snappedZ = Math.round(ground.point.z / 10) * 10;
        setHoveredPos([snappedX, 5, snappedZ]);
      }
    }
  });

  return (
    <>
      {/* Background and Atmosphere */}
      <color attach="background" args={["#111827"]} />
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <Stars radius={150} depth={50} count={7000} factor={4} saturation={0.5} fade speed={1} />
      <Environment preset="city" />
      <fog attach="fog" args={["#111827", 30, 250]} />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[50, 100, 50]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-200}
        shadow-camera-right={200}
        shadow-camera-top={200}
        shadow-camera-bottom={-200}
      />

      <Suspense fallback={null}>
        <Town buildings={buildings} />
        
        {/* Interaction Surface for building placement */}
        {activeBuildingType && (
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, 0.1, 0]} 
            visible={false}
            onClick={(e) => {
              e.stopPropagation();
              if (hoveredPos) {
                onPlaceBuilding([hoveredPos[0], 0, hoveredPos[2]]);
              }
            }}
          >
            <planeGeometry args={[1000, 1000]} />
          </mesh>
        )}

        {activeBuildingType && hoveredPos && (
          <BuildingGhost type={activeBuildingType} position={hoveredPos} />
        )}
        
        {isDriving && currentVehicle ? (
           <VehicleEntity type={currentVehicle.type} onExit={onExitVehicle} />
        ) : (
           <Player skin={currentSkin} />
        )}

        {/* Ambient Minions populating the town */}
        <Minion position={[25, 1, -20]} />
        <Minion position={[-45, 1, -50]} />
        <Minion position={[70, 1, -80]} />
        <Minion position={[-60, 1, -15]} />
        <Minion position={[10, 1, -110]} />
        <Minion position={[-15, 1, 30]} />
        <Minion position={[80, 1, 10]} />
        
        <ContactShadows opacity={0.4} scale={200} blur={2} far={40} />
        <SoftShadows size={25} samples={10} focus={0} />
        <BakeShadows />
      </Suspense>
    </>
  );
};

// Enhanced Vehicle representation with improved controls
const VehicleEntity: React.FC<{ type: string, onExit: () => void }> = ({ type, onExit }) => {
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [velocity, setVelocity] = useState(0);
  const rotation = useRef(0);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Fake physics for vehicle
    const targetSpeed = 0.8;
    setVelocity(v => THREE.MathUtils.lerp(v, targetSpeed, 0.05));
    
    // Move forward based on its own rotation
    ref.current.position.x += Math.sin(rotation.current) * velocity;
    ref.current.position.z += Math.cos(rotation.current) * velocity;
    
    // Subtle rotation over time to orbit the town
    rotation.current += 0.005;
    ref.current.rotation.y = rotation.current;

    // Follow Camera
    const cameraOffset = new THREE.Vector3(
      -Math.sin(rotation.current) * 25, 
      12, 
      -Math.cos(rotation.current) * 25
    );
    const targetCamPos = ref.current.position.clone().add(cameraOffset);
    camera.position.lerp(targetCamPos, 0.1);
    camera.lookAt(ref.current.position.clone().add(new THREE.Vector3(0, 2, 0)));
  });

  return (
    <group ref={ref} position={[0, 2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[4, 2, 8]} />
        <meshStandardMaterial color={type === 'rocket' ? '#3b82f6' : '#facc15'} metalness={0.6} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.5, 1.5]} castShadow>
         <boxGeometry args={[3.5, 1.2, 4]} />
         <meshStandardMaterial color="#94a3b8" transparent opacity={0.7} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Thrust effect for rockets */}
      {type === 'rocket' && (
        <mesh position={[0, 0, -4.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1, 0, 3]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={5} transparent opacity={0.6} />
        </mesh>
      )}

      {/* Wheels */}
      {[[-2.1, -1, 2.5], [2.1, -1, 2.5], [-2.1, -1, -2.5], [2.1, -1, -2.5]].map((pos, i) => (
        <mesh key={i} position={pos as any} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.2, 1.2, 0.8, 16]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}

      {/* Driver Seat Area */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2, 0.1, 2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
    </group>
  );
};

export default Experience;