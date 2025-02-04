'use client';

import { Environment, OrbitControls, Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { useCustomizerControls } from './context';
import { asImageSrc } from '@prismicio/client';
import { Skateboard } from '@/components/Skateboard';

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
  const { selectedWheel, selectedDeck, selectedTruck, selectedBolt } =
    useCustomizerControls();

  const wheelTextureURL =
    asImageSrc(selectedWheel?.texture) ?? DEFAULT_WHEEL_TEXTURE;
  const deckTextureURL =
    asImageSrc(selectedDeck?.texture) ?? DEFAULT_DECK_TEXTURE;
  const truckColor = selectedTruck?.color ?? DEFAULT_TRUCK_COLOR;
  const boltColor = selectedBolt?.color ?? DEFAULT_BOLT_COLOR;

  return (
    <Canvas>
      <Suspense fallback={null}>
        <Skateboard
          deckTextureUrl={deckTextureURL}
          deckTextureUrls={deckTextureURLs}
          wheelTextureUrl={wheelTextureURL}
          wheelTextureUrls={wheelTextureURLs}
          truckColor={truckColor}
          boltColor={boltColor}
          pose="side"
        />
        <OrbitControls />
        <Environment preset="apartment" />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default Preview;
