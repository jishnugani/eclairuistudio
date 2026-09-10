import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, ArrowLeft, Plus, X, Menu, Layers, Check, Figma, Maximize2 } from 'lucide-react';
import { projects, terms, faqs } from './content';
import { NavigationProvider, Link, useNavigation } from './navigation';
import Home from './Home';
import usePointerGlow from './usePointerGlow';
import './style.css';

const DISCORD = 'https://discord.gg/6H7RAbNn44';
const External = ({children, href = DISCORD, className = ''}) => <a className={className} href={href} target="_blank" rel="noreferrer">{children}</a>;
const PageHeading = ({title,children}) => <div className="page-heading"><h1>{title}</h1>{children}</div>;

function ImageViewer({view,setView}) {
  const dialog = useRef(null);
  const project = view?.type === 'work' ? projects[view.index] : null;
  useEffect(() => {
    if(!view) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.current.showModal();document.body.style.overflow='hidden';
    return () => {document.body.style.overflow=overflow;previous?.focus();};
  },[!!view]);
  const step = direction => setView(current=>({...current,index:(current.index+direction+projects.length)%projects.length}));
  if(!view) return null;
  return <dialog ref={dialog} className="modal image-modal" aria-labelledby="viewer-title" onCancel={()=>setView(null)} onClick={e=>{if(e.target===e.currentTarget)setView(null);}} onKeyDown={e=>{if(project && ['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();step(e.key==='ArrowRight'?1:-1);}}}>
    <div className="modal-inner"><div className="modal-header"><h2 id="viewer-title">{project?.category || 'Pricing chart'}</h2><button autoFocus className="icon-button" aria-label="Close image" onClick={()=>setView(null)}><X/></button></div>
    <img className="full-image" src={project?.src || '/pricing-chart.png'} alt={project?.description || 'Design only from 4,000 Robux; design and import from 5,500 Robux.'}/>
    {project ? <div className="image-caption"><div className="gallery-navigation"><button className="icon-button" aria-label="Previous image" onClick={()=>step(-1)}><ArrowLeft size={19}/></button><span>{view.index+1} / {projects.length}</span><button className="icon-button" aria-label="Next image" onClick={()=>step(1)}><ArrowRight size={19}/></button></div></div> : <p className="pricing-caption">Reasonable revisions are included; major redesigns may cost extra. Prices and delivery times depend on the agreed scope.</p>}
    </div>
  </dialog>;
}
function Work({setView}) {
  return <><div className="page-shell work-page"><PageHeading title="Work"/><div className="work-grid">{projects.map((project,index)=><article className="work-card" key={project.src}><button className="work-image" aria-label={`Open ${project.category}, image ${index+1}`} onClick={()=>setView({type:'work',index})}><img src={project.src} alt={project.description} loading={index<2?'eager':'lazy'} width="3840" height="2160"/><span className="expand"><Maximize2 size={18}/></span></button><div className="work-label"><span>{project.category}</span><span>{String(index+1).padStart(2,'0')}</span></div></article>)}</div></div><section className="work-x-section" aria-label="More work on X"><External href="https://x.com/ec92a5" className="work-x-link"><h2>View all work on X/Twitter</h2><span className="work-x-arrow"><ArrowUpRight aria-hidden="true"/></span></External></section></>;
}
function Process() {
  return <div className="page-shell"><PageHeading title="Process"/><div className="process-grid">{[
    ['01','Brief','Send your screen list, references, budget, and deadline. We’ll agree on scope and price.'],
    ['02','Design','I create the UI in Figma using the agreed direction.'],
    ['03','Revisions','Review the design and send your changes. Reasonable revisions are included.'],
    ['04','Delivery','After full payment, you receive the agreed files and any included import work.'],
  ].map(([number,title,body])=><article key={number}><div className="step-number">{number}<ArrowUpRight size={20}/></div><h2>{title}</h2><p>{body}</p></article>)}</div><div className="page-actions"><Link href="/pricing" className="pill secondary">Pricing <ArrowRight size={18}/></Link><Link href="/terms" className="text-link">Terms of Service <ArrowUpRight size={18}/></Link></div></div>;
}
function Pricing({setView}) {
  return <div className="page-shell"><PageHeading title="Pricing"><span className="payment-badge">ROBUX ONLY</span></PageHeading><div className="pricing-grid">{[
    {title:'Design only',price:'4,000',icon:Figma,features:['Custom UI design','Figma source file','Reasonable revisions']},
    {title:'Design + import',price:'5,500',icon:Layers,features:['Custom UI design','UI import','Reasonable revisions','Import scope agreed before starting']},
  ].map((plan,index)=><article className={`price-card ${index?'featured':''}`} key={plan.title}><plan.icon className="price-icon" size={28}/><h2>{plan.title}</h2><div className="price"><span>R$</span> {plan.price}<span className="price-plus">+</span></div><span className="per-frame">Starting price per frame</span><ul>{plan.features.map(feature=><li key={feature}><Check/>{feature}</li>)}</ul><External className={`pill ${index?'primary':'secondary'}`}>Commission <ArrowUpRight size={18}/></External></article>)}</div><div className="pricing-fine"><p>Prices depend on complexity and are negotiable. Typical delivery: 1–2 days for straightforward work. Taxes are covered by the client. Scripting is not included unless agreed separately.</p><button className="text-link" onClick={()=>setView({type:'pricing'})}>Pricing chart <Maximize2 size={16}/></button></div><div className="page-actions"><Link href="/terms" className="text-link">Terms of Service <ArrowUpRight size={18}/></Link><Link href="/faq" className="text-link">FAQ <ArrowUpRight size={18}/></Link></div></div>;
}
function FAQ() {
  return <div className="page-shell narrow-page"><PageHeading title="FAQ"/><div className="faq-list">{faqs.map(([question,answer])=><details key={question}><summary>{question}<Plus size={18}/></summary><p>{answer}</p></details>)}</div></div>;
}
function Terms() {
  return <div className="page-shell narrow-page"><PageHeading title="Terms of Service"/><div className="terms-content"><p>By commissioning me, you confirm that you have read and agreed to these terms.</p>{terms.map((term,index)=><section key={term.title}><h2>{index+1}. {term.title}</h2><ul>{term.items.map(item=><li key={item}>{item}</li>)}</ul></section>)}</div></div>;
}
function App() {
  const {path,phase} = useNavigation();
  usePointerGlow(path);
  const [menu,setMenu] = useState(false);
  const [opening,setOpening] = useState(true);
  useEffect(()=>{
    const timeout = setTimeout(()=>setOpening(false),2200);
    return ()=>clearTimeout(timeout);
  },[]);
  useEffect(()=>{if(phase==='leaving')setOpening(false);},[phase]);
  const [view,setView] = useState(null);
  useEffect(()=>{setMenu(false);setView(null);},[path]);
  const pages = {'/':<Home onOpen={index=>setView({type:'work',index})}/>, '/work':<Work setView={setView}/>, '/process':<Process/>, '/pricing':<Pricing setView={setView}/>, '/faq':<FAQ/>, '/terms':<Terms/>};
  return <>
    <a className="skip" href="#page-content">Skip to content</a>
    <header className={`header ${path==='/'?'home-header':''} ${opening?'initial-load':''}`}><Link href="/" className="wordmark" aria-label="ec92a5 home">ec92a5<span aria-hidden="true">✳</span></Link><nav className={menu?'nav open':'nav'} aria-label="Main navigation">{[['/','Home'],['/work','Work'],['/process','Process'],['/pricing','Pricing'],['/faq','FAQ'],['/terms','TOS']].map(([href,label])=><Link href={href} key={href} aria-current={path===href?'page':undefined} onClick={()=>setMenu(false)}>{label}</Link>)}</nav><External className="nav-cta">Commission <ArrowUpRight size={16}/></External><button className="menu-toggle" aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header>
    <main id="page-content" tabIndex={-1} className={`route-page ${phase} ${opening?'initial-load':''}`} inert={phase==='leaving'} key={path}>{pages[path] || <div className="page-shell"><PageHeading title="Page not found"/><Link href="/work" className="pill primary">View work <ArrowRight size={18}/></Link></div>}</main>
    <footer><Link className="wordmark" href="/">ec92a5<span aria-hidden="true">✳</span></Link><p>© {new Date().getFullYear()} ec92a5</p><Link href="/terms" className="footer-terms">Terms of Service</Link><External href="https://x.com/ec92a5">X <ArrowUpRight size={16}/></External><External>Discord <ArrowUpRight size={16}/></External></footer>
    <ImageViewer view={view} setView={setView}/>
  </>;
}
createRoot(document.getElementById('root')).render(<NavigationProvider><App/></NavigationProvider>);
