import React from 'react';
import { OrbitControls, Stage, PerspectiveCamera, Environment, Float, Sparkles, ContactShadows } from '@react-three/drei';
import RealisticMinion from './RealisticMinion';

const MinionShowcase: React.FC = () => {
  return (
    <group>
      <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={40} />
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.5} 
        autoRotate 
        autoRotateSpeed={0.5} 
      />
      
      <Stage intensity={0.5} environment="city" shadows={{ type: 'contact', opacity: 0.4, blur: 3 }} adjustCamera={false}>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <RealisticMinion scale={1.2} />
        </Float>
      </Stage>

      <Sparkles count={50} scale={5} size={2} speed={0.4} opacity={0.3} color="#fde047" />
      
      {/* Background decoration */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial color="#0f172a" roughness={1} />
      </mesh>

      <Environment preset="studio" blur={0.8} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-5, 10, 5]} angle={0.15} penumbra={1} intensity={2} castShadow />
    </group>
  );
};

export default MinionShowcase;