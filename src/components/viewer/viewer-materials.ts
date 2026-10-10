import { Color, DataTexture, RedFormat, RepeatWrapping } from 'three';

export type Finish = 'black' | 'silver' | 'white';
export type ViewerPalette = Record<Finish | 'floor' | 'glass' | 'seal' | 'light', string>;

// Resolve CSS semantic tokens through the browser, including OKLCH → sRGB.
export function readViewerPalette(): ViewerPalette {
  const names = { black: 'metal-black', silver: 'metal-silver', white: 'metal-white', floor: 'floor', glass: 'glass', seal: 'seal', light: 'light' };
  const styles = getComputedStyle(document.documentElement);
  const context = document.createElement('canvas').getContext('2d');
  if (!context) throw new Error('Canvas color conversion unavailable');
  return Object.fromEntries(Object.entries(names).map(([key, token]) => {
    context.fillStyle = styles.getPropertyValue(`--viewer-${token}`).trim();
    context.fillRect(0, 0, 1, 1);
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
    return [key, new Color(`rgb(${r},${g},${b})`).getStyle()];
  })) as ViewerPalette;
}

export function makeSurfaceTexture() {
  const size = 128;
  const data = new Uint8Array(size * size);
  for (let i = 0; i < data.length; i++) data[i] = 170 + ((i * 127 + Math.floor(i / size) * 31) % 55);
  const texture = new DataTexture(data, size, size, RedFormat);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.needsUpdate = true;
  return texture;
}
