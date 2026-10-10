import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, LoaderCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WindowExperience = lazy(() => import('./WindowExperience'));

class ViewerBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() {
    if (this.state.failed) return <div className="viewer-placeholder" role="status"><Box /><p>Não foi possível abrir a visualização 3D neste dispositivo.</p><Button variant="outline" onClick={() => this.setState({ failed: false })}><RefreshCw /> Tentar novamente</Button></div>;
    return this.props.children;
  }
}

export function WindowViewer() {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '250px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return <section className="viewer-section" id="visualizador" ref={section} aria-labelledby="viewer-heading">
    <div className="site-width viewer-heading"><div><div className="eyebrow">Design em perspectiva</div><h2 id="viewer-heading">Esquadrias. Em todos os ângulos.</h2></div><a href="#solucoes" className="viewer-back">Projetos & modelagem 3D</a></div>
    <ViewerBoundary><Suspense fallback={<div className="viewer-placeholder" role="status"><LoaderCircle className="viewer-spinner" /><span>Preparando a esquadria…</span></div>}>
      {visible ? <WindowExperience /> : <div className="viewer-placeholder"><Box /><span>Esquadria de correr · 2 folhas</span></div>}
    </Suspense></ViewerBoundary>
  </section>;
}