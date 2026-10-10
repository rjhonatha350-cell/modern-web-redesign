import { Suspense, useEffect, useRef, useState, type ComponentRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CameraControls, Environment, Lightformer } from '@react-three/drei';
import { Box, Maximize, Minimize, RotateCcw, Rotate3D, Scan, ZoomIn, ZoomOut } from 'lucide-react';
import { Vector3 } from 'three';
import { Button } from '@/components/ui/button';
import { WindowModel } from './WindowModel';
import { makeSurfaceTexture, readViewerPalette, type Finish, type ViewerPalette } from './viewer-materials';

type Controls = ComponentRef<typeof CameraControls>;
const finishLabels: Record<Finish, string> = { black: 'Preto fosco', silver: 'Alumínio natural', white: 'Branco acetinado' };

function Studio({ palette }: { palette: ViewerPalette }) {
  const [texture] = useState(makeSurfaceTexture);
  useEffect(() => () => texture.dispose(), [texture]);
  return <>
    <color attach="background" args={[palette.floor]} />
    <fog attach="fog" args={[palette.floor, 10, 25]} />
    <ambientLight intensity={0.65} />
    <directionalLight position={[3, 6, 4]} intensity={2.4} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-0.0003} />
    <Environment resolution={128}>
      <Lightformer intensity={3} color={palette.light} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} />
      <Lightformer intensity={2} color={palette.light} position={[-4, 2, 3]} rotation-y={Math.PI / 3} scale={[2, 5, 1]} />
      <Lightformer intensity={1.5} color={palette.glass} position={[4, 2, -3]} rotation-y={-Math.PI / 3} scale={[3, 4, 1]} />
    </Environment>
    <mesh rotation-x={-Math.PI / 2} position-y={-0.018} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial color={palette.floor} roughnessMap={texture} roughness={1} /></mesh>
  </>;
}
function CameraRig({ controls, rotating, resetKey, frontKey }: { controls: React.RefObject<Controls | null>; rotating: boolean; resetKey: number; frontKey: number }) {
  const { size, invalidate } = useThree();
  useEffect(() => {
    const distance = size.width < 600 ? 1.4 : 1;
    void controls.current?.setLookAt(3.2 * distance, 2.6 * distance, 4.6 * distance, 0, 1.12, 0, true);
  }, [controls, resetKey, size.width]);
  useEffect(() => {
    if (frontKey === 0) return;
    void controls.current?.setLookAt(0, 1.12, size.width < 600 ? 6.6 : 4.9, 0, 1.12, 0, true);
  }, [controls, frontKey, size.width]);
  useFrame((_, delta) => {
    if (rotating) {
      controls.current?.rotate(Math.min(delta, 0.05) * 0.24, 0, false);
      invalidate();
    }
  });
  return <CameraControls ref={controls} makeDefault minDistance={1.5} maxDistance={10} minPolarAngle={0.25} maxPolarAngle={Math.PI / 2 + 0.06} smoothTime={0.18} draggingSmoothTime={0.1} dollyToCursor />;
}

export default function WindowExperience() {
  const controls = useRef<Controls>(null);
  const container = useRef<HTMLDivElement>(null);
  const [palette, setPalette] = useState<ViewerPalette>();
  const [finish, setFinish] = useState<Finish>('black');
  const [opening, setOpening] = useState(0);
  const [rotating, setRotating] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [frontKey, setFrontKey] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    if (!canvas.getContext('webgl2')) { setUnsupported(true); return; }
    setPalette(readViewerPalette());
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => { setReduced(media.matches); if (media.matches) setRotating(false); };
    updateMotion(); media.addEventListener('change', updateMotion);
    const syncFullscreen = () => setFullscreen(document.fullscreenElement === container.current);
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => { media.removeEventListener('change', updateMotion); document.removeEventListener('fullscreenchange', syncFullscreen); };
  }, []);
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (container.current?.requestFullscreen) await container.current.requestFullscreen();
      else setFullscreen(value => !value);
    } catch { setFullscreen(value => !value); }
  };
  useEffect(() => {
    if (!fullscreen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setFullscreen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [fullscreen]);
  const reset = () => { setRotating(false); setOpening(0); setResetKey(key => key + 1); };
  return <div ref={container} className={`viewer-experience${fullscreen ? ' viewer-expanded' : ''}`}>
    <div className="viewer-product site-width"><div><span className="viewer-product-kind">Esquadria de correr</span><h3>Duas folhas. Um design essencial.</h3></div><span className="viewer-concept">Modelo conceitual · não executivo</span></div>
    <div className="viewer-canvas" aria-label="Modelo 3D interativo de esquadria de correr" tabIndex={0} onPointerDown={() => setRotating(false)} onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); void controls.current?.rotate(event.key === 'ArrowLeft' ? -0.15 : 0.15, 0, true); }
      if (event.key === '+' || event.key === '-') { event.preventDefault(); void controls.current?.dolly(event.key === '+' ? 0.4 : -0.4, true); }
    }}>
      {unsupported ? <div className="viewer-placeholder"><Box /><span>A visualização 3D não está disponível neste dispositivo.</span></div> : palette && <Canvas shadows dpr={[1, 1.5]} frameloop="demand" camera={{ position: [3.2, 2.6, 4.6], fov: 40, near: 0.05, far: 80 }} gl={{ antialias: true }} onCreated={({ gl }) => { gl.setClearColor(palette.floor); setReady(true); }}>
        <Studio palette={palette} />
        <Suspense fallback={null}><WindowModel palette={palette} finish={finish} opening={opening / 100} reduced={reduced} /></Suspense>
        <CameraRig controls={controls} rotating={rotating} resetKey={resetKey} frontKey={frontKey} />
      </Canvas>}
      {!ready && !unsupported && <div className="viewer-loading" role="status">Preparando a esquadria…</div>}
      <div className="viewer-camera-tools" role="toolbar" aria-label="Câmera 3D">
        <Button variant="outline" size="icon" title="Aproximar" aria-label="Aproximar" disabled={!ready} onClick={() => void controls.current?.dolly(0.55, true)}><ZoomIn /></Button>
        <Button variant="outline" size="icon" title="Afastar" aria-label="Afastar" disabled={!ready} onClick={() => void controls.current?.dolly(-0.55, true)}><ZoomOut /></Button>
        <Button variant="outline" size="icon" title="Vista frontal" aria-label="Vista frontal" disabled={!ready} onClick={() => { setRotating(false); setFrontKey(key => key + 1); }}><Scan /></Button>
        <Button variant="outline" size="icon" title="Rotação automática" aria-label="Rotação automática" aria-pressed={rotating} disabled={!ready || reduced} onClick={() => setRotating(value => !value)}><Rotate3D /></Button>
        <Button variant="outline" size="icon" title="Restaurar vista" aria-label="Restaurar vista" disabled={!ready} onClick={reset}><RotateCcw /></Button>
        <Button variant="outline" size="icon" title={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'} aria-label={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'} onClick={() => void toggleFullscreen()}>{fullscreen ? <Minimize /> : <Maximize />}</Button>
      </div>
    </div>
    <div className="viewer-settings site-width">
      <div className="viewer-finish"><div className="viewer-setting-label">Acabamento <span>{finishLabels[finish]}</span></div><div className="viewer-swatches" role="group" aria-label="Acabamento do alumínio">{(['black', 'silver', 'white'] as const).map(value => <Button key={value} variant="outline" size="icon" className={`viewer-swatch viewer-swatch-${value}`} title={finishLabels[value]} aria-label={finishLabels[value]} aria-pressed={finish === value} disabled={!ready} onClick={() => setFinish(value)} />)}</div></div>
      <div className="viewer-opening"><label className="viewer-setting-label" htmlFor="window-opening">Abertura das folhas <output htmlFor="window-opening">{opening}%</output></label><input id="window-opening" type="range" min={0} max={100} step={1} value={opening} disabled={!ready} onChange={event => setOpening(Number(event.target.value))} aria-valuetext={`${opening}% aberta`} /></div>
      <div className="viewer-model-details"><span>Alumínio & vidro</span><span>Perfis, trilhos e ferragens</span></div>
    </div>
  </div>;
}
