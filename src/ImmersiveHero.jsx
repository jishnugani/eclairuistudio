import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, Pause, Play } from 'lucide-react';
import { projects } from './content';
import { Link } from './navigation';

// The homepage always shows three recent entries. The Work page holds the full archive.
export const getFeaturedProjects = entries => entries.slice(0, 3);

export default function ImmersiveHero({onOpen}) {
  const featured = getFeaturedProjects(projects);
  const [selected,setSelected] = useState(0);
  const [direction,setDirection] = useState(1);
  const stage = useRef(null);
  const sequence = useRef(null);
  const [motion,setMotion] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if(!stage.current || !sequence.current) return;
        const header = document.querySelector('.header').offsetHeight;
        const distance = sequence.current.offsetHeight - sequence.current.firstElementChild.offsetHeight;
        const p = Math.max(0,Math.min(1,(header-sequence.current.getBoundingClientRect().top)/Math.max(1,distance)));
        stage.current.style.setProperty('--reveal',media.matches || !motion ? 1 : p);
      });
    };
    update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);media.addEventListener('change',update);
    return () => {cancelAnimationFrame(frame);window.removeEventListener('scroll',update);window.removeEventListener('resize',update);media.removeEventListener('change',update);};
  },[motion]);
  const active = featured[selected];
  const select = index => {
    setDirection(index < selected ? -1 : 1);
    setSelected((index + featured.length) % featured.length);
  };
  const move = event => {
    if(!motion || event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    stage.current.style.setProperty('--pointer-x',`${((event.clientX-rect.left)/rect.width-.5)*8}deg`);
    stage.current.style.setProperty('--pointer-y',`${((event.clientY-rect.top)/rect.height-.5)*-5}deg`);
    stage.current.style.setProperty('--light-x',`${(event.clientX-rect.left)/rect.width*100}%`);
    stage.current.style.setProperty('--light-y',`${(event.clientY-rect.top)/rect.height*100}%`);
  };
  const reset = () => {
    stage.current.style.setProperty('--pointer-x','0deg');
    stage.current.style.setProperty('--pointer-y','0deg');
  };
  return <div ref={sequence} className={`exhibit-sequence ${motion ? '' : 'motion-disabled'}`}><section className="exhibit-home">
    <div className="exhibit-heading"><div><span className="eyebrow">UI DESIGNER</span><h1 aria-label="ec92a5">{Array.from('ec92a5').map((letter,index)=><span key={index} aria-hidden="true" style={{'--letter':index}}>{letter}</span>)}</h1></div><div className="exhibit-heading-right"><span className="exhibit-status"><span className="availability"/> Open for commissions</span><Link href="/work" className="text-link">All work <ArrowUpRight size={18}/></Link></div></div>
    <div className="exhibit-stage" ref={stage} onPointerMove={move} onPointerLeave={reset}>
      <div className="exhibit-light" aria-hidden="true"/><div className="exhibit-orbits" aria-hidden="true"><i/><i/><span/><span/></div>
      <div className="exhibit-space" aria-hidden="true"><div/><div/><div/></div>
      <div className="exhibit-view" role="region" aria-roledescription="carousel" aria-label="Recent UI work" onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();select(selected+(event.key==='ArrowRight'?1:-1));}}}>
        <div className="exhibit-art" key={active.src} style={{'--direction':direction}}>
          <button onClick={()=>onOpen(projects.indexOf(active))} className="exhibit-open" aria-label={`Open ${active.category} in full size`}><img src={active.src} alt={active.description} width="3840" height="2160" fetchPriority="high"/><span className="exhibit-expand"><Maximize2 size={17}/></span></button>
        </div>
      </div>
    </div>
    <div className="exhibit-toolbar"><div className="exhibit-caption" aria-live="polite" aria-atomic="true"><span>{String(selected+1).padStart(2,'0')} / {String(featured.length).padStart(2,'0')}</span><h2>{active.category}</h2></div><div className="exhibit-switcher"><button className="exhibit-motion" aria-label={motion ? 'Pause ambient motion' : 'Enable ambient motion'} aria-pressed={!motion} onClick={()=>{reset();setMotion(!motion);}}>{motion ? <Pause size={15}/> : <Play size={15}/>}</button><button className="icon-button" onClick={()=>select(selected-1)} aria-label="Previous featured UI"><ArrowLeft size={18}/></button><div className="exhibit-dots">{featured.map((project,index)=><button key={project.src} aria-label={`Show ${project.category}`} aria-pressed={index===selected} onClick={()=>select(index)}><span/></button>)}</div><button className="icon-button" onClick={()=>select(selected+1)} aria-label="Next featured UI"><ArrowRight size={18}/></button></div></div>
  </section></div>;
}
