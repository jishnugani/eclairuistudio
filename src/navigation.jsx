import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { animate, stagger } from 'animejs';

export const pageNames = {'/':'Home','/work':'Work','/process':'Process','/pricing':'Pricing','/faq':'FAQ','/terms':'Terms of Service'};
const NavigationContext = createContext(null);
const normalize = path => { const clean = path.replace(/\/$/, '') || '/'; return clean === '/about' ? '/' : clean; };
function initialPath() {
  if(window.location.pathname.replace(/\/$/,'') === '/about' || (window.location.pathname === '/' && window.location.hash === '#about')) {window.history.replaceState({},'', '/');return '/';}
  const legacy = '/' + window.location.hash.slice(1);
  if (window.location.pathname === '/' && pageNames[legacy] && legacy !== '/') {
    window.history.replaceState({}, '', legacy);
  }
  return normalize(window.location.pathname);
}
export function NavigationProvider({children}) {
  const [path,setPath] = useState(initialPath);
  const [phase,setPhase] = useState('idle');
  const current = useRef(path);
  const shutter = useRef(null);
  const transitionAnimation = useRef(null);
  const transitionId = useRef(0);
  const transition = useCallback((destination, scroll = 0) => {
    const id = ++transitionId.current;
    transitionAnimation.current?.cancel();
    const commit = () => {
      current.current = destination;
      setPath(destination);
      window.scrollTo({top:scroll,behavior:'instant'});
      requestAnimationFrame(() => {
        window.scrollTo({top:scroll,behavior:'instant'});
        document.getElementById('page-content')?.focus({preventScroll:true});
      });
    };
    const panels = shutter.current.querySelectorAll('i');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) {commit();setPhase('idle');return;}
    setPhase('leaving');
    transitionAnimation.current = animate(panels, {
      y: ['105%', '0%'], rotateY: [-12, 0], duration: 420, delay: stagger(35), ease: 'inOutQuint',
      onComplete: () => {
        if (id !== transitionId.current) return;
        commit(); setPhase('entering');
        transitionAnimation.current = animate(panels, {
          y: ['0%', '-105%'], rotateY: [0, 10], duration: 650, delay: stagger(45), ease: 'inOutQuint',
          onComplete: () => { if (id === transitionId.current) setPhase('idle'); },
        });
      },
    });
  },[]);
  const navigate = useCallback(destination => {
    destination = normalize(destination);
    if(destination === normalize(window.location.pathname)) return;
    window.history.replaceState({...window.history.state,scroll:window.scrollY},'');
    window.history.pushState({scroll:0},'',destination);
    transition(destination);
  },[transition]);
  useEffect(() => {
    const oldRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    let scrollFrame;
    const saveScroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        if(current.current === normalize(window.location.pathname)) {
          window.history.replaceState({...window.history.state,scroll:window.scrollY},'');
        }
      });
    };
    const pop = event => {
      cancelAnimationFrame(scrollFrame);
      transition(normalize(window.location.pathname),event.state?.scroll || 0);
    };
    window.addEventListener('popstate',pop);
    window.addEventListener('scroll',saveScroll,{passive:true});
    return () => {window.removeEventListener('popstate',pop);window.removeEventListener('scroll',saveScroll);cancelAnimationFrame(scrollFrame);window.history.scrollRestoration=oldRestoration;transitionId.current++;transitionAnimation.current?.revert();};
  },[transition]);
  useEffect(() => {document.title = `${pageNames[path] || 'Page not found'} — ec92a5 UI Designer`;},[path]);
  return <NavigationContext.Provider value={{path,navigate,phase}}>{children}<div ref={shutter} className={`page-shutter anime-shutter ${phase}`} aria-hidden="true">{[0,1,2,3,4].map(i=><i key={i} style={{'--i':i}}/>)}</div></NavigationContext.Provider>;
}
export const useNavigation = () => useContext(NavigationContext);
export function Link({href,children,onClick,...props}) {
  const {navigate} = useNavigation();
  return <a href={href} {...props} onClick={event=>{
    onClick?.(event);
    if(event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank') return;
    event.preventDefault();navigate(href);
  }}>{children}</a>;
}
