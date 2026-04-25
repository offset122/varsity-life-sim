import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BuildingGhostProps {
  type: string;
  position: [number, number, number];
}

const BuildingGhost: React.FC<BuildingGhostProps> = ({ type, position }) => {
  const color = type === 'house' ? '#f87171' : type === 'lab' ? '#60a5fa' : type === 'factory' ? '#34d399' : '#a78bfa';
  
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[14, 10, 14]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 9, 0]}>
        <coneGeometry args={[11, 8, 4]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>
      {/* Grid line below */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.9, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshBasicMaterial color="#ffff00" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

export default BuildingGhost;