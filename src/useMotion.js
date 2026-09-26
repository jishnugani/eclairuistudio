import { useLayoutEffect } from 'react';
import { animate, createTimeline, stagger, utils } from 'animejs';

// Each route owns its animations and listeners; navigating away restores inline styles.
export default function useMotion(path) {
  useLayoutEffect(() => {
    const root = document.getElementById('page-content');
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const instances = new Set();
    const initialStyles = new Map();
    const routeDelay = root.classList.contains('entering') ? 430 : 0;
    const events = [];
    const pending = new Map();
    const hover = new Map();
    const play = (target, options) => {
      const instance = animate(target, { duration: 850, ease: 'outQuint', ...options });
      instances.add(instance);
      return instance;
    };
    const listen = (el, event, fn) => { el.addEventListener(event, fn); events.push(() => el.removeEventListener(event, fn)); };
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        const animation = pending.get(entry.target);
        animation?.play(); pending.delete(entry.target); observer.unobserve(entry.target);
      }
    }), { threshold: .08, rootMargin: '0px 0px -32px 0px' });
    root.classList.add('motion-managed');
    if (!preference.matches) {
      const timeline = createTimeline({ defaults: { duration: 950, ease: 'outQuint' } });
      instances.add(timeline);
      const add = (selector, options, position) => {
        const targets = root.querySelectorAll(selector);
        if (!targets.length) return;
        // Timeline children do not necessarily render their first frame before their offset.
        // Seed every entrance now so delayed elements never flash, then disappear.
        targets.forEach(el => { if (!initialStyles.has(el)) initialStyles.set(el, el.getAttribute('style')); });
        const initial = Object.fromEntries(Object.entries(options).filter(([, value]) => Array.isArray(value)).map(([key, value]) => [key, value[0]]));
        utils.set(targets, initial);
        timeline.add(targets, options, position + routeDelay);
      };
      add('.home-profile .home-section-label, .page-heading', { opacity: [0, 1], y: [22, 0] }, 30);
      add('.profile-title', { y: [55, 0], opacity: [0, 1], clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'], duration: 1100, ease: 'outQuart' }, 100);
      add('.home-profile-grid > div > p', { opacity: [0, 1], y: [25, 0] }, 290);
      add('.profile-styles > span', { opacity: [0, 1], y: [16, 0], delay: stagger(65) }, 390);
      add('.home-profile .text-link', { opacity: [0, 1], y: [16, 0] }, 540);
      add('.home-profile-facts > div', { opacity: [0, 1], y: [25, 0], delay: stagger(80) }, 250);
      add('.toolkit-heading', { opacity: [0, 1], y: [18, 0] }, 360);
      add('.toolkit-item', { opacity: [0, 1], x: [32, 0], y: [12, 0], delay: stagger(100), duration: 1000 }, 450);

      const selectors = '.home-services .home-section-label, .home-section-heading, .home-service, .home-service-bottom, .home-reviews .home-section-label, .testimonial-window, .home-contact .home-section-label, .home-contact-title, .home-contact-bottom, .work-card, .work-x-link, .process-grid article, .price-card, .pricing-fine, .page-actions, .faq-list details, .terms-content > p, .terms-content > section';
      root.querySelectorAll(selectors).forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0) return;
        const isCard = el.matches('.home-service, .work-card, .price-card, .process-grid article');
        const siblings = [...el.parentElement.children];
        const columnDelay = isCard ? (siblings.indexOf(el) % (innerWidth > 760 ? 3 : 1)) * 85 : 0;
        const heading = el.matches('.home-section-heading, .home-contact-title, .work-x-link');
        const animation = play(el, {
          opacity: [0, 1], y: [isCard ? 65 : heading ? 45 : 24, 0],
          ...(isCard ? { rotateX: [7, 0], perspective: 1200 } : {}),
          ...(heading ? { clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'] } : {}),
          duration: isCard || heading ? 1100 : 800, ease: 'outQuart',
          delay: columnDelay + (rect.top < innerHeight ? routeDelay : 0), autoplay: false,
        });
        pending.set(el, animation); observer.observe(el);
      });
    }
    // Keyboard users never have to wait for a reveal to reach focused content.
    listen(root, 'focusin', event => {
      pending.forEach((animation, el) => {
        if (el.contains(event.target)) { animation.complete(); pending.delete(el); observer.unobserve(el); }
      });
    });
    const settle = (el, options) => {
      const previous = hover.get(el);
      previous?.cancel(); instances.delete(previous);
      const instance = play(el, { ...options, duration: 550, ease: 'outExpo' });
      hover.set(el, instance);
    };
    root.querySelectorAll('.toolkit-card, .work-image, .service-image, .pill, .text-link, .work-x-arrow').forEach(el => {
      listen(el, 'pointermove', event => {
        if (!fine.matches || preference.matches || event.pointerType !== 'mouse') return;
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        const card = el.matches('.toolkit-card, .work-image, .service-image');
        settle(el, card ? { rotateX: -y * 3, rotateY: x * 3, y: -3 } : { x: x * 7, y: y * 5 });
      });
      listen(el, 'pointerleave', () => { if (!preference.matches) settle(el, { x: 0, y: 0, rotateX: 0, rotateY: 0 }); });
    });
    root.querySelectorAll('.faq-list details').forEach(el => {
      listen(el, 'toggle', () => {
        if (el.open && !preference.matches) { const p = el.querySelector('p'); settle(p, { opacity: [0, 1], y: [10, 0] }); }
      });
    });
    const restoreInitial = () => initialStyles.forEach((style, el) => {
      if (style === null) el.removeAttribute('style'); else el.setAttribute('style', style);
    });
    const reduce = () => {
      if (!preference.matches) return;
      observer.disconnect(); pending.clear(); instances.forEach(instance => instance.revert()); instances.clear(); hover.clear(); restoreInitial();
    };
    preference.addEventListener('change', reduce);
    return () => {
      observer.disconnect(); events.forEach(remove => remove());
      preference.removeEventListener('change', reduce);
      instances.forEach(instance => instance.revert());
      restoreInitial();
    };
  }, [path]);
}
