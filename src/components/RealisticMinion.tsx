import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshPhysicalMaterial, Group, Mesh, CapsuleGeometry, SphereGeometry, CylinderGeometry, TorusGeometry, BoxGeometry } from 'three';
import { Float, Text, MeshDistortMaterial } from '@react-three/drei';

interface RealisticMinionProps {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
  detailLevel?: 'high' | 'low';
}

const RealisticMinion: React.FC<RealisticMinionProps> = ({ 
  position = [0, 0, 0], 
  scale = 1, 
  rotation = [0, 0, 0],
  detailLevel = 'high'
}) => {
  const group = useRef<Group>(null);
  const segments = detailLevel === 'high' ? 64 : 32;

  // Materials with Subsurface Scattering and AO simulation
  const skinMaterial = useMemo(() => new MeshPhysicalMaterial({
    color: "#fbbf24",
    metalness: 0.1,
    roughness: 0.35,
    transmission: 0.1, // Slight light penetration
    thickness: 1.5,   // For SSS depth
    attenuationColor: "#f59e0b", // Warm inside glow
    attenuationDistance: 0.5,
    sheen: 1.0,
    sheenColor: "#fbbf24",
    sheenRoughness: 0.2,
    clearcoat: 0.1,
    clearcoatRoughness: 0.1,
  }), []);

  const denimMaterial = useMemo(() => new MeshPhysicalMaterial({
    color: "#1d4ed8",
    roughness: 0.8,
    metalness: 0.0,
    sheen: 0.5,
    sheenColor: "#60a5fa",
  }), []);

  const metalMaterial = useMemo(() => new MeshPhysicalMaterial({
    color: "#94a3b8",
    metalness: 1.0,
    roughness: 0.15,
    clearcoat: 1.0,
  }), []);

  const eyeWhiteMaterial = useMemo(() => new MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: 0.1,
    clearcoat: 1.0,
  }), []);

  const blackMaterial = useMemo(() => new MeshPhysicalMaterial({
    color: "#111827",
    roughness: 0.2,
  }), []);

  useFrame((state) => {
    if (!group.current) return;
    // Gentle floating/breathing animation for "realism"
    group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    group.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });

  return (
    <group ref={group} position={position} scale={[scale, scale, scale]} rotation={rotation}>
      {/* Main Body with SSS */}
      <mesh castShadow receiveShadow material={skinMaterial}>
        <capsuleGeometry args={[0.5, 1, 16, segments]} />
      </mesh>

      {/* Overalls */}
      <group position={[0, -0.4, 0]}>
        <mesh castShadow receiveShadow material={denimMaterial}>
          <cylinderGeometry args={[0.52, 0.52, 0.65, segments]} />
        </mesh>
        
        {/* Straps */}
        <mesh position={[0.3, 0.55, 0]} rotation={[0, 0, Math.PI / 4]} material={denimMaterial}>
          <boxGeometry args={[0.12, 0.9, 0.05]} />
        </mesh>
        <mesh position={[-0.3, 0.55, 0]} rotation={[0, 0, -Math.PI / 4]} material={denimMaterial}>
          <boxGeometry args={[0.12, 0.9, 0.05]} />
        </mesh>
        
        {/* Pocket */}
        <mesh position={[0, 0, 0.48]} material={denimMaterial}>
          <boxGeometry args={[0.25, 0.2, 0.05]} />
        </mesh>
      </group>

      {/* Goggles & Eyes */}
      <group position={[0, 0.5, 0]}>
        {/* Head Strap */}
        <mesh material={blackMaterial}>
          <cylinderGeometry args={[0.53, 0.53, 0.18, segments]} />
        </mesh>

        {/* Eyes Showcase */}
        {[-0.22, 0.22].map((x, i) => (
          <group key={i} position={[x, 0, 0.45]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={metalMaterial}>
              <torusGeometry args={[0.18, 0.05, 16, 32]} />
            </mesh>
            <mesh position={[0, 0, -0.02]} material={eyeWhiteMaterial}>
              <sphereGeometry args={[0.16, 32, 32]} />
            </mesh>
            <mesh position={[0, 0, 0.11]} material={blackMaterial}>
              <sphereGeometry args={[0.04, 16, 16]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Arms & Hands */}
      {[1, -1].map((side) => ( side === 1 ? (
        <group key={side} position={[0.6, 0, 0]} rotation={[0, 0, -0.4]}>
          <mesh material={skinMaterial}>
            <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
          </mesh>
          <mesh position={[0.2, -0.3, 0]} material={blackMaterial}>
            <sphereGeometry args={[0.12]} />
          </mesh>
        </group>
      ) : (
        <group key={side} position={[-0.6, 0, 0]} rotation={[0, 0, 0.4]}>
          <mesh material={skinMaterial}>
            <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
          </mesh>
          <mesh position={[-0.2, -0.3, 0]} material={blackMaterial}>
            <sphereGeometry args={[0.12]} />
          </mesh>
        </group>
      )))}

      {/* Boots */}
      <mesh position={[0.22, -0.9, 0]} material={blackMaterial}>
        <boxGeometry args={[0.28, 0.3, 0.45]} />
      </mesh>
      <mesh position={[-0.22, -0.9, 0]} material={blackMaterial}>
        <boxGeometry args={[0.28, 0.3, 0.45]} />
      </mesh>

      {/* Sparse Hair (Realism touch) */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[Math.cos(i) * 0.1, 0.95, Math.sin(i) * 0.1]} rotation={[0, 0, (Math.random() - 0.5) * 0.5]}>
          <cylinderGeometry args={[0.005, 0.005, 0.2]} />
          <meshBasicMaterial color="black" />
        </mesh>
      ))}
    </group>
  );
};

export default RealisticMinion;