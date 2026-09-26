import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight, Star, Pause, Play } from 'lucide-react';
import { animate } from 'animejs';
import { Link } from './navigation';
import { projects, reviews } from './content';

const Contact = ({children,className=''}) => <a href="https://discord.gg/6H7RAbNn44" target="_blank" rel="noreferrer" className={className}>{children}</a>;

export default function Home({onOpen}) {
  const home = useRef(null);
  const [reviewsPaused,setReviewsPaused] = useState(false);
  const marquee = useRef(null);
  useEffect(() => {
    const track = home.current.querySelector('.testimonial-track');
    const group = track.querySelector('.testimonial-group');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = matchMedia('(min-width: 701px)');
    const setup = () => {
      marquee.current?.revert(); marquee.current = null;
      if (motion.matches || !desktop.matches) return;
      const distance = group.getBoundingClientRect().width;
      marquee.current = animate(track, { x: [0, -distance], duration: distance / 28 * 1000, ease: 'linear', loop: true });
      if (home.current.querySelector('.reviews-paused')) marquee.current.pause();
    };
    const observer = new ResizeObserver(setup); observer.observe(group);
    motion.addEventListener('change', setup); desktop.addEventListener('change', setup);
    setup();
    return () => { observer.disconnect(); motion.removeEventListener('change', setup); desktop.removeEventListener('change', setup); marquee.current?.revert(); };
  }, []);
  useEffect(() => { if (reviewsPaused) marquee.current?.pause(); else marquee.current?.play(); }, [reviewsPaused]);
  return <div className="home-story" ref={home}>
    <section className="home-section home-profile">
      <div className="home-section-label">01 / ABOUT ME</div>
      <div className="home-profile-grid"><div><h1 className="profile-title" aria-label="I’m ec92a5">{Array.from('I’m ec92a5').map((letter,index)=><span aria-hidden="true" className="profile-letter-mask" key={index}><span style={{'--letter':index}}>{letter===' '?'\u00a0':letter}</span></span>)}</h1><p>Hi! I’m ec92a5! I have created UI for many happy clients over the past year, primarily using Figma. I can create any kind of UI, including menus, HUDs, etc. Just shoot me a DM, and I’ll let you know if what you're asking for is within my capabilities.</p><div className="profile-styles"><span>Cartoony</span><span>Anime</span><span>Retro</span><span>Minimal</span></div><Contact className="text-link">Contact on Discord <ArrowUpRight size={18}/></Contact></div><aside className="profile-sidebar" aria-label="About me and toolkit"><dl className="home-profile-facts"><div><dt>Experience</dt><dd>1+ <span>year</span></dd></div><div><dt>Age</dt><dd>18</dd></div><div><dt>Timezone</dt><dd>Pacific Time</dd></div></dl><section className="profile-toolkit" aria-labelledby="toolkit-heading"><div className="toolkit-heading"><span aria-hidden="true">✦</span><h2 id="toolkit-heading">My toolkit</h2></div><ul className="toolkit-list">{[
        {name:'Figma',icon:'figma',color:'#a259ff'},
        {name:'Affinity',icon:'affinity',color:'#b6f379'},
        {name:'Adobe Photoshop',icon:'photoshop',color:'#31a8ff'},
        {name:'Roblox Studio',icon:'robloxstudio',color:'#39bdff'},
      ].map((tool,index)=><li className="toolkit-item" key={tool.icon} style={{'--tool-color':tool.color,'--tool-order':index}}><div className="toolkit-card"><span className="toolkit-icon"><img src={`/tools/${tool.icon}.${tool.icon==='affinity'?'png':'svg'}`} alt="" width="32" height="32"/></span><span>{tool.name}</span></div></li>)}</ul></section></aside></div>
    </section>
    <section className="home-section home-services"><div className="home-section-label">02 / SERVICES</div><div className="home-section-heading"><h2>Let’s talk about<br/>your project.</h2><Link href="/pricing" className="text-link">Pricing <ArrowUpRight size={18}/></Link></div><div className="service-gallery">{[
      {title:'Anime / Inventory',index:projects.findIndex(project=>project.src==='/work/01.jpeg'),description:'Character cards, stats, and equipment controls.'},
      {title:'Cartoony / Pets',index:projects.findIndex(project=>project.src==='/work/02.jpeg'),description:'Pet collections, rarity groups, and equipment.'},
      {title:'Retro / Shop',index:projects.findIndex(project=>project.src==='/work/03.jpeg'),description:'Gamepasses, upgrades, and purchase options.'},
    ].filter(service=>service.index>=0).map((service,index)=><article className="home-service" key={service.title} style={{'--order':index}}><button onClick={()=>onOpen(service.index)} aria-label={`View ${service.title}`} className="service-image"><img src={projects[service.index].src} alt={projects[service.index].description} loading="lazy" width="3840" height="2160"/><span><ArrowUpRight size={21}/></span></button><h3>{service.title}</h3><p>{service.description}</p></article>)}</div><div className="home-service-bottom"><span>Design from <strong>R$ 4,000</strong> / frame</span><Link href="/process" className="text-link">Commission process <ArrowRight size={17}/></Link></div></section>
    <section className={`home-section home-reviews testimonial-section ${reviewsPaused?'reviews-paused':''}`}><div className="home-section-label">03 / CLIENT REVIEWS</div><div className="home-section-heading"><h2>Client testimonials.</h2><button className="icon-button review-motion" aria-label={reviewsPaused?'Play review animation':'Pause review animation'} aria-pressed={reviewsPaused} onClick={()=>setReviewsPaused(!reviewsPaused)}>{reviewsPaused?<Play size={17}/>:<Pause size={17}/>}</button></div><div className="testimonial-window" tabIndex={0} role="region" aria-label="Client reviews"><div className="testimonial-track">{[0,1].map(copy=><div className="testimonial-group" key={copy} aria-hidden={copy===1?true:undefined}>{reviews.map(review=><figure className="testimonial-card" key={review.name}><div className="review-stars" role="img" aria-label={`${review.rating} out of 5 stars`}>{Array.from({length:5},(_,i)=><Star key={i} size={20} fill="currentColor" aria-hidden="true"/>)}</div><blockquote>“{review.quote}”</blockquote><figcaption><strong>{review.name}</strong><span>{review.role}</span></figcaption></figure>)}</div>)}</div></div></section>
    <section className="home-contact"><div className="contact-orbit" aria-hidden="true"/><div className="home-contact-inner"><div className="home-section-label"><span className="availability"/> OPEN FOR COMMISSIONS</div><div className="home-contact-title"><h2>Ready to get<br/>in touch?</h2><ArrowUpRight aria-hidden="true"/></div><div className="home-contact-bottom"><p>Send your screen list, references,<br/>budget, and deadline.</p><Contact className="pill primary">Let’s talk <ArrowUpRight size={20}/></Contact><Link className="text-link" href="/terms">Terms of Service <ArrowUpRight size={17}/></Link></div></div></section>
  </div>;
}
