import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Calendar,
  Briefcase,
  Banknote,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import GoogleSignInButton from "@/components/GoogleSignInButton";

type Internship = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Remote" | "Onsite" | "Hybrid";
  duration: string;
  stipend?: string;
  tags: string[];
  logo?: string;
};

const MOCK_DATA: Internship[] = [
  {
    id: "1",
    title: "Frontend Developer Intern",
    company: "SkyLabs",
    location: "Bengaluru, KA",
    type: "Hybrid",
    duration: "3 months",
    stipend: "₹15,000/mo",
    tags: ["React", "TypeScript", "Tailwind"],
    logo: "/images/avatar-industry.jpg",
  },
  {
    id: "2",
    title: "Data Analyst Intern",
    company: "InSight AI",
    location: "Pune, MH",
    type: "Onsite",
    duration: "6 months",
    stipend: "₹20,000/mo",
    tags: ["Python", "SQL", "Tableau"],
    logo: "/images/avatar-industry.jpg",
  },
  {
    id: "3",
    title: "Backend Engineer Intern",
    company: "CloudForge",
    location: "Remote",
    type: "Remote",
    duration: "4 months",
    stipend: "₹18,000/mo",
    tags: ["Node.js", "Postgres", "Docker"],
    logo: "/images/avatar-industry.jpg",
  },
  {
    id: "4",
    title: "UI/UX Design Intern",
    company: "PixelMint",
    location: "Delhi, DL",
    type: "Onsite",
    duration: "3 months",
    stipend: "₹12,000/mo",
    tags: ["Figma", "Prototyping", "UX"],
    logo: "/images/avatar-industry.jpg",
  },
  {
    id: "5",
    title: "ML Engineer Intern",
    company: "DeepWave",
    location: "Hyderabad, TS",
    type: "Hybrid",
    duration: "6 months",
    stipend: "₹25,000/mo",
    tags: ["PyTorch", "NLP", "MLOps"],
    logo: "/images/avatar-industry.jpg",
  },
  {
    id: "6",
    title: "Product Management Intern",
    company: "NovaWorks",
    location: "Mumbai, MH",
    type: "Onsite",
    duration: "2 months",
    tags: ["Roadmapping", "Research", "Analytics"],
    logo: "/images/avatar-industry.jpg",
  },
];

export default function Internships() {
  const { isAuthenticated } = useAuth();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("All");
  const [type, setType] = useState<"All" | "Remote" | "Onsite" | "Hybrid">("All");
  const [paidOnly, setPaidOnly] = useState(false);

  const locations = useMemo(() => {
    const set = new Set(["All", ...MOCK_DATA.map((i) => i.location)]);
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    return MOCK_DATA.filter((i) => {
      const matchesQ = `${i.title} ${i.company} ${i.location} ${i.tags.join(" ")}`
        .toLowerCase()
        .includes(q.toLowerCase());
      const matchesLoc = location === "All" || i.location === location || (location === "Remote" && i.location === "Remote");
      const matchesType = type === "All" || i.type === type;
      const matchesPaid = !paidOnly || Boolean(i.stipend);
      return matchesQ && matchesLoc && matchesType && matchesPaid;
    });
  }, [q, location, type, paidOnly]);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="gradient-hero py-12 md:py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Find your next internship
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Browse curated roles from verified partners. Apply with 1-click and track your progress.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">Verified Companies</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">NEP Aligned</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">1-click Apply</span>
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
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm font-semibold">1200+</div>
                      <div className="text-xs text-muted-foreground">Partner companies</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/40">
                    <Briefcase className="h-5 w-5 text-accent" />
                    <div>
                      <div className="text-sm font-semibold">5k+</div>
                      <div className="text-xs text-muted-foreground">Open roles</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/40">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                    <div>
                      <div className="text-sm font-semibold">2–6 months</div>
                      <div className="text-xs text-muted-foreground">Typical durations</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/40">
                    <Banknote className="h-5 w-5 text-amber-600" />
                    <div>
                      <div className="text-sm font-semibold">Stipend</div>
                      <div className="text-xs text-muted-foreground">Paid opportunities</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-gradient-to-br from-indigo-500/5 via-primary/5 to-teal-500/5">
        <div className="container">
          <div className="rounded-xl border bg-card/60 p-4 md:p-5 shadow-smooth">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="col-span-2 flex items-center gap-2 rounded-lg border px-3 py-2 bg-background">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by role, company, tag..."
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-background">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm"
                >
                  {locations.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-background">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as "All" | "Remote" | "Onsite" | "Hybrid")
                  }
                  className="w-full bg-transparent outline-none text-sm"
                >
                  {(["All", "Remote", "Onsite", "Hybrid"] as const).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <label className="text-sm flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={paidOnly}
                  onChange={(e) => setPaidOnly(e.target.checked)}
                />
                Paid only
              </label>
              <div className="text-xs text-muted-foreground">{filtered.length} results</div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-10">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No results found. Try adjusting filters.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group rounded-xl p-[1px] bg-gradient-to-tr from-primary/40 via-accent/30 to-primary/40 shadow-smooth"
                >
                  <div className="rounded-[11px] bg-card border p-5 h-full flex flex-col">
                    <div className="flex items-start gap-3">
                      <img
                        src={job.logo || "/logo.png"}
                        alt={job.company}
                        className="h-12 w-12 rounded-lg object-cover border"
                        loading="lazy"
                      />
                      <div className="min-w-0">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Building2 className="h-4 w-4" /> {job.company}
                        </div>
                        <h3 className="mt-1 font-semibold text-lg leading-snug truncate">
                          {job.title}
                        </h3>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {job.duration}
                      </div>
                      {job.stipend && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Banknote className="h-4 w-4" />
                          {job.stipend}
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 rounded-md text-xs border bg-muted/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <Link to={`/industry`} className="text-sm text-muted-foreground hover:text-foreground">
                        View company
                      </Link>
                      {isAuthenticated ? (
                        <Button size="sm" variant="hero">
                          Apply
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <GoogleSignInButton />
                      )}
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
