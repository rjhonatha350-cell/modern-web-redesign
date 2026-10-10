import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { ExtrudeGeometry, Group, MeshStandardMaterial, Path, Shape } from 'three';
import { RoundedBox } from '@react-three/drei';
import { makeSurfaceTexture, type Finish, type ViewerPalette } from './viewer-materials';

// Bespoke extruded hollow profiles; 1 scene unit = 1 metre.
function profileGeometry(length: number, width: number, depth: number) {
  const shape = new Shape();
  shape.moveTo(-width / 2, -depth / 2); shape.lineTo(width / 2, -depth / 2);
  shape.lineTo(width / 2, depth / 2); shape.lineTo(-width / 2, depth / 2); shape.closePath();
  const hole = new Path();
  hole.moveTo(-width / 2 + 0.003, -depth / 2 + 0.003);
  hole.lineTo(-width / 2 + 0.003, depth / 2 - 0.003);
  hole.lineTo(width / 2 - 0.003, depth / 2 - 0.003);
  hole.lineTo(width / 2 - 0.003, -depth / 2 + 0.003); hole.closePath();
  shape.holes.push(hole);
  const geometry = new ExtrudeGeometry(shape, { depth: length, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.0008, bevelThickness: 0.0008 });
  geometry.translate(0, 0, -length / 2);
  return geometry;
}
function Profile({ length, width, depth, position, horizontal = false, material }: { length: number; width: number; depth: number; position: [number, number, number]; horizontal?: boolean; material: MeshStandardMaterial }) {
  const geometry = useMemo(() => profileGeometry(length, width, depth), [length, width, depth]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group position={position} rotation-x={-Math.PI / 2} rotation-y={horizontal ? Math.PI / 2 : 0}><mesh geometry={geometry} material={material} castShadow receiveShadow /></group>;
}
function Panel({ x, z, material, palette }: { x: number; z: number; material: MeshStandardMaterial; palette: ViewerPalette }) {
  const w = 1.17, h = 2.08, p = 0.048;
  return <group position={[x, 1.1, z]}>
    <Profile length={h} width={p} depth={0.046} position={[-w / 2 + p / 2, 0, 0]} material={material} />
    <Profile length={h} width={p} depth={0.046} position={[w / 2 - p / 2, 0, 0]} material={material} />
    <Profile length={w - 2 * p} width={p} depth={0.046} position={[0, h / 2 - p / 2, 0]} horizontal material={material} />
    <Profile length={w - 2 * p} width={0.074} depth={0.046} position={[0, -h / 2 + 0.037, 0]} horizontal material={material} />
    {/* Continuous glazing gasket surrounds, rather than overlays, the glass. */}
    {[-1, 1].map(side => <mesh key={`seal-v-${side}`} position={[side * (w / 2 - p - 0.003), -0.012, 0.018]}><boxGeometry args={[0.006, h - 2 * p, 0.008]} /><meshStandardMaterial color={palette.seal} roughness={0.95} /></mesh>)}
    {[-1, 1].map(side => <mesh key={`seal-h-${side}`} position={[0, side * (h / 2 - p - 0.003), 0.018]}><boxGeometry args={[w - 2 * p, 0.006, 0.008]} /><meshStandardMaterial color={palette.seal} roughness={0.95} /></mesh>)}
    <mesh position={[0, -0.012, 0]}><boxGeometry args={[w - 2 * p - 0.006, h - p - 0.074 - 0.006, 0.008]} /><meshPhysicalMaterial color={palette.glass} transmission={0.88} thickness={0.008} roughness={0.06} ior={1.5} metalness={0} envMapIntensity={0.6} /></mesh>
    <RoundedBox position={[w / 2 - 0.03, -0.05, 0.036]} args={[0.026, 0.18, 0.018]} radius={0.005} smoothness={2} castShadow><meshStandardMaterial color={palette.seal} roughness={0.4} metalness={0.45} /></RoundedBox>
    <RoundedBox position={[w / 2 - 0.03, -0.05, 0.05]} args={[0.013, 0.11, 0.016]} radius={0.004} smoothness={2} material={material} />
  </group>;
}
export function WindowModel({ palette, finish, opening, reduced }: { palette: ViewerPalette; finish: Finish; opening: number; reduced: boolean }) {
  const moving = useRef<Group>(null);
  const { invalidate } = useThree();
  const texture = useMemo(makeSurfaceTexture, []);
  const material = useMemo(() => new MeshStandardMaterial({ color: palette[finish], metalness: finish === 'silver' ? 0.88 : 0.45, roughness: finish === 'silver' ? 0.31 : 0.48, roughnessMap: texture }), [palette, finish, texture]);
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => { invalidate(); }, [opening, invalidate]);
  useFrame((_, delta) => {
    const panel = moving.current;
    if (!panel) return;
    const target = opening * 1.075;
    panel.position.x = reduced ? target : panel.position.x + (target - panel.position.x) * (1 - Math.exp(-9 * Math.min(delta, 0.05)));
    if (Math.abs(target - panel.position.x) > 0.0001) invalidate();
  });
  return <group>
    <Profile length={2.2} width={0.05} depth={0.15} position={[-1.2, 1.1, 0]} material={material} />
    <Profile length={2.2} width={0.05} depth={0.15} position={[1.2, 1.1, 0]} material={material} />
    <Profile length={2.35} width={0.05} depth={0.15} position={[0, 2.175, 0]} horizontal material={material} />
    <Profile length={2.35} width={0.042} depth={0.15} position={[0, 0.025, 0]} horizontal material={material} />
    {/* Raised running rails and head channels on both sliding tracks. */}
    {[-0.039, 0.027].map(z => <group key={z}>
      <mesh position={[0, 0.052, z]} material={material} castShadow><boxGeometry args={[2.35, 0.013, 0.008]} /></mesh>
      <mesh position={[0, 2.145, z]} material={material}><boxGeometry args={[2.35, 0.018, 0.007]} /></mesh>
    </group>)}
    <Panel x={0.566} z={-0.035} material={material} palette={palette} />
    <group ref={moving}><Panel x={-0.566} z={0.032} material={material} palette={palette} /></group>
  </group>;
}
