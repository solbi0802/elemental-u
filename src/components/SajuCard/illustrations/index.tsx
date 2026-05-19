import type { ReactElement } from 'react';
import type { Element } from '@/lib/saju/types';
import { WoodIllustration } from './WoodIllustration';
import { FireIllustration } from './FireIllustration';
import { EarthIllustration } from './EarthIllustration';
import { MetalIllustration } from './MetalIllustration';
import { WaterIllustration } from './WaterIllustration';

/* Maps each Five-Elements dominant value to the matching folk-art motif.
   Kept as a typed object so adding a new variant requires updating both
   the Element union and this map — typescript will scream if either drifts. */
const ILLUSTRATION_BY_ELEMENT: Record<
  Element,
  (props: { size?: number }) => ReactElement
> = {
  wood: WoodIllustration,
  fire: FireIllustration,
  earth: EarthIllustration,
  metal: MetalIllustration,
  water: WaterIllustration,
};

export function ElementIllustration({
  element,
  size,
}: {
  element: Element;
  size?: number;
}) {
  const Component = ILLUSTRATION_BY_ELEMENT[element];
  return <Component size={size} />;
}

export {
  WoodIllustration,
  FireIllustration,
  EarthIllustration,
  MetalIllustration,
  WaterIllustration,
};
