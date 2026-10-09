import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowUpRight, ArrowRight, ArrowDown, Menu, X, Layers3, Box, Ruler, ShieldCheck, Check, MessageCircle, MoveUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import architecture from '@/assets/wr-architecture.jpg';
import facade from '@/assets/wr-facade.jpg';
import system from '@/assets/wr-system.jpg';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'WR Studio — Projetos, Esquadrias & Design 3D' },
    { name: 'description', content: 'Precisão técnica e liberdade criativa. Conheça as soluções da WR Studio em projetos de esquadrias, fachadas, consultoria e modelagem 3D.' },
    { property: 'og:title', content: 'WR Studio — Projetos, Esquadrias & Design 3D' },
    { property: 'og:description', content: 'Soluções de design e engenharia para transformar cada detalhe do seu projeto.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

const whatsapp = 'https://api.whatsapp.com/send?phone=5511963110074&text=Ol%C3%A1!%20Conheci%20a%20WR%20Studio%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto.';
const services = [
  { title: 'Projetos de esquadrias', image: facade, alt: 'Fachada contemporânea com esquadrias e brises de alumínio — imagem conceitual', text: 'Soluções em alumínio que conectam desempenho, estética e as necessidades de cada projeto.', description: 'Desenvolvemos projetos de esquadrias de alumínio, fachadas e revestimentos, com atenção às particularidades de cada obra e à integração com a arquitetura.', items: ['Desenvolvimento de projetos de esquadrias de alumínio', 'Soluções para fachadas e revestimentos', 'Especificação de sistemas e suas aplicações', 'Orientação técnica aos fabricantes'] },
  { title: 'Modelagem & design 3D', image: system, alt: 'Detalhe de perfil de esquadria de alumínio e vidro — imagem conceitual', text: 'Do detalhe técnico à visão completa. Transformamos ideias em modelos claros e precisos.', description: 'A modelagem 3D conecta a visão do projeto aos seus detalhes. Criamos representações de sistemas, componentes e ambientes para facilitar a compreensão e a comunicação.', items: ['Modelagem 3D de sistemas de esquadrias', 'Modelagem de componentes para portfólios e catálogos', 'Modelagem aplicada ao ambiente', 'Criação de imagens imobiliárias'] },
  { title: 'Consultoria especializada', image: architecture, alt: 'Residência com grandes aberturas envidraçadas — imagem conceitual', text: 'Acompanhamento técnico da fabricação à instalação. Segurança em cada decisão.', description: 'Nossa consultoria tem como objetivo assegurar a qualidade das esquadrias, desde a fabricação até a instalação na obra. Trabalhamos em parceria com construtoras e fabricantes.', items: ['Orientação técnica para decisões de projeto', 'Análise de aplicações e limitações dos sistemas', 'Acompanhamento da fabricação à instalação', 'Integração entre desempenho, funcionalidade e design'] },
];
const steps = [
  ['Escutar & entender', 'Cada projeto começa com uma conversa. Entendemos o contexto, as necessidades e a sua visão.'],
  ['Pensar & projetar', 'Traduzimos os objetivos em soluções que equilibram técnica, funcionalidade e estética.'],
  ['Modelar & detalhar', 'Damos forma às ideias com modelagem, especificação de sistemas e atenção aos detalhes.'],
  ['Orientar & acompanhar', 'Oferecemos suporte técnico para conectar o projeto à sua execução.'],
];

function Brand() {
  return <a href="#inicio" className="brand" aria-label="WR Studio — início"><span className="brand-mark">wr<span>.</span></span><span className="brand-name"><strong>studio</strong><small>projetos & design</small></span></a>;
}
function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [allOpen, setAllOpen] = useState(false);
  const detail = selected === null ? undefined : services[selected];
  const closeMenu = () => setMenuOpen(false);
  return (
    <main>
      <section className="hero" id="inicio">
        <img className="hero-image" src={architecture} alt="Arquitetura contemporânea com grandes esquadrias de alumínio — visualização conceitual" width={1920} height={1024} fetchPriority="high" />
        <header className="header site-width">
          <Brand />
          <nav className="desktop-nav" aria-label="Navegação principal">
            <a className="active" href="#inicio">Início</a><a href="#studio">O studio</a><a href="#solucoes">Soluções</a><a href="#processo">Nosso processo</a><a href="#contato">Contato</a>
          </nav>
          <Button variant="studio" className="header-cta" asChild><a href={whatsapp} target="_blank" rel="noreferrer">Vamos conversar <ArrowUpRight /></a></Button>
          <Button variant="nav" size="icon" className="mobile-toggle" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
        </header>
        {menuOpen && <nav className="mobile-menu" aria-label="Menu móvel">{[['Início', '#inicio'], ['O studio', '#studio'], ['Soluções', '#solucoes'], ['Nosso processo', '#processo'], ['Contato', '#contato']].map(([label, href]) => <a key={href} href={href} onClick={closeMenu}>{label}</a>)}</nav>}
        <div className="site-width"><div className="hero-copy">
          <div className="eyebrow">WR Studio · Projetos & design</div>
          <h1>Esquadrias, design<br />e novas <span>possibilidades.</span></h1>
          <p className="hero-description">Precisão técnica e liberdade criativa para transformar esquadrias, fachadas e ambientes em soluções extraordinárias.</p>
          <div className="hero-actions"><Button variant="studio" asChild><a href="#solucoes">Explore nossas soluções <ArrowUpRight /></a></Button><Button variant="glass" asChild><a href="#studio">Conheça o studio <ArrowRight /></a></Button></div>
        </div></div>
        <div className="hero-foot site-width"><a className="scroll-label" href="#solucoes"><ArrowDown size={16} /> Continue explorando</a><div className="image-label"><strong>Design que amplia horizontes.</strong>Visualização arquitetônica conceitual</div></div>
      </section>
      <div className="expertise-strip"><div className="site-width expertise-items">
        {[{ icon: Ruler, title: 'Precisão em cada detalhe', sub: 'Engenharia & design' }, { icon: Layers3, title: 'Soluções sob medida', sub: 'Para cada projeto' }, { icon: Box, title: 'Do conceito ao 3D', sub: 'Ideias que ganham forma' }, { icon: ShieldCheck, title: 'Parceria em todas as etapas', sub: 'Consultoria especializada' }].map(({ icon: Icon, title, sub }) => <div className="expertise-item" key={title}><Icon /><div><strong>{title}</strong><small>{sub}</small></div></div>)}
      </div></div>
      <section className="section site-width" id="solucoes">
        <div className="eyebrow">O que fazemos</div>
        <div className="section-heading"><h2>Expertise que dá forma<br />à sua visão.</h2><p>Unimos conhecimento técnico e olhar criativo para entregar soluções integradas, do primeiro traço ao último detalhe.</p></div>
        <div className="service-grid">{services.map((s, i) => <article className="service" key={s.title}>
          <div className="service-image"><img src={s.image} alt={s.alt} width={1024} height={1024} loading="lazy" /><span className="service-number">0{i + 1}</span></div>
          <div className="service-info"><h3>{s.title}</h3><p>{s.text}</p><Button variant="link" className="service-link" onClick={() => setSelected(i)} aria-label={`Saiba mais sobre ${s.title}`}>Conheça a solução <ArrowUpRight /></Button></div>
        </article>)}</div>
        <div className="all-services"><Button variant="link" asChild><a href="#servicos" onClick={(e) => { e.preventDefault(); setAllOpen(true); }}>Todas as nossas especialidades <ArrowRight /></a></Button></div>
      </section>
      <section className="section about" id="studio"><div className="site-width about-layout">
        <div className="about-image"><img src={facade} alt="Detalhes de uma fachada em alumínio — imagem conceitual" width={1024} height={1024} loading="lazy" /><span className="about-image-label">Técnica, estética e inovação.</span></div>
        <div className="about-copy"><div className="eyebrow">Muito prazer, WR Studio</div><h2>Um olhar criativo.<br />Uma base técnica sólida.</h2><p>Somos um studio de projetos e design especializado em esquadrias de alumínio. Conectamos funcionalidade, estética e inovação para criar soluções personalizadas.</p><p>Trabalhamos lado a lado com construtoras e fabricantes, do projeto inicial à implementação. Nosso compromisso é entender cada desafio e transformar conhecimento em resultado.</p><div className="about-points">{['Design com propósito', 'Soluções personalizadas', 'Visão integrada', 'Rigor técnico'].map(p => <div key={p}><Check />{p}</div>)}</div></div>
      </div></section>
      <section className="section site-width" id="processo"><div className="eyebrow">Como trabalhamos</div><div className="section-heading"><h2>Da primeira conversa<br />à solução ideal.</h2><p>Um processo colaborativo, com clareza em cada etapa e atenção ao que torna seu projeto único.</p></div><div className="process-grid">{steps.map(([title, text], i) => <div className="process-step" key={title}><span>0{i + 1} /</span><h3>{title}</h3><p>{text}</p></div>)}</div></section>
      <section className="contact" id="contato"><div className="site-width contact-layout"><div><div className="eyebrow">Vamos construir o próximo passo</div><h2>Seu próximo projeto<br />começa com uma conversa.</h2><p>Conte sua ideia. Vamos encontrar a melhor solução juntos.</p></div><div className="contact-actions"><Button variant="studio" asChild><a href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle /> Fale com o nosso studio <ArrowUpRight /></a></Button><a className="email-link" href="mailto:wrprojetos8@hotmail.com">wrprojetos8@hotmail.com</a></div></div></section>
      <footer className="footer"><div className="site-width footer-inner"><span>© {new Date().getFullYear()} WR Studio. Projetos & design.</span><span>Imagens conceituais · Releitura independente</span><a href="https://www.linkedin.com/in/widsonramos/" target="_blank" rel="noreferrer">LinkedIn <MoveUpRight size={11} className="inline" /></a></div></footer>
      <Button variant="studio" size="icon" className="floating-contact" asChild><a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Conversar com WR Studio no WhatsApp" title="Fale pelo WhatsApp"><MessageCircle /></a></Button>
      <Dialog open={detail !== undefined} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent className="detail-dialog"><DialogTitle>{detail?.title}</DialogTitle><DialogDescription>{detail?.description}</DialogDescription><ul className="detail-list">{detail?.items.map(item => <li key={item}><Check />{item}</li>)}</ul><Button variant="studio" asChild><a href={whatsapp} target="_blank" rel="noreferrer">Converse sobre seu projeto <ArrowUpRight /></a></Button></DialogContent></Dialog>
      <Dialog open={allOpen} onOpenChange={setAllOpen}><DialogContent className="detail-dialog"><DialogTitle>Nossas especialidades</DialogTitle><DialogDescription>Soluções que conectam engenharia, arquitetura e visualização.</DialogDescription><ul className="detail-list">{services.flatMap(s => s.items).filter(item => !item.includes('Orientação') && !item.includes('Integração') && !item.includes('Análise') && !item.includes('Acompanhamento')).map(item => <li key={item}><Check />{item}</li>)}</ul><Button variant="studio" asChild><a href={whatsapp} target="_blank" rel="noreferrer">Vamos conversar <ArrowUpRight /></a></Button></DialogContent></Dialog>
    </main>
  );
}
