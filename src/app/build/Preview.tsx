'use client';

import { Skateboard } from '@/components/Skateboard';
import { asImageSrc } from '@prismicio/client';
import {
  CameraControls,
  Environment,
  Preload,
  useTexture,
} from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import { useCustomizerControls } from './context';
import * as THREE from 'three';

const DEFAULT_WHEEL_TEXTURE = '/skateboard/SkateWheel1.png';
const DEFAULT_DECK_TEXTURE = '/skateboard/Deck.webp';
const DEFAULT_TRUCK_COLOR = '#6f6e6a';
const DEFAULT_BOLT_COLOR = '#6f6e6a';
const DEFAULT_ENVIRONMENT_COLOR = '#3b3a3a';

type Props = {
  wheelTextureURLs: string[];
  deckTextureURLs: string[];
};

const Preview = ({ wheelTextureURLs, deckTextureURLs }: Props) => {
  const cameraControlsRef = useRef<CameraControls>(null);
  const floorRef = useRef<THREE.Mesh>(null);

  const { selectedWheel, selectedDeck, selectedTruck, selectedBolt } =
    useCustomizerControls();

  const wheelTextureURL =
    asImageSrc(selectedWheel?.texture) ?? DEFAULT_WHEEL_TEXTURE;
  const deckTextureURL =
    asImageSrc(selectedDeck?.texture) ?? DEFAULT_DECK_TEXTURE;
  const truckColor = selectedTruck?.color ?? DEFAULT_TRUCK_COLOR;
  const boltColor = selectedBolt?.color ?? DEFAULT_BOLT_COLOR;

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(0, 0.3, 0),
      new THREE.Vector3(1.5, 0.8, 0)
    );
  }, [selectedDeck]);

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.12, 0.29, 0.57),
      new THREE.Vector3(0.1, 0.25, 0.9)
    );
  }, [selectedTruck]);

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.08, 0.54, 0.64),
      new THREE.Vector3(0.09, 1, 0.9)
    );
  }, [selectedWheel]);

  useEffect(() => {
    setCameraControls(
      new THREE.Vector3(-0.25, 0.3, 0.62),
      new THREE.Vector3(-0.5, 0.35, 0.8)
    );
  }, [selectedBolt]);

  function setCameraControls(target: THREE.Vector3, pos: THREE.Vector3) {
    if (!cameraControlsRef.current) return;

    cameraControlsRef.current.setTarget(target.x, target.y, target.z, true);
    cameraControlsRef.current.setPosition(pos.x, pos.y, pos.z, true);
  }

  function onCameraControlStart() {
    if (
      !cameraControlsRef.current ||
      !floorRef.current ||
      cameraControlsRef.current.colliderMeshes.length > 0
    )
      return;

    cameraControlsRef.current.colliderMeshes = [floorRef.current];
  }

  return (
    <Canvas shadows camera={{ position: [2.5, 1, 0], fov: 50 }}>
      <Suspense fallback={null}>
        <Environment
          files={'/hdr/warehouse-512.hdr'}
          environmentIntensity={0.6}
        />
        <directionalLight
          castShadow
          lookAt={[0, 0, 0]}
          position={[1, 1, 1]}
          intensity={1.6}
        />
        <fog attach="fog" args={[DEFAULT_ENVIRONMENT_COLOR, 3, 10]} />
        <color attach="background" args={[DEFAULT_ENVIRONMENT_COLOR]} />
        <StageFloor />

        <mesh rotation={[-Math.PI / 2, 0, 0]} ref={floorRef}>
          <planeGeometry args={[6, 6]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        <Skateboard
          deckTextureUrl={deckTextureURL}
          deckTextureUrls={deckTextureURLs}
          wheelTextureUrl={wheelTextureURL}
          wheelTextureUrls={wheelTextureURLs}
          truckColor={truckColor}
          boltColor={boltColor}
          pose="side"
        />
        <CameraControls
          ref={cameraControlsRef}
          maxDistance={4}
          minDistance={0.2}
          onStart={onCameraControlStart}
        />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default Preview;

function StageFloor() {
  const normalMap = useTexture('/concrete-normal.avif');
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(30, 30);
  normalMap.anisotropy = 8;

  const material = new THREE.MeshStandardMaterial({
    roughness: 0.75,
    color: DEFAULT_ENVIRONMENT_COLOR,
    normalMap,
  });

  return (
    <mesh
      castShadow
      receiveShadow
      position={[0, -0.005, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={material}
    >
      <circleGeometry args={[20, 32]} />
    </mesh>
  );
}
