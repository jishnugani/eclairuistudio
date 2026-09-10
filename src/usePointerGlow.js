import { useEffect } from 'react';

// One shared animation loop, only while a mouse-driven highlight is settling.
export default function usePointerGlow(path) {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const selector = '.work-x-section, .page-shell, .home-section, .home-contact, .price-card, .testimonial-card, .work-card, .faq-list details, .process-grid article';
    let frame=0, current=[], x=0, y=0;
    const clear = () => {cancelAnimationFrame(frame);frame=0;current.forEach(item=>item.element.classList.remove('is-lit'));current=[];};
    const tick = () => {
      frame=0;let settling=false;
      current.forEach(item=>{
        const rect=item.element.getBoundingClientRect();
        const targetX=x-rect.left,targetY=y-rect.top;
        item.x+=(targetX-item.x)*.14;item.y+=(targetY-item.y)*.14;
        item.element.style.setProperty('--glow-x',`${item.x}px`);
        item.element.style.setProperty('--glow-y',`${item.y}px`);
        if(Math.abs(targetX-item.x)+Math.abs(targetY-item.y)>.5)settling=true;
      });
      if(settling)frame=requestAnimationFrame(tick);
    };
    const move = event => {
      if(event.pointerType!=='mouse'||preference.matches)return;
      x=event.clientX;y=event.clientY;
      const elements=[];let element=event.target instanceof Element?event.target.closest(selector):null;
      while(element){elements.push(element);element=element.parentElement?.closest(selector);}
      current.forEach(item=>{if(!elements.includes(item.element))item.element.classList.remove('is-lit');});
      current=elements.map(element=>{
        const existing=current.find(item=>item.element===element);
        element.classList.add('is-lit');
        return existing || {element,x:element.clientWidth/2,y:element.clientHeight/2};
      });
      if(!frame)frame=requestAnimationFrame(tick);
    };
    const visibility = () => {if(document.hidden)clear();};
    document.addEventListener('pointermove',move,{passive:true});
    document.documentElement.addEventListener('pointerleave',clear);
    document.addEventListener('visibilitychange',visibility);
    preference.addEventListener('change',clear);
    return ()=>{clear();document.removeEventListener('pointermove',move);document.documentElement.removeEventListener('pointerleave',clear);document.removeEventListener('visibilitychange',visibility);preference.removeEventListener('change',clear);};
  },[path]);
}
