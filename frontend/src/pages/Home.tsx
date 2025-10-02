import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Building2,
  Users,
  BookOpen,
  TrendingUp,
  Shield,
  ArrowRight,
} from "lucide-react";
import heroImage from "/images/hero.png";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathForRole } from "@/lib/utils";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const features = [
    {
      icon: BookOpen,
      title: "Streamlined Internships",
      description:
        "Seamless internship applications and management for all stakeholders",
      image: "/images/feature-internships.jpg",
    },
    {
      icon: Shield,
      title: "NEP Compliance",
      description:
        "Fully aligned with National Education Policy guidelines and standards",
      image: "/images/feature-nep.jpg",
    },
    {
      icon: TrendingUp,
      title: "Skill Development",
      description:
        "Pre-internship training modules to enhance student readiness",
      image: "/images/feature-skills.jpg",
    },
  ];

  // Removed steps list because How it works is image-only now
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative overflow-hidden gradient-hero py-12 md:py-10"
      >
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex flex-wrap justify-center items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  NEP Aligned
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                  Secure & Compliant
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  1-click Applications
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-primary to-accent bg-clip-text  pb-2">
                Connecting Students,
                <span className="text-transparent"> Colleges,and Careers</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Streamline your internship journey with our comprehensive
                platform designed for students, industry partners, and faculty.
              </p>

              <div className="flex flex-wrap gap-4 items-center justify-center">
                {isAuthenticated ? (
                  <Link to={dashboardPathForRole(user?.role)}>
                    <Button variant="hero" size="lg">
                      Open Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <GoogleSignInButton />
                )}
                <Link to="/internships">
                  <Button variant="outline" size="lg">
                    Browse Internships
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6">
                {[
                  {
                    n: "15k+",
                    l: "Active Students",
                    icon: Users,
                    bg: "from-emerald-200/60 to-emerald-100/60",
                    badge: "bg-emerald-600",
                    underline: "bg-emerald-500/70",
                  },
                  {
                    n: "1.2k+",
                    l: "Industry Partners",
                    icon: Building2,
                    bg: "from-sky-200/60 to-sky-100/60",
                    badge: "bg-sky-600",
                    underline: "bg-sky-500/70",
                  },
                  {
                    n: "450+",
                    l: "Faculty Mentors",
                    icon: GraduationCap,
                    bg: "from-violet-200/60 to-violet-100/60",
                    badge: "bg-violet-600",
                    underline: "bg-violet-500/70",
                  },
                ].map((s, i) => (
                  <motion.div
                    key={s.l}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i * 0.06 }}
                    viewport={{ once: true, amount: 0.2 }}
                    aria-label={s.l}
                    className={`relative rounded-2xl p-5 border shadow-sm bg-gradient-to-br ${s.bg}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg ${s.badge} text-white flex items-center justify-center shadow-md`}
                      >
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xl md:text-2xl font-bold tracking-tight">
                          {s.n}
                        </div>
                        <div className="text-xs md:text-sm text-muted-foreground">
                          {s.l}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`mt-4 h-[3px] w-16 rounded-full ${s.underline}`}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.01, rotate: -0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Decorative glows */}
              <div className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-primary/40 to-accent/40" />
              <div className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-emerald-400/40 to-primary/40" />
              <div className="rounded-[14px] p-[1px] bg-gradient-to-tr from-primary/40 via-accent/30 to-primary/40 shadow-smooth">
                <img
                  src={heroImage}
                  alt="Students collaborating"
                  className="rounded-[12px] w-full object-cover ring-1 ring-border/50 aspect-video md:aspect-[4/3]"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </motion.div>
          </div>
        </div>
        {/* Subtle background accent */}
        <div className="pointer-events-none absolute -z-10 inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_45%)]" />
      </section>

      {/* Choose Your Portal */}
      <section
        id="choose-portal"
        className="py-16 md:py-20 bg-gradient-to-br from-cyan-500/10 via-primary/10 to-sky-500/10"
      >
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Choose Your Portal
            </h2>
            <p className="text-lg text-muted-foreground">
              Access tailored features designed specifically for your role in
              the internship ecosystem
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                title: "For Students",
                desc: "Find internships, track progress, and build your career",
                to: "/student",
                badgeBg: "bg-primary/10",
                iconColor: "text-primary",
                image: "/images/avatar-student.jpg",
              },
              {
                icon: Building2,
                title: "For Industry",
                desc: "Post opportunities and connect with emerging student talent",
                to: "/industry",
                badgeBg: "bg-accent/10",
                iconColor: "text-accent",
                image: "/images/avatar-industry.jpg",
              },
              {
                icon: Users,
                title: "For Faculty",
                desc: "Monitor students and manage internship programs",
                to: "/faculty",
                badgeBg: "bg-primary/10",
                iconColor: "text-primary",
                image: "/images/avatar-faculty.jpg",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, rotate: -0.5 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                viewport={{ once: true, amount: 0.2 }}
                className={`group relative rounded-xl p-[1px] shadow-smooth bg-gradient-to-r ${
                  card.title === "For Faculty"
                    ? "from-purple-500/40 via-fuchsia-500/30 to-purple-500/40"
                    : i === 0
                    ? "from-primary/40 via-cyan-500/30 to-primary/40"
                    : i === 1
                    ? "from-emerald-500/30 via-primary/40 to-emerald-500/30"
                    : "from-amber-500/30 via-primary/40 to-amber-500/30"
                }`}
              >
                <div className="rounded-[11px] bg-card p-6 h-full relative overflow-hidden text-center">
                  {card.title === "For Faculty" && (
                    <span className="absolute -right-10 top-4 rotate-45 bg-purple-600 text-white text-[10px] px-10 py-1 shadow">
                      Mentor Hub
                    </span>
                  )}
                  {/* Decorative gradient glows for depth */}
                  <div className="pointer-events-none absolute -top-16 -right-14 h-36 w-36 rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-primary/40 to-accent/40 group-hover:opacity-35 transition-opacity" />
                  <div className="pointer-events-none absolute -bottom-16 -left-14 h-28 w-28 rounded-full blur-3xl opacity-20 bg-gradient-to-tr from-accent/40 to-primary/40 group-hover:opacity-30 transition-opacity" />
                  <motion.div
                    className="mb-4 mx-auto h-20 w-20 rounded-full p-[2px] bg-gradient-to-tr from-primary/60 to-accent/60 shadow"
                    initial={{ scale: 0.95 }}
                    whileInView={{ scale: 1 }}
                    whileHover={{ scale: 1.06 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  >
                    <img
                      src={card.image}
                      alt={card.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                      className="h-full w-full rounded-full object-cover bg-card"
                      loading="lazy"
                    />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-muted-foreground mb-4">{card.desc}</p>
                  <Link to={card.to} aria-label={`${card.title} portal`}>
                    <Button
                      variant="hero"
                      aria-label={`${card.title} portal button`}
                    >
                      {card.title.replace("For ", "")} Portal
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section (moved right after Hero) */}
      <section
        id="features"
        className="py-16 md:py-20 bg-gradient-to-br from-indigo-500/10 via-primary/10 to-teal-500/10"
      >
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Our platform offers comprehensive features designed to streamline
              the internship process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true, amount: 0.2 }}
                className={`rounded-xl p-[1px] shadow-smooth bg-gradient-to-r ${
                  index === 0
                    ? "from-primary/40 via-pink-500/30 to-primary/40"
                    : index === 1
                    ? "from-indigo-500/30 via-primary/40 to-indigo-500/30"
                    : "from-teal-500/30 via-primary/40 to-teal-500/30"
                }`}
              >
                <div className="rounded-[11px] bg-card p-6 h-full text-center">
                  <div className="w-full h-40 md:h-44 mb-4 relative overflow-hidden rounded-lg border bg-muted/30">
                    <img
                      src={feature.image as string}
                      alt={feature.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = heroImage as string;
                      }}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <motion.div
                    className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4 mx-auto"
                    initial={{ scale: 0.9, rotate: 0 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.06, rotate: -3 }}
                    transition={{ type: "spring", stiffness: 220, damping: 14 }}
                  >
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works (images only) */}
      <section
        id="how-it-works"
        className="py-16 md:py-20 bg-gradient-to-br from-emerald-500/10 via-primary/10 to-emerald-500/10"
      >
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              How it works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to get started
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              "/images/how-profile.jpg",
              "/images/how-browse.jpg",
              "/images/how-apply.jpg",
            ].map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                viewport={{ once: true, amount: 0.2 }}
                className="w-[22rem] h-[24rem] md:h-[24rem] relative overflow-hidden rounded-xl border bg-muted/30 group"
              >
                <img
                  src={src}
                  alt="How it works"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      heroImage as string;
                  }}
                  className="w-full h-full rounded-xl object-fit transition-transform duration-300 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 "></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started (CTA) */}
      <section id="get-started" className="py-16 md:py-20 gradient-primary">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students, companies, and faculty members already
            using C2C Portal
          </p>
          <div className="flex items-center justify-center">
            {isAuthenticated ? (
              <Link to={dashboardPathForRole(user?.role)}>
                <Button variant="hero" size="lg">
                  Open Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <GoogleSignInButton />
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="py-16 md:py-20 bg-gradient-to-br from-fuchsia-500/10 via-primary/10 to-violet-500/10"
      >
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FAQ's
            </h2>
            <p className="text-lg text-muted-foreground">
              Answers to common questions about using the platform
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35 }}
              className="rounded-xl p-[1px] bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30"
            >
              <details className="group rounded-[11px] border bg-card p-5">
                <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                  How do I apply for internships?
                  <span className="ml-4 text-muted-foreground group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  Create an account, complete your profile, and browse available
                  internships on the Student dashboard. Apply with a single
                  click and track your application status.
                </p>
              </details>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="rounded-xl p-[1px] bg-gradient-to-r from-indigo-500/30 via-primary/20 to-indigo-500/30"
            >
              <details className="group rounded-[11px] border bg-card p-5">
                <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                  Is the portal NEP compliant?
                  <span className="ml-4 text-muted-foreground group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  Yes. Our workflows and reporting are aligned with NEP
                  guidelines, enabling streamlined approvals and audits.
                </p>
              </details>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="rounded-xl p-[1px] bg-gradient-to-r from-emerald-500/30 via-primary/20 to-emerald-500/30"
            >
              <details className="group rounded-[11px] border bg-card p-5">
                <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                  Can companies post opportunities?
                  <span className="ml-4 text-muted-foreground group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  Absolutely. Industry partners can register, post roles, and
                  manage applicants through the Industry dashboard.
                </p>
              </details>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="rounded-xl p-[1px] bg-gradient-to-r from-amber-500/30 via-primary/20 to-amber-500/30"
            >
              <details className="group rounded-[11px] border bg-card p-5">
                <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                  Is there any fee for students?
                  <span className="ml-4 text-muted-foreground group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  No. Students can use the platform for free. Institutions and
                  industry partners may have subscription plans based on
                  features and scale.
                </p>
              </details>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="rounded-xl p-[1px] bg-gradient-to-r from-pink-500/30 via-primary/20 to-pink-500/30"
            >
              <details className="group rounded-[11px] border bg-card p-5">
                <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                  How do you secure user data?
                  <span className="ml-4 text-muted-foreground group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  We use industry best practices including encryption in
                  transit, role-based access control, regular backups, and audit
                  logs to keep your data safe.
                </p>
              </details>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="rounded-xl p-[1px] bg-gradient-to-r from-cyan-500/30 via-primary/20 to-cyan-500/30"
            >
              <details className="group rounded-[11px] border bg-card p-5">
                <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                  Can faculty track student progress?
                  <span className="ml-4 text-muted-foreground group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  Yes. Faculty dashboards include student milestones, activity
                  logs, and downloadable reports to simplify evaluations and
                  approvals.
                </p>
              </details>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35, delay: 0.3 }}
              className="rounded-xl p-[1px] bg-gradient-to-r from-violet-500/30 via-primary/20 to-violet-500/30"
            >
              <details className="group rounded-[11px] border bg-card p-5">
                <summary className="cursor-pointer list-none font-medium flex items-center justify-between">
                  How do I get support?
                  <span className="ml-4 text-muted-foreground group-open:rotate-180 transition-transform">
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">
                  Visit the Contact page to reach our support team or email us
                  via the address listed there. We typically respond within
                  24–48 hours.
                </p>
              </details>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
