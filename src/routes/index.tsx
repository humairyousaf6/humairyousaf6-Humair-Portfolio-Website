import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Menu,
  X,
  Brain,
  Sparkles,
  Workflow,
  Server,
  CloudCog,
  Wand2,
} from "lucide-react";
import humairLinkedin from "@/assets/humair-flat.png";
import robotHead from "@/assets/robot-head.png";
import { InteractiveParticleField } from "@/components/InteractiveParticleField";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const profileImg = humairLinkedin;
import { projects } from "@/data/projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Humair — AI/ML & Automation Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Muhammad Humair: Gold Medalist Data Scientist building LLM apps, NLP pipelines, and cloud-native ML systems.",
      },
      { property: "og:title", content: "Muhammad Humair — AI/ML & Automation Engineer" },
      {
        property: "og:description",
        content:
          "Building intelligent systems that automate the complex — from NLP pipelines to cloud-native ML solutions.",
      },
    ],
  }),
  component: Portfolio,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

const techBadges = ["Agentic AI", "Generative AI", "RAG", "MCP", "n8n", "AWS"];

const skillGroups = [
  {
    label: "AI / Machine Learning",
    icon: Brain,
    items: [
      "Python",
      "Pandas",
      "NumPy",
      "Matplotlib / Seaborn",
      "Scikit-learn",
      "TensorFlow",
      "CNN",
      "RNN",
      "NLP",
      "OpenCV",
      "YOLO",
      "XGBoost",
      "MLOps",
    ],
  },
  {
    label: "GenAI, LLM & AI Engineering",
    icon: Sparkles,
    items: [
      "LangChain",
      "CrewAI",
      "RAG",
      "Hugging Face",
      "Prompt Engineering",
      "MCP",
      "Ollama",
      "Claude",
    ],
  },
  {
    label: "Automation & Voice AI",
    icon: Workflow,
    items: [
      "n8n",
      "Make.com",
      "Zapier",
      "Vapi",
      "Twilio",
      "ElevenLabs",
      "Retell AI",
      "Synthflow",
      "Whisper",
      "Zoho",
      "GoHighLevel",
    ],
  },
  {
    label: "Backend & APIs",
    icon: Server,
    items: [
      "JavaScript",
      "TypeScript",
      "Node.js",
      "FastAPI",
      "REST APIs",
      "SQL",
      "Postman",
      "Docker",
      "Git/GitHub",
    ],
  },
  {
    label: "Data, Cloud & Orchestration",
    icon: CloudCog,
    items: [
      "PostgreSQL",
      "Supabase",
      "MongoDB",
      "Pinecone",
      "Chroma",
      "Apache Airflow",
      "AWS",
      "Power BI",
      "Tableau",
      "Metabase",
    ],
  },
  {
    label: "AI-Assisted Dev Tools",
    icon: Wand2,
    items: [
      "Cursor",
      "Codex",
      "GitHub Copilot",
      "Antigravity",
      "Bolt",
      "Replit",
      "Lovable",
      "Colab",
      "VS Code",
    ],
  },
];

const EMAIL = "humairyousaf66@gmail.com";

const YELLOW = "#FFC53D";

function Portfolio() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#" className="flex items-center gap-2">
          <span className="font-display text-lg font-bold tracking-tight">Muhammad Humair</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button onClick={() => setOpen(!open)} className="md:hidden" aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-foreground/80 hover:bg-muted"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

/* Organic yellow blob shape — single SVG path used behind hero & about */
function YellowBlob({ className = "", variant = 1 }: { className?: string; variant?: 1 | 2 }) {
  const path1 =
    "M421.5,322.5Q396,395,322,418.5Q248,442,176,414Q104,386,69,313Q34,240,72,170Q110,100,184,71.5Q258,43,329,77Q400,111,427,175.5Q454,240,421.5,322.5Z";
  const path2 =
    "M408,317Q379,394,304,417.5Q229,441,158,408Q87,375,63,302Q39,229,79,162Q119,95,196,68Q273,41,343,80.5Q413,120,433,180Q453,240,408,317Z";
  return (
    <svg viewBox="0 0 500 500" className={className} aria-hidden="true">
      <path d={variant === 1 ? path1 : path2} fill={YELLOW} />
    </svg>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-6 sm:pt-40 sm:pb-6">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-accent-yellow sm:text-base"
          >
            AI/ML & Automation Engineer
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-[2.75rem] font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-[4.25rem]"
          >
            Hello, my name
            <br />
            is Muhammad Humair
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]"
          >
            Turning ideas into intelligent products through LLMs, intelligent automation workflows,
            and scalable machine learning systems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href={`mailto:${EMAIL}`}
              className="group inline-flex items-center gap-2 rounded-md bg-accent-yellow px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:shadow-card"
            >
              Get in touch{" "}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link
              to="/resume"
              className="inline-flex items-center gap-2 rounded-md border border-foreground/80 bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <Download size={14} /> Resume
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {techBadges.map((label) => (
              <span
                key={label}
                className="rounded-full border border-foreground/30 bg-white px-3 py-1 text-xs font-semibold text-foreground/80"
              >
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right: portrait only */}
        <div className="relative mx-auto h-[360px] w-full max-w-md sm:h-[460px]">
          <img
            src={profileImg}
            alt="Muhammad Humair"
            width={420}
            height={420}
            className="absolute inset-0 m-auto h-[88%] w-[88%] rounded-[42%] object-cover shadow-soft"
          />
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <motion.div {...fadeUp} className="mb-14 flex flex-col items-center">
      <h2 className="font-display text-4xl font-bold sm:text-5xl">{title}</h2>
      <span className="mt-3 h-[3px] w-14 rounded bg-accent-yellow" />
    </motion.div>
  );
}

function About() {
  const stats = [
    { num: "3.68", label: "GPA — Gold Medalist" },
    { num: "2+", label: "Years Industry Experience" },
    { num: "20+", label: "ML & AI Projects Shipped" },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading title="About Me" />

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto]">
          <motion.div {...fadeUp}>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]">
              I'm <span className="font-semibold text-foreground">Humair</span> — a Gold Medalist BS
              Data Science graduate and working as{" "}
              <span className="font-semibold text-foreground">AI/ML Engineer</span>. I specialize in
              building LLM-powered applications, NLP automation pipelines, and cloud-integrated AI
              systems. Passionate about pushing the boundary between research and production-ready
              ML.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://github.com/humairyousaf6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                <Github size={16} /> GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/humairyousaf06"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#0A66C2] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-lg border border-border bg-white p-5 shadow-card"
                >
                  <div className="font-display text-3xl font-bold text-foreground">{s.num}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: interactive circular yellow + portrait */}
          <InteractivePortrait />
        </div>
      </div>
    </section>
  );
}

function InteractivePortrait() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 14, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 120, damping: 14, mass: 0.4 });
  // Yellow circle moves opposite-ish for parallax depth
  const yellowX = useTransform(sx, (v) => v * 0.35);
  const yellowY = useTransform(sy, (v) => v * 0.35);
  const imgX = useTransform(sx, (v) => v * -0.08);
  const imgY = useTransform(sy, (v) => v * -0.08);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    mx.set(e.clientX - cx);
    my.set(e.clientY - cy);
    cursorX.set(e.clientX - r.left - 72);
    cursorY.set(e.clientY - r.top - 24);
  }
  function onLeave() {
    setHovered(false);
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      {...fadeUp}
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={(e) => {
        setHovered(true);
        onMove(e);
      }}
      onMouseLeave={onLeave}
      className="relative mx-auto h-72 w-72 cursor-none sm:h-80 sm:w-80"
    >
      <motion.div
        style={{ x: yellowX, y: yellowY, scale: hovered ? 1.06 : 1 }}
        transition={{ scale: { type: "spring", stiffness: 200, damping: 18 } }}
        className="absolute -inset-4 rounded-full bg-accent-yellow shadow-[0_20px_60px_-15px_rgba(255,197,61,0.6)]"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute -inset-6 rounded-full border-2 border-dashed border-accent-yellow/40"
      />
      <motion.img
        src={robotHead}
        alt="Muhammad Humair portrait"
        loading="lazy"
        width={320}
        height={320}
        style={{ x: imgX, y: imgY }}
        whileHover={{ scale: 1.03 }}
        className="absolute inset-0 h-full w-full rounded-full object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
      />
      <motion.div
        aria-hidden="true"
        style={{ x: cursorX, y: cursorY }}
        initial={false}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.82 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="pointer-events-none absolute left-0 top-0 z-20 hidden h-12 w-36 items-center justify-center gap-1.5 rounded-full border border-accent-yellow/60 bg-foreground/95 px-3 text-background shadow-[0_10px_30px_-8px_rgba(0,0,0,0.45)] backdrop-blur-sm [@media(pointer:fine)]:flex"
      >
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent-yellow" />
        <span className="whitespace-nowrap font-display text-[13px] font-bold italic tracking-wide">
          The World of <span className="text-accent-yellow">AI</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

function Skills() {
  return (
    <section id="skills" className="relative bg-muted/40 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading title="Skills & Expertise" />
        <motion.div {...fadeUp} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g) => (
            <div
              key={g.label}
              className="group relative rounded-2xl transition-transform duration-300 ease-out hover:-translate-y-0.5"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-2 rounded-[1.25rem] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  boxShadow:
                    "0 0 0 2px rgba(255,197,61,0.55), 0 0 24px 6px rgba(255,197,61,0.55), 0 0 60px 18px rgba(255,163,26,0.35)",
                }}
              />
              <div className="relative h-full rounded-2xl border border-border bg-white p-6 shadow-card">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-foreground/70 transition-colors group-hover:bg-accent-yellow group-hover:text-foreground">
                    <g.icon size={16} />
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground">{g.label}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((it) => (
                    <span
                      key={it}
                      className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground/70"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading title="Projects" />

        <div className="space-y-6">
          {projects.map((p, i) => {
            const textLeft = i % 2 === 0;
            return (
              <motion.a
                key={p.badge}
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="group relative block cursor-pointer rounded-xl border-l-[6px] border-y border-r border-border bg-white shadow-card outline-none transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-accent-yellow/70 focus-visible:ring-offset-2"
                style={{ borderLeftColor: YELLOW }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    boxShadow:
                      "0 0 0 2px rgba(255,197,61,0.55), 0 0 24px 6px rgba(255,197,61,0.55), 0 0 60px 18px rgba(255,163,26,0.35)",
                  }}
                />

                <div className="grid md:grid-cols-2">
                  {/* Image first in DOM → stacks on top on mobile */}
                  <div className={`p-3 sm:p-4 ${textLeft ? "md:order-2" : "md:order-1"}`}>
                    <div className="overflow-hidden rounded-lg border border-border">
                      <img
                        src={p.img}
                        alt={p.alt}
                        loading="lazy"
                        width={1600}
                        height={900}
                        className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>

                  <div
                    className={`flex flex-col p-7 sm:p-8 ${textLeft ? "md:order-1" : "md:order-2"}`}
                  >
                    <span
                      className="mb-3 inline-block w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground"
                      style={{ backgroundColor: YELLOW }}
                    >
                      {p.badge}
                    </span>
                    <h3 className="font-display text-[1.35rem] font-bold leading-snug sm:text-2xl">
                      {p.title}
                    </h3>
                    <p className="mt-3 whitespace-normal text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
                      {p.caption}
                    </p>
                    <div className="mt-auto grid grid-cols-[auto_1fr] items-center gap-3 pt-5">
                      <span
                        className="inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold text-foreground"
                        style={{ backgroundColor: YELLOW }}
                      >
                        <Github size={13} /> View Project{" "}
                        <ArrowRight
                          size={13}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                      <span className="flex flex-wrap items-center justify-end gap-1.5">
                        {p.tags.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[10px] font-medium leading-4 text-foreground/80 sm:text-[11px]"
                          >
                            {s}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sending, setSending] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    if (!name || !email || !message) return;
    setSending(true);

    // Save to Supabase as a backup, but do not let an unavailable database block email delivery.
    let stored = false;
    try {
      const { error } = await supabase.from("contact_messages").insert({ name, email, message });
      stored = !error;
    } catch {
      stored = false;
    }

    // Send email notification via Web3Forms
    let emailed = false;
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "27df6e2f-9570-49a6-ab3d-e1bb5ef62bef",
          subject: `New portfolio message from ${name}`,
          from_name: "Portfolio Contact Form",
          name,
          email,
          message,
        }),
      });
      emailed = res.ok;
    } catch {
      emailed = false;
    }

    setSending(false);
    if (!emailed && !stored) {
      toast.error("Couldn't send. Please try again or email me directly.");
      return;
    }
    toast.success("Message sent! I'll get back to you soon.");
    form.reset();
  }

  return (
    <section id="contact" className="relative overflow-hidden">
      <div className="relative overflow-hidden pt-24 pb-4 sm:pt-28 sm:pb-5">
        <div className="relative z-[1] mx-auto max-w-2xl px-6">
          <InteractiveParticleField
            compact
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
          />
          <SectionHeading title="Let's Build Something" />

          <motion.p {...fadeUp} className="-mt-8 mb-10 text-center text-muted-foreground">
            Open to AI/ML roles, freelance projects, and research collaborations. Reach out anytime.
          </motion.p>

          <motion.form {...fadeUp} onSubmit={onSubmit} className="space-y-5">
            <Field label="Name" name="name" type="text" />
            <Field label="Email" name="email" type="email" />
            <Field label="Message" name="message" textarea />
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 rounded-md bg-accent-yellow px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:shadow-card disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send"}
              </button>
            </div>
          </motion.form>

          <motion.div {...fadeUp} className="mt-10 flex justify-center gap-3">
            {[
              { icon: Github, href: "https://github.com/humairyousaf6", label: "GitHub" },
              { icon: Linkedin, href: "https://linkedin.com/in/humairyousaf06", label: "LinkedIn" },
              { icon: Mail, href: `mailto:${EMAIL}`, label: "Email" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background transition-transform hover:-translate-y-0.5"
              >
                <s.icon size={16} />
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Wavy yellow divider */}
      <div className="pointer-events-none relative z-[1] w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          className="block h-28 w-full sm:h-40"
        >
          <path
            d="M0,120 C240,200 480,40 720,100 C960,160 1200,200 1440,120 L1440,200 L0,200 Z"
            fill={YELLOW}
          />
        </svg>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
}) {
  const cls =
    "w-full border-0 border-b border-foreground/30 bg-transparent px-1 py-2 text-sm text-foreground outline-none transition-colors focus:border-foreground";
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-foreground/70">{label}</span>
      {textarea ? (
        <textarea name={name} rows={4} required className={cls + " resize-none"} />
      ) : (
        <input name={name} type={type} required className={cls} />
      )}
    </label>
  );
}

function Footer() {
  return (
    <footer className="bg-accent-yellow/0 py-6 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Muhammad Humair · Built with passion &amp; Python 🐍
    </footer>
  );
}
