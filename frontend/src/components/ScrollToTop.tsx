import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      setVisible(y > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).lenis as { scrollTo: (target: number | HTMLElement | string, opts?: Record<string, unknown>) => void } | undefined;
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button size="icon" variant="default" className="rounded-full shadow-smooth" onClick={handleClick} aria-label="Scroll to top">
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ScrollToTop;
