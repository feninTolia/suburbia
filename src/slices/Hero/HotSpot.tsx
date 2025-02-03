import { Billboard } from '@react-three/drei';
import React, { useRef } from 'react';
import * as THREE from 'three';

type Props = {
  position: [number, number, number];
  isVisible: boolean;
  color?: string;
};

export const HotSpot = ({ position, isVisible, color = '#E6FC6A' }: Props) => {
  const hotSpotRef = useRef<THREE.Group>(null);

  return (
    <Billboard follow={true} position={position}>
      <mesh ref={hotSpotRef} visible={isVisible}>
        <circleGeometry args={[0.02, 32]} />
        <meshStandardMaterial color={color} transparent opacity={1} />
      </mesh>

      <mesh
        visible={isVisible}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <circleGeometry args={[0.03, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </Billboard>
  );
};
