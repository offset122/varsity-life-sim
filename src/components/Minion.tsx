import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MinionProps {
  position?: [number, number, number];
  scale?: number;
  isPlayer?: boolean;
  skinColor?: string;
}

const MinionModel: React.FC<{ scale: number; isMoving?: boolean; isPlayer?: boolean; skinColor?: string }> = ({ scale, isMoving, isPlayer, skinColor }) => {
  const group = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Mesh>(null);
  const rightLeg = useRef<THREE.Mesh>(null);

  // Optimized but enhanced materials for the main world
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: skinColor || "#fbbf24", 
    roughness: 0.4, 
    metalness: 0.1 
  }), [skinColor]);

  const denimMat = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: "#2563eb", 
    roughness: 0.8 
  }), []);

  useFrame((state) => {
    if (!group.current) return;
    
    // Idle Bobbing
    group.current.position.y = Math.sin(state.clock.elapsedTime * 4) * 0.05;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 6) * 0.03;
    
    // Walk Animation
    if (isMoving && leftLeg.current && rightLeg.current) {
      const t = state.clock.elapsedTime * 12;
      leftLeg.current.position.z = Math.sin(t) * 0.25;
      rightLeg.current.position.z = Math.sin(t + Math.PI) * 0.25;
    } else if (leftLeg.current && rightLeg.current) {
      leftLeg.current.position.z = 0;
      rightLeg.current.position.z = 0;
    }
  });

  return (
    <group ref={group} scale={[scale, scale, scale]}>
      {/* Body */}
      <mesh castShadow material={skinMat}>
        <capsuleGeometry args={[0.5, 1, 16, 32]} />
      </mesh>

      {/* Overalls */}
      <mesh position={[0, -0.4, 0]} castShadow material={denimMat}>
        <cylinderGeometry args={[0.52, 0.52, 0.65, 32]} />
      </mesh>
      
      {/* Straps */}
      <mesh position={[0.3, 0.15, 0]} rotation={[0, 0, Math.PI / 4]} material={denimMat}>
        <boxGeometry args={[0.15, 0.8, 0.05]} />
      </mesh>
      <mesh position={[-0.3, 0.15, 0]} rotation={[0, 0, -Math.PI / 4]} material={denimMat}>
        <boxGeometry args={[0.15, 0.8, 0.05]} />
      </mesh>

      {/* Goggle Strap */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.53, 0.53, 0.2, 32]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      {/* Eyes */}
      <group position={[0, 0.5, 0]}>
        {[-0.2, 0.2].map((x, i) => (
          <group key={i} position={[x, 0, 0.45]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.18, 0.04, 16, 32]} />
              <meshStandardMaterial color="#94a3b8" metalness={1} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, -0.02]}>
              <sphereGeometry args={[0.16, 16, 16]} />
              <meshStandardMaterial color="white" />
            </mesh>
            <mesh position={[0, 0, 0.1]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="black" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Arms */}
      <mesh position={[0.65, 0, 0]} rotation={[0, 0, -0.5]} material={skinMat}>
        <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
      </mesh>
      <mesh position={[-0.65, 0, 0]} rotation={[0, 0, 0.5]} material={skinMat}>
        <capsuleGeometry args={[0.08, 0.4, 8, 16]} />
      </mesh>

      {/* Gloves */}
      <mesh position={[0.85, -0.2, 0]}>
        <sphereGeometry args={[0.12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      <mesh position={[-0.85, -0.2, 0]}>
        <sphereGeometry args={[0.12]} />
        <meshStandardMaterial color="#111827" />
      </mesh>

      {/* Boots */}
      <mesh ref={leftLeg} position={[0.2, -0.85, 0]} castShadow>
        <boxGeometry args={[0.3, 0.35, 0.45]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh ref={rightLeg} position={[-0.2, -0.85, 0]} castShadow>
        <boxGeometry args={[0.3, 0.35, 0.45]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
};

const Minion: React.FC<MinionProps> = ({ position = [0, 1, 0], scale = 1.3, isPlayer, skinColor }) => {
  return (
    <group position={position}>
      <MinionModel scale={scale} isPlayer={isPlayer} skinColor={skinColor} />
    </group>
  );
};

export default Minion;
export { MinionModel };