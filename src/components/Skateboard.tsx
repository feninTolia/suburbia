import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

type SkateboardProps = {
  deckTextureUrl: string;
  deckTextureUrls: string[];
  wheelTextureUrl: string;
  wheelTextureUrls: string[];
  truckColor: string;
  boltColor: string;
  constantWheelSpinning?: boolean;
  pose?: 'side' | 'upright';
};

type GLTFResult = GLTF & {
  nodes: {
    GripTape: THREE.Mesh;
    Wheel1: THREE.Mesh;
    Wheel2: THREE.Mesh;
    Deck: THREE.Mesh;
    Wheel4: THREE.Mesh;
    Bolts: THREE.Mesh;
    Wheel3: THREE.Mesh;
    Baseplates: THREE.Mesh;
    Truck1: THREE.Mesh;
    Truck2: THREE.Mesh;
  };
  materials: object; // {}
};

export function Skateboard({
  deckTextureUrls,
  deckTextureUrl,
  wheelTextureUrls,
  wheelTextureUrl,
  truckColor,
  boltColor,
  pose = 'upright',
  constantWheelSpinning = false,
}: SkateboardProps) {
  const wheelRefs = useRef<THREE.Object3D[]>([]);
  const { nodes } = useGLTF('/skateboard.gltf') as GLTFResult;

  //wheel textures
  const wheelTextures = useTexture(wheelTextureUrls);
  wheelTextures.forEach((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
  });
  const wheelTextureIndex = wheelTextureUrls.findIndex(
    (url) => url === wheelTextureUrl
  );
  const wheelTexture = wheelTextures[wheelTextureIndex];

  //deck textures
  const deckTextures = useTexture(deckTextureUrls);
  deckTextures.forEach((texture) => {
    texture.flipY = false;
    texture.colorSpace = THREE.SRGBColorSpace;
  });
  const deckTextureIndex = deckTextureUrls.findIndex(
    (url) => url === deckTextureUrl
  );
  const deckTexture = deckTextures[deckTextureIndex];

  //
  // materials
  //
  const gripTapeDiffuse = useTexture('/skateboard/griptape-diffuse.webp');
  const gripTapeRoughness = useTexture('/skateboard/griptape-roughness.webp');

  const gripTapeMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      map: gripTapeDiffuse,
      roughnessMap: gripTapeRoughness,
      bumpMap: gripTapeRoughness,
      bumpScale: 3.5,
      roughness: 0.8,
      color: '#555555',
    });

    if (gripTapeDiffuse) {
      gripTapeDiffuse.wrapS = THREE.RepeatWrapping;
      gripTapeDiffuse.wrapT = THREE.RepeatWrapping;
      gripTapeDiffuse.repeat.set(9, 9);
      gripTapeDiffuse.needsUpdate = true;

      gripTapeRoughness.wrapS = THREE.RepeatWrapping;
      gripTapeRoughness.wrapT = THREE.RepeatWrapping;
      gripTapeRoughness.repeat.set(9, 9);
      gripTapeRoughness.needsUpdate = true;

      gripTapeRoughness.anisotropy = 8;
    }

    return material;
  }, [gripTapeDiffuse, gripTapeRoughness]);

  const boltMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        metalness: 0.5,
        roughness: 0.3,
        color: boltColor,
      }),
    [boltColor]
  );

  const metalNormal = useTexture('/skateboard/metal-normal.avif');
  metalNormal.wrapS = THREE.RepeatWrapping;
  metalNormal.wrapT = THREE.RepeatWrapping;
  metalNormal.anisotropy = 8;
  metalNormal.repeat.set(8, 8);

  const truckMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        normalMap: metalNormal,
        normalScale: new THREE.Vector2(0.3, 0.3),
        metalness: 0.8,
        roughness: 0.25,
        color: truckColor,
      }),
    [metalNormal, truckColor]
  );

  const deckMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        roughness: 0.1,
        map: deckTexture,
      }),
    [deckTexture]
  );

  const wheelMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        roughness: 0.35,
        map: wheelTexture,
      }),
    [wheelTexture]
  );

  // add wheel refs
  const addToWheelsRef = (ref: THREE.Object3D | null) => {
    if (ref && !wheelRefs.current.includes(ref)) {
      wheelRefs.current.push(ref);
    }
  };

  useFrame(() => {
    if (!wheelRefs.current || !constantWheelSpinning) return;

    for (const wheel of wheelRefs.current) {
      wheel.rotation.x += 0.2;
    }
  });

  useEffect(() => {
    if (!wheelRefs.current || constantWheelSpinning) return;
    for (const wheel of wheelRefs.current) {
      gsap.to(wheel.rotation, {
        x: '-=30',
        duration: 2.5,
        ease: 'circ.out',
      });
    }
  }, [constantWheelSpinning, wheelTextureUrl]);

  const positions = useMemo(
    () =>
      ({
        upright: { rotation: [0, 0, 0], position: [0, 0, 0] },
        side: { rotation: [0, 0, Math.PI / 2], position: [0, 0.295, 0] },
      }) as const,
    []
  );

  return (
    <group
      dispose={null}
      rotation={positions[pose].rotation}
      position={positions[pose].position}
    >
      <group name="Scene">
        <mesh
          name="GripTape"
          castShadow
          receiveShadow
          geometry={nodes.GripTape.geometry}
          material={gripTapeMaterial}
          position={[0, 0.286, -0.002]}
        />
        <mesh
          name="Wheel1"
          castShadow
          receiveShadow
          geometry={nodes.Wheel1.geometry}
          material={wheelMaterial}
          position={[0.238, 0.086, 0.635]}
          ref={addToWheelsRef}
        />
        <mesh
          name="Wheel2"
          castShadow
          receiveShadow
          geometry={nodes.Wheel2.geometry}
          material={wheelMaterial}
          position={[-0.237, 0.086, 0.635]}
          ref={addToWheelsRef}
        />
        <mesh
          name="Wheel3"
          castShadow
          receiveShadow
          geometry={nodes.Wheel3.geometry}
          material={wheelMaterial}
          position={[0.237, 0.086, -0.635]}
          rotation={[Math.PI, 0, Math.PI]}
          ref={addToWheelsRef}
        />
        <mesh
          name="Wheel4"
          castShadow
          receiveShadow
          geometry={nodes.Wheel4.geometry}
          material={wheelMaterial}
          position={[-0.238, 0.086, -0.635]}
          rotation={[Math.PI, 0, Math.PI]}
          ref={addToWheelsRef}
        />
        <mesh
          name="Deck"
          castShadow
          receiveShadow
          geometry={nodes.Deck.geometry}
          material={deckMaterial}
          position={[0, 0.271, -0.002]}
        />

        <mesh
          name="Bolts"
          castShadow
          receiveShadow
          geometry={nodes.Bolts.geometry}
          material={boltMaterial}
          position={[0, 0.198, 0]}
          rotation={[Math.PI, 0, Math.PI]}
        />

        <mesh
          name="Baseplates"
          castShadow
          receiveShadow
          geometry={nodes.Baseplates.geometry}
          material={truckMaterial}
          position={[0, 0.211, 0]}
        />
        <mesh
          name="Truck1"
          castShadow
          receiveShadow
          geometry={nodes.Truck1.geometry}
          material={truckMaterial}
          position={[0, 0.101, -0.617]}
        />
        <mesh
          name="Truck2"
          castShadow
          receiveShadow
          geometry={nodes.Truck2.geometry}
          material={truckMaterial}
          position={[0, 0.101, 0.617]}
          rotation={[Math.PI, 0, Math.PI]}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/skateboard.gltf');
