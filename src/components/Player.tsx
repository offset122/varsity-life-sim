import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useKeyboardControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { MinionModel } from './Minion';
import { useSound } from '../context/SoundContext';

interface PlayerProps {
  skin?: string;
}

const Player: React.FC<PlayerProps> = ({ skin = 'classic' }) => {
  const { camera, scene } = useThree();
  const [, getKeys] = useKeyboardControls();
  const { playSFX } = useSound();
  const group = useRef<THREE.Group>(null);
  
  // State and Refs for Physics
  const [isMoving, setIsMoving] = useState(false);
  const [interactionPrompt, setInteractionPrompt] = useState<string | null>(null);
  
  const position = useRef(new THREE.Vector3(0, 1, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const isGrounded = useRef(true);

  // Constants
  const SPEED = 16;
  const ACCELERATION = 90;
  const FRICTION = 12;
  const GRAVITY = -35;
  const JUMP_FORCE = 15;

  const skinColor = 
    skin === 'purple' ? '#9333ea' : 
    skin === 'fireman' ? '#ef4444' : 
    skin === 'king' ? '#ca8a04' : 
    skin === 'ninja' ? '#1e293b' : '#facc15';

  useFrame((state, delta) => {
    if (!group.current) return;

    const { forward, backward, left, right, jump, interact } = getKeys();
    
    // 1. Movement Logic
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward));
    const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0);

    direction.subVectors(frontVector, sideVector).normalize();

    // Align direction with camera view (only Y rotation)
    const camRotation = new THREE.Euler(0, camera.rotation.y, 0);
    direction.applyEuler(camRotation);

    // Apply Acceleration
    if (direction.lengthSq() > 0) {
      velocity.current.x += direction.x * ACCELERATION * delta;
      velocity.current.z += direction.z * ACCELERATION * delta;
      setIsMoving(true);
      
      // Target rotation based on movement direction
      const targetRotation = Math.atan2(direction.x, direction.z);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation, 0.2);
    } else {
      setIsMoving(false);
    }

    // Apply Friction (Horizontal)
    if (isGrounded.current) {
      velocity.current.x = THREE.MathUtils.lerp(velocity.current.x, 0, FRICTION * delta);
      velocity.current.z = THREE.MathUtils.lerp(velocity.current.z, 0, FRICTION * delta);
    }

    // Limit Max Horizontal Speed
    const horizontalVel = new THREE.Vector2(velocity.current.x, velocity.current.z);
    if (horizontalVel.length() > SPEED) {
      horizontalVel.setLength(SPEED);
      velocity.current.x = horizontalVel.x;
      velocity.current.z = horizontalVel.y;
    }

    // 2. Vertical Physics (Gravity & Jump)
    if (!isGrounded.current) {
      velocity.current.y += GRAVITY * delta;
    }

    if (jump && isGrounded.current) {
      velocity.current.y = JUMP_FORCE;
      isGrounded.current = false;
      playSFX('jump');
    }

    // 3. Collision and Position Update
    position.current.x += velocity.current.x * delta;
    position.current.y += velocity.current.y * delta;
    position.current.z += velocity.current.z * delta;

    // Simple Ground Check (Floor at y=0, character height is ~1.5)
    if (position.current.y <= 1) {
      position.current.y = 1;
      velocity.current.y = 0;
      isGrounded.current = true;
    } else {
      isGrounded.current = false;
    }

    // Apply to 3D Group
    group.current.position.copy(position.current);

    // 4. Interaction Proximity Detection
    let closestObject = null;
    let minDistance = 5;
    
    // Check for nearby group/mesh objects that are not the player
    scene.children.forEach(child => {
      if (child !== group.current && (child.type === 'Group' || child.type === 'Mesh') && child.position.y > -0.5) {
        const dist = child.position.distanceTo(position.current);
        if (dist < minDistance) {
          minDistance = dist;
          closestObject = child;
        }
      }
    });

    if (closestObject) {
       setInteractionPrompt("Press E to Interact");
       if (interact) {
         playSFX('click');
         // We could trigger specific logic here based on the object's metadata if available
       }
    } else {
       setInteractionPrompt(null);
    }

    // 5. Camera Follow (Smooth Third Person)
    const cameraOffset = new THREE.Vector3(0, 12, 24);
    const targetCameraPos = position.current.clone().add(cameraOffset);
    camera.position.lerp(targetCameraPos, 0.1);
    camera.lookAt(position.current.clone().add(new THREE.Vector3(0, 1, 0)));
  });

  return (
    <group ref={group}>
      <MinionModel scale={1.3} isMoving={isMoving} skinColor={skinColor} isPlayer />
      
      {/* Selection Ring */}
      <mesh position={[0, -0.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.9, 32]} />
        <meshBasicMaterial color={skinColor} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating Prompt UI */}
      {interactionPrompt && (
        <Float speed={4} rotationIntensity={0.1} floatIntensity={0.5}>
          <Text
            position={[0, 4.5, 0]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#000000"
          >
            {interactionPrompt}
          </Text>
        </Float>
      )}

      {/* Point light localized on player for visibility */}
      <pointLight position={[0, 4, 0]} intensity={15} color={skinColor} distance={15} />
    </group>
  );
};

export default Player;