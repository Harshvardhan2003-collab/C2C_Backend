import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import {
  Search,
  GraduationCap,
  Clock,
  Building2,
  Star,
  PlayCircle,
  ArrowRight,
  Heart,
} from "lucide-react";

type Course = {
  id: string;
  title: string;
  provider: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  mode: "Self-paced" | "Instructor-led";
  durationWeeks: number;
  rating: number; // 0-5
  learners: number;
  tags: string[];
  cover?: string;
};

const COURSES: Course[] = [
  {
    id: "c1",
    title: "React + TypeScript Essentials",
    provider: "SkyLabs Academy",
    level: "Beginner",
    mode: "Self-paced",
    durationWeeks: 6,
    rating: 4.7,
    learners: 12450,
    tags: ["React", "TypeScript", "Frontend"],
    cover: "/images/how-profile.jpg",
  },
  {
    id: "c2",
    title: "Data Analysis with Python",
    provider: "InSight Learning",
    level: "Intermediate",
    mode: "Instructor-led",
    durationWeeks: 8,
    rating: 4.8,
    learners: 9800,
    tags: ["Pandas", "NumPy", "Visualization"],
    cover: "/images/how-browse.jpg",
  },
  {
    id: "c3",
    title: "Backend APIs with Node.js",
    provider: "CloudForge",
    level: "Intermediate",
    mode: "Self-paced",
    durationWeeks: 7,
    rating: 4.6,
    learners: 7600,
    tags: ["Node.js", "REST", "Postgres"],
    cover: "/images/how-apply.jpg",
  },
  {
    id: "c4",
    title: "UI/UX Fundamentals with Figma",
    provider: "PixelMint Studio",
    level: "Beginner",
    mode: "Instructor-led",
    durationWeeks: 5,
    rating: 4.5,
    learners: 5400,
    tags: ["Figma", "Prototyping", "UX"],
    cover: "/images/avatar-student.jpg",
  },
  {
    id: "c5",
    title: "Machine Learning Foundations",
    provider: "DeepWave",
    level: "Advanced",
    mode: "Self-paced",
    durationWeeks: 10,
    rating: 4.9,
    learners: 13200,
    tags: ["ML", "Scikit-Learn", "MLOps"],
    cover: "/images/avatar-industry.jpg",
  },
  {
    id: "c6",
    title: "Product Management Crash Course",
    provider: "NovaWorks",
    level: "Beginner",
    mode: "Self-paced",
    durationWeeks: 4,
    rating: 4.4,
    learners: 4200,
    tags: ["PM", "Roadmapping", "Discovery"],
    cover: "/images/avatar-faculty.jpg",
  },
];

type Level = "All" | Course["level"];
type Mode = "All" | Course["mode"];
type DurationFilter = "All" | "<6" | "6-8" | ">8";
type SortBy = "Rating" | "Learners" | "Duration";
type SortDir = "asc" | "desc";

export default function Courses() {
  const { isAuthenticated } = useAuth();
  const [q, setQ] = useState("");
  const [level, setLevel] = useState<Level>("All");
  const [mode, setMode] = useState<Mode>("All");
  const [duration, setDuration] = useState<DurationFilter>("All");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortBy>("Rating");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [loading, setLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Category chips
  const CATEGORIES = useMemo(
    () => [
      { key: "Web", tags: ["React", "Frontend", "TypeScript"] },
      { key: "Data", tags: ["Pandas", "NumPy", "Visualization", "Data"] },
      { key: "Backend", tags: ["Node.js", "REST", "Postgres", "API"] },
      { key: "Design", tags: ["Figma", "UX", "Prototyping", "UI"] },
      { key: "ML", tags: ["ML", "MLOps", "Scikit-Learn", "PyTorch", "NLP"] },
      { key: "PM", tags: ["PM", "Roadmapping", "Discovery", "Analytics"] },
    ],
    []
  );

  const [selectedCats, setSelectedCats] = useState<string[]>([]);

  // Wishlist persistence
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wishlist_courses");
      if (raw) setWishlist(new Set(JSON.parse(raw)));
    } catch {
      /* noop: ignore parsing errors */
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("wishlist_courses", JSON.stringify(Array.from(wishlist)));
  }, [wishlist]);

  // Lightweight skeleton loading on filter changes
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [q, level, mode, duration, minRating, sortBy, sortDir, selectedCats]);

  const toggleCat = (key: string) => {
    setSelectedCats((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };
  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return COURSES.filter((c) => {
      const matchesQ = `${c.title} ${c.provider} ${c.tags.join(" ")}`
        .toLowerCase()
        .includes(q.toLowerCase());
      const matchesLevel = level === "All" || c.level === level;
      const matchesMode = mode === "All" || c.mode === mode;
      const matchesDuration =
        duration === "All" ||
        (duration === "<6" && c.durationWeeks < 6) ||
        (duration === "6-8" && c.durationWeeks >= 6 && c.durationWeeks <= 8) ||
        (duration === ">8" && c.durationWeeks > 8);
      const matchesRating = c.rating >= minRating;
      const matchesCategory =
        selectedCats.length === 0 ||
        selectedCats.some((cat) =>
          CATEGORIES.find((cdef) => cdef.key === cat)?.tags.some((t) =>
            c.tags.includes(t)
          )
        );
      return (
        matchesQ &&
        matchesLevel &&
        matchesMode &&
        matchesDuration &&
        matchesRating &&
        matchesCategory
      );
    });
  }, [q, level, mode, duration, minRating, selectedCats, CATEGORIES]);

  const results = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "Rating") return (a.rating - b.rating) * dir;
      if (sortBy === "Learners") return (a.learners - b.learners) * dir;
      // Duration
      return (a.durationWeeks - b.durationWeeks) * dir;
    });
    return arr;
  }, [filtered, sortBy, sortDir]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="gradient-hero py-12 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-2">
                Level-up your skills
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Curated courses that align with internship tracks. Learn faster
                with hands-on projects.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  Project-based
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Industry-aligned
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                  Certificates
                </span>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-xl p-[1px] bg-gradient-to-tr from-primary/40 via-accent/30 to-primary/40 shadow-smooth"
            >
              <div className="rounded-[11px] bg-card p-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/40">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm font-semibold">
                        Top Instructors
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Expert-led learning
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/40">
                    <PlayCircle className="h-5 w-5 text-accent" />
                    <div>
                      <div className="text-sm font-semibold">Hands-on Labs</div>
                      <div className="text-xs text-muted-foreground">
                        Build real projects
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/40">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    <div>
                      <div className="text-sm font-semibold">4–10 weeks</div>
                      <div className="text-xs text-muted-foreground">
                        Flexible schedules
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/40">
                    <Building2 className="h-5 w-5 text-sky-600" />
                    <div>
                      <div className="text-sm font-semibold">
                        Industry Partners
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Career aligned
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-gradient-to-br from-fuchsia-500/5 via-primary/5 to-violet-500/5">
        <div className="container">
          <div className="rounded-xl border bg-card/60 p-4 md:p-5 shadow-smooth">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="col-span-2 flex items-center gap-2 rounded-lg border px-3 py-2 bg-background">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by course, provider, tag..."
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-background">
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as Level)}
                  className="w-full bg-transparent outline-none text-sm"
                >
                  {(
                    ["All", "Beginner", "Intermediate", "Advanced"] as const
                  ).map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-background">
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as Mode)}
                  className="w-full bg-transparent outline-none text-sm"
                >
                  {["All", "Self-paced", "Instructor-led"].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <label className="text-sm flex items-center gap-2">
                Duration:
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as DurationFilter)}
                  className="bg-transparent outline-none text-sm border rounded-md px-2 py-1"
                >
                  {["All", "<6", "6-8", ">8"].map((d) => (
                    <option key={d} value={d}>
                      {d} weeks
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-wrap gap-3 items-center">
                <label className="text-sm flex items-center gap-2">
                  Min rating:
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.1}
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  />
                  <span className="text-xs text-muted-foreground w-8">{minRating.toFixed(1)}</span>
                </label>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="bg-transparent outline-none text-sm border rounded-md px-2 py-1"
                  >
                    {["Rating", "Learners", "Duration"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortDir}
                    onChange={(e) => setSortDir(e.target.value as SortDir)}
                    className="bg-transparent outline-none text-sm border rounded-md px-2 py-1"
                  >
                    {["desc", "asc"].map((d) => (
                      <option key={d} value={d}>
                        {d.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-muted-foreground">{results.length} results</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => toggleCat(c.key)}
                  className={`px-3 py-1 rounded-full text-xs border transition-smooth ${
                    selectedCats.includes(c.key)
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c.key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card overflow-hidden animate-pulse">
                  <div className="h-40 w-full bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-1/3 bg-muted rounded" />
                    <div className="h-5 w-2/3 bg-muted rounded" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-muted rounded" />
                      <div className="h-6 w-20 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No results found. Try adjusting filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group rounded-xl p-[1px] bg-gradient-to-tr from-primary/40 via-accent/30 to-primary/40 shadow-smooth"
                >
                  <div className="rounded-[11px] bg-card border overflow-hidden h-full flex flex-col">
                    <img
                      src={c.cover || "/images/hero.png"}
                      alt={c.title}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> {c.provider}
                      </div>
                      <h3 className="mt-1 font-semibold text-lg leading-snug">
                        {c.title}
                      </h3>
                      <button
                        onClick={() => toggleWishlist(c.id)}
                        aria-label="Toggle wishlist"
                        className={`ml-auto -mt-6 mb-2 self-end inline-flex items-center justify-center h-8 w-8 rounded-full border bg-background hover:bg-muted transition-smooth ${
                          wishlist.has(c.id) ? "text-red-500 border-red-200" : "text-muted-foreground"
                        }`}
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" /> {c.level}
                        </div>
                        <div className="flex items-center gap-2">
                          <PlayCircle className="h-4 w-4" /> {c.mode}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" /> {c.durationWeeks} weeks
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-amber-500" /> {c.rating.toFixed(1)} • {c.learners.toLocaleString()} learners
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {c.tags.map((t) => (
                          <span key={t} className="px-2 py-1 rounded-md text-xs border bg-muted/60">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center justify-between">
                        <Link to="/student" className="text-sm text-muted-foreground hover:text-foreground">
                          View syllabus
                        </Link>
                        {isAuthenticated ? (
                          <Button size="sm" variant="hero">
                            Enroll
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          <GoogleSignInButton />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
