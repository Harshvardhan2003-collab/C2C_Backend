import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const getInitialTheme = (): "light" | "dark" => {
  try {
    const ls = localStorage.getItem("theme");
    if (ls === "light" || ls === "dark") return ls;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
};

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      void 0; // ignore write failures (e.g., private mode)
    }
  }, [theme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
    >
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};

export default ThemeToggle;
