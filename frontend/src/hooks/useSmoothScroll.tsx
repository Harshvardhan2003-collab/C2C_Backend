import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    // Expose for programmatic control
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).lenis = lenis;

    // Use Lenis for in-page hash anchors
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: 0 });
      }
    };
    document.addEventListener('click', onClick);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      document.removeEventListener('click', onClick);
      lenis.destroy();
    };
  }, []);
};
