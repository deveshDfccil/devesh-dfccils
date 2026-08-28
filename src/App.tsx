import { useState, useEffect, useRef, useMemo } from "react";

/* ── GLOBAL STYLES ── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; background: #030712; color: white; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #030712; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#7c3aed,#ec4899,#06b6d4); border-radius: 2px; }

    @keyframes fadeUp       { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:none; } }
    @keyframes scaleIn      { from { opacity:0; transform:scale(.88); }        to { opacity:1; transform:scale(1); } }
    @keyframes blink        { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes gradShift    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    @keyframes spin         { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes spinR        { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
    @keyframes pulse        { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.96)} }
    @keyframes shimmer      { from{background-position:-200% center} to{background-position:200% center} }
    @keyframes marq         { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    @keyframes particleDrift { 0%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.1)} 66%{transform:translate(-20px,15px) scale(.9)} 100%{transform:translate(0,0) scale(1)} }
    @keyframes petalSway { 
      0% { transform: rotate(0deg) translateY(0); filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.8)); } 
      25% { transform: rotate(15deg) translateY(-5px); filter: drop-shadow(0 0 15px rgba(249, 115, 22, 0.9)); }
      50% { transform: rotate(0deg) translateY(0); filter: drop-shadow(0 0 20px rgba(251, 146, 60, 1)); } 
      75% { transform: rotate(-15deg) translateY(-5px); filter: drop-shadow(0 0 15px rgba(249, 115, 22, 0.9)); }
      100% { transform: rotate(0deg) translateY(0); filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.8)); }
    }
    @keyframes centerGlow {
      0%, 100% { r: 18px; filter: drop-shadow(0 0 10px rgba(251, 146, 60, 0.8)); }
      50% { r: 22px; filter: drop-shadow(0 0 20px rgba(251, 146, 60, 1)); }
    }
    @keyframes twinkle {
      0%, 100% { opacity: .28; transform: scale(1);   }
      50%      { opacity: 1;   transform: scale(1.8); }
    }
    @keyframes shootStar {
      0%   { transform: translate(0,0); opacity: 0; }
      4%   { opacity: 1; }
      24%  { transform: translate(-360px, 240px); opacity: 0; }
      100% { transform: translate(-360px, 240px); opacity: 0; }
    }

    .syne      { font-family: 'Syne', sans-serif; }
    .mono      { font-family: 'JetBrains Mono', monospace; }

    .text-shimmer {
      background: linear-gradient(90deg, #a78bfa, #f472b6, #34d399, #60a5fa, #a78bfa);
      background-size: 300% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 4s linear infinite;
    }

    .reveal { opacity:0; transform:translateY(24px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
    .reveal.visible { opacity:1; transform:none; }
    .reveal-l { opacity:0; transform:translateX(-24px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
    .reveal-l.visible { opacity:1; transform:none; }
    .reveal-r { opacity:0; transform:translateX(24px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
    .reveal-r.visible { opacity:1; transform:none; }

    .card-lift { transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s; }
    .card-lift:hover { transform: translateY(-5px); }

    .skill-pill { position: relative; overflow: hidden; transition: color .25s, border-color .25s; }
    .skill-pill::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(139,92,246,.3), rgba(236,72,153,.3));
      transform: scaleX(0);
      transform-origin: left;
      transition: transform .3s cubic-bezier(.16,1,.3,1);
    }
    .skill-pill:hover::before { transform: scaleX(1); }
    .skill-pill span { position: relative; z-index: 1; }

    .nav-link { position: relative; }
    .nav-link::after { content:''; position:absolute; bottom:-3px; left:0; width:0; height:2px; background:linear-gradient(90deg,#38bdf8,#a78bfa); transition:width .3s; }
    .nav-link:hover::after, .nav-link.active::after { width: 100%; }

    .photo-frame { position: relative; width: clamp(150px, 30vw, 280px); height: clamp(150px, 30vw, 280px); margin: 0 auto; }
    .photo-circle {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      border-radius: 50%; overflow: hidden;
      border: 3px solid rgba(99,179,237,0.7);
      z-index: 5; background: #030712;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 30px rgba(56,189,248,0.4), 0 0 15px rgba(6,182,212,0.3);
    }
    .photo-circle img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
    .photo-ring { position:absolute; top:-5px; left:-5px; right:-5px; bottom:-5px; border-radius:50%; border:2px dashed rgba(99,179,237,0.4); animation:spin 25s linear infinite; }
    .photo-ring-2 { position:absolute; top:-15px; left:-15px; right:-15px; bottom:-15px; border-radius:50%; border:1px solid rgba(6,182,212,0.3); animation:spinR 30s linear infinite; }
    .particle { position:absolute; width:3px; height:3px; border-radius:50%; background:#38bdf8; filter:blur(1px); animation:particleDrift 8s linear infinite; }

    @media (max-width: 1024px) {
      .hero-grid { grid-template-columns: 1fr !important; text-align: center; gap: 1.25rem !important; }
      .hero-image-container { margin: 0 auto; order: -1; }
    }
    @media (max-width: 768px) {
      .nav-links-desktop { display: none !important; }
      section { padding: 2.5rem 1rem !important; }
      h1 { font-size: clamp(1.8rem, 7vw, 5rem) !important; }
    }
    @media (max-width: 480px) {
      section { padding: 2rem 1rem !important; }
      h1 { font-size: clamp(1.3rem, 5vw, 3rem) !important; }
      p { font-size: 0.8rem !important; }
    }
  `}</style>
);

/* ── DATA ── */
const DATA = {
  name: ["DEVESH", "PRATAP SINGH"],
  role: "React Developer",
  tagline: "React.js · Redux Toolkit · Tailwind CSS · MySQL · REST API Integration",
  email: "devesh639281@gmail.com",
  phone: "+91-6392814739",
  location: "Noida, Sector 58, Uttar Pradesh, India",
  links: {
    linkedin: "https://linkedin.com/in/merndevesh",
    github: "https://github.com/deveshDfccil/",
  },
  about:
    "React Developer with 1.5+ years of experience building production-grade web applications across product-based and government platforms. Currently building GT Infiniti, a transportation platform, at GreenSoft Solutions Pvt. Ltd., working across React.js, Tailwind CSS, MySQL (stored procedures) and ASP.NET. Previously, at Cetpa Infotech, independently led the Training Management System and Task Management System end-to-end for DFCCIL (Ministry of Railways, Government of India). Skilled in bug resolution, UI/UX enhancement, and REST API integration across enterprise platforms.",
  stats: [
    { label: "Years Exp",   value: "1.5+", color: "#a78bfa", glow: "rgba(167,139,250,.4)" },
    { label: "Companies",   value: "2",  color: "#f472b6", glow: "rgba(244,114,182,.4)" },
    { label: "Systems Led", value: "2",  color: "#34d399", glow: "rgba(52,211,153,.4)"  },
    { label: "MERN Stack",  value: "∞",  color: "#fb923c", glow: "rgba(251,146,60,.4)"  },
  ],
  skills: {
    Frontend:     { items: ["React.js","Next.js","JavaScript (ES6+)","TypeScript","HTML5","CSS3","Tailwind CSS","Bootstrap","Shadcn/UI"], color: "#a78bfa" },
    "State Mgmt": { items: ["Redux Toolkit","Redux","useState","useEffect","useCallback","useMemo","useRef"], color: "#38bdf8" },
    "API & Tools":{ items: ["Axios","REST APIs","Interceptors","Axios Instances","Bhasini Plugin","Internal Component Libraries"], color: "#34d399" },
    Backend:      { items: ["Node.js","Express.js","MongoDB","JWT Auth","REST API Design","ASP.NET","MySQL","SQL Stored Procedures"], color: "#fb923c" },
    DevTools:     { items: ["Git","GitHub","Azure DevOps","Postman","VS Code","MS Office"], color: "#f472b6" },
    Concepts:     { items: ["RBAC","Code Splitting","Form Validation","Push Notifications","Audit Trails"], color: "#a3e635" },
  },
  experience: [
    {
      company: "GreenSoft Solutions Pvt. Ltd.",
      sub: "Product-Based Company · GT Infiniti — Transportation Platform",
      role: "React Developer",
      period: "Jun 2026 – Present",
      location: "Dwarka Sector 8, New Delhi (near IGI Airport)",
      project: "GT Infiniti — Transportation Platform",
      current: true,
      color: "#f472b6",
      tech: ["React.js","Tailwind CSS","MySQL","SQL Stored Procedures","ASP.NET"],
      bullets: [
        "Joined as a React Developer at GreenSoft, a product-based company building GT Infiniti, an in-house transportation platform.",
        "Built and maintained UI features using React.js and Tailwind CSS, working within the company's proprietary component library (custom dropdowns, input fields & shared UI primitives).",
        "Wrote and integrated MySQL stored procedures to power data-driven components across the platform.",
        "Contributed in a supporting capacity (~2–3%) to ASP.NET backend development alongside core frontend work.",
        "Adapted quickly into a collaborative, well-structured engineering culture within the first three months on the team.",
      ],
    },
    {
      company: "Cetpa Infotech Pvt. Ltd.",
      sub: "E-Governance · DFCCIL · Ministry of Railways, GoI",
      role: "Junior React Developer",
      period: "Jan 2025 – May 2026",
      location: "Noida, UP",
      project: "DFCCIL – Training & Task Management",
      current: false,
      color: "#a78bfa",
      tech: ["React.js","Redux Toolkit","Tailwind CSS","Shadcn/UI","Axios","REST APIs"],
      bullets: [
        "Independently designed, developed & deployed Training Management System and Task Management System for DFCCIL under Ministry of Railways.",
        "Built role-based UIs with multi-level approval workflows, real-time push notifications, dynamic participant management & complete audit trail tracking.",
        "Contributed to 3 additional DFCCIL platforms (Event, Asset & Visitor Management Systems) — bug fixing, UI/UX enhancements & REST API integration.",
        "Implemented Axios interceptors for JWT token management and centralised error handling across enterprise platforms.",
        "Delivered pixel-perfect responsive layouts with Tailwind CSS & Shadcn/UI; integrated Bhasini multilingual API for government accessibility.",
        "Applied React.lazy/Suspense code-splitting for performance optimisation; implemented robust multi-step form validation frameworks.",
      ],
    },
  ],
  projects: [
    {
      num: "01",
      title: "GT Infiniti — Transportation Platform",
      period: "Jun 2026 – Present · GreenSoft Solutions",
      desc: "Product-based transportation platform. Built UI features with React.js & Tailwind CSS using the company's internal component library, backed by MySQL stored procedures and light ASP.NET backend contributions.",
      metrics: ["Internal Component Library","MySQL Stored Procedures","ASP.NET Support","Product-Based"],
      tags: ["React.js","Tailwind CSS","MySQL","ASP.NET"],
      color: "#f472b6",
    },
    {
      num: "02",
      title: "Training Management System (TMS)",
      period: "2025 – May 2026 · DFCCIL, Ministry of Railways",
      desc: "Enterprise training platform with role-based training creation, multi-level approvals, employee enrollment, vendor/session management, real-time notifications, and full audit history.",
      metrics: ["Role-Based UI","Multi-Level Approvals","Real-Time Notifications","Full Audit Trail"],
      tags: ["React.js","Redux Toolkit","Tailwind CSS","Shadcn/UI","Axios","REST APIs"],
      color: "#a78bfa",
    },
    {
      num: "03",
      title: "Task Management System",
      period: "2025 – May 2026 · DFCCIL, Ministry of Railways",
      desc: "Role-based task tracking app — create, assign, delegate, and review tasks with deadline extension workflows; responsive UI with Redux state management.",
      metrics: ["Task Assignment","Deadline Workflows","Redux State","Responsive UI"],
      tags: ["React.js","Redux Toolkit","Tailwind CSS","REST APIs","Axios"],
      color: "#38bdf8",
    },
    {
      num: "04",
      title: "Enterprise Platform Contributions",
      period: "2025 – May 2026 · DFCCIL, Ministry of Railways",
      desc: "Bug fixing, REST API integration, and UI/UX enhancements across Event Management, Asset Management, and Visitor Management Systems.",
      metrics: ["Event Management","Asset Management","Visitor Management","API Integration"],
      tags: ["React.js","REST APIs","UI/UX","Bug Fixing"],
      color: "#34d399",
    },
  ],
  achievements: [
    { icon: "🚦", title: "Product Company",      desc: "GreenSoft — GT Infiniti platform",     color: "#f472b6" },
    { icon: "🏛", title: "Gov. of India Client",  desc: "DFCCIL — Ministry of Railways",        color: "#a78bfa" },
    { icon: "🚀", title: "Sole Frontend Dev",      desc: "Led TMS & Task Mgmt end-to-end",        color: "#38bdf8" },
    { icon: "🌐", title: "Bhasini Integration",    desc: "Multilingual govt accessibility API",    color: "#34d399" },
    { icon: "⚡", title: "Performance Expert",     desc: "React.lazy/Suspense code splitting",     color: "#fb923c" },
  ],
  education: [
    { degree: "M.Tech.", inst: "Goel Institute of Technology & Management, Lucknow", period: "2022 – 2024" },
    { degree: "B.Tech.", inst: "Buddha Institute of Technology, Gorakhpur",           period: "2019 – 2022" },
    { degree: "Diploma in Engineering", inst: "Mahamaya Institute of Technology, Siddharthnagar", period: "2016 – 2019" },
  ],
};

/* ── HOOKS ── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-l, .reveal-r");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── FLOATING PARTICLES ── */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let W = (c.width = window.innerWidth), H = (c.height = window.innerHeight);
    let mx = W / 2, my = H / 2;
    const colors = ["#a78bfa", "#f472b6", "#38bdf8", "#34d399", "#fb923c"];
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4,
      r: Math.random() * 1.5 + .5,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * .4 + .1,
    }));
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onResize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = p.x - mx, dy = p.y - my, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) { p.x += (dx / d) * .5; p.y += (dy / d) * .5; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(167,139,250,${(1 - d / 100) * .12})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: .45 }} />;
}

/* ── NIGHT SKY — full-background twinkling stars + traveling shooting stars ── */
function NightSky() {
  const stars = useMemo(() => Array.from({ length: 140 }, (_, i) => {
    const bright = Math.random() < 0.18; // ~18% are bigger, brighter "hero" stars
    return {
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: bright ? Math.random() * 1.8 + 2.6 : Math.random() * 1.6 + 1.1,
      glow: bright ? 3 : 1.6,
      dur: 1.8 + Math.random() * 3,
      delay: Math.random() * 5,
    };
  }), []);

  const shootingStars = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    top: Math.random() * 50,
    left: 8 + Math.random() * 84,
    dur: 2.2 + Math.random() * 2.4,
    delay: i * 0.35 + Math.random() * 0.5,
    angle: -30 - Math.random() * 20,
  })), []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {stars.map((s) => (
        <div key={s.id} style={{
          position: "absolute", top: `${s.top}%`, left: `${s.left}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: "#fff",
          boxShadow: `0 0 ${s.size * s.glow}px ${s.size * 0.6}px rgba(255,255,255,.85)`,
          animation: `twinkle ${s.dur}s ease-in-out infinite`, animationDelay: `${s.delay}s`,
        }} />
      ))}
      {shootingStars.map((s) => (
        <div key={s.id} style={{
          position: "absolute", top: `${s.top}%`, left: `${s.left}%`,
          transform: `rotate(${s.angle}deg)`,
          animation: `shootStar ${s.dur}s linear infinite`, animationDelay: `${s.delay}s`,
        }}>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#fff", boxShadow: "0 0 10px 3px rgba(255,255,255,1)" }} />
          <div style={{ position: "absolute", top: "50%", right: "100%", width: 120, height: 1.5, transform: "translateY(-50%)", background: "linear-gradient(90deg, transparent, rgba(255,255,255,.9))" }} />
        </div>
      ))}
    </div>
  );
}

/* ── TYPEWRITER ── */
interface TypeWriterProps {
  texts: string[];
  speed?: number;
}
function TypeWriter({ texts, speed = 80 }: TypeWriterProps) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = texts[idx % texts.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (display.length < current.length) setDisplay(current.slice(0, display.length + 1));
        else setTimeout(() => setDeleting(true), 1800);
      } else {
        if (display.length > 0) setDisplay(display.slice(0, -1));
        else { setDeleting(false); setIdx((i) => i + 1); }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [display, deleting, idx, texts]);
  return (
    <span>
      {display}
      <span style={{ borderRight: "2px solid #38bdf8", marginLeft: 2, animation: "blink .9s step-end infinite", display: "inline-block", height: "1em", verticalAlign: "text-bottom" }} />
    </span>
  );
}

/* ── SECTION HEADING ── */
interface SHProps {
  num: string;
  title: string;
  color?: string;
}
function SH({ num, title, color = "#a78bfa" }: SHProps) {
  return (
    <div className="reveal" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
      <span className="mono" style={{ fontSize: ".55rem", letterSpacing: ".2em", color: color + "aa", textTransform: "uppercase" }}>{num}</span>
      <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, ${color}44, transparent)` }} />
      <h2 className="syne" style={{ fontSize: "clamp(1.2rem, 3vw, 1.8rem)", fontWeight: 800, background: `linear-gradient(135deg, ${color}, #fff)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{title}</h2>
    </div>
  );
}

/* ── NAV ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setActive(id); };
  const links = ["home", "about", "experience", "projects", "skills", "contact"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(3,7,18,.9)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,.08)" : "1px solid transparent",
      transition: "all .3s",
    }}>
      <button onClick={() => go("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
        <span className="syne" style={{ fontSize: "1.3rem", fontWeight: 800, background: "linear-gradient(135deg,#38bdf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DPS</span>
        <span className="mono" style={{ fontSize: ".5rem", color: "rgba(255,255,255,.3)", letterSpacing: ".2em" }}>.dev</span>
      </button>
      <div style={{ display: "flex", gap: "1.5rem" }} className="nav-links-desktop">
        {links.map((l) => (
          <button key={l} onClick={() => go(l)} className={`nav-link ${active === l ? "active" : ""}`}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "JetBrains Mono, monospace", fontSize: ".55rem", letterSpacing: ".15em", textTransform: "uppercase", color: active === l ? "#fff" : "rgba(255,255,255,.5)", transition: "color .25s" }}>
            {l}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: ".4rem", padding: ".3rem 0.8rem", borderRadius: 99, background: "rgba(52,211,153,.08)", border: "1px solid rgba(52,211,153,.25)" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", animation: "pulse 2s ease-in-out infinite", display: "inline-block" }} />
        <span className="mono text-shimmer" style={{ fontSize: ".55rem", letterSpacing: ".1em" }}>OPEN TO WORK</span>
      </div>
    </nav>
  );
}

/* ── STAR & MOON ICONS ── */
function StarIcon({ size = 14, color = "#fbbf24" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ filter: `drop-shadow(0 0 6px ${color}aa)` }}>
      <path d="M12 0 L14.6 8.8 L24 12 L14.6 15.2 L12 24 L9.4 15.2 L0 12 L9.4 8.8 Z" fill={color} />
    </svg>
  );
}
function MoonIcon({ size = 22, color = "#e0e7ff" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ filter: `drop-shadow(0 0 8px ${color}99)` }}>
      <path d="M20.5 13.2A8.7 8.7 0 1 1 10.8 3.5a7 7 0 0 0 9.7 9.7Z" fill={color} />
    </svg>
  );
}

/* ── HERO IMAGE FRAME ── */
/* Stars & a moon orbit around the photo instead of sitting below it — keeps the
   image section compact with no extra vertical space. */
const ORBIT_ITEMS = [
  { angle: -20,  size: 15, type: "star", delay: "0s"   },
  { angle: 55,   size: 24, type: "moon", delay: "0.4s" },
  { angle: 130,  size: 11, type: "star", delay: "0.9s" },
  { angle: 195,  size: 13, type: "star", delay: "1.4s" },
  { angle: 260,  size: 10, type: "star", delay: "0.6s" },
  { angle: 320,  size: 12, type: "star", delay: "1.1s" },
];
function OrbitDecor() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {ORBIT_ITEMS.map((o, i) => (
        <div key={i} style={{
          position: "absolute", top: "50%", left: "50%",
          transform: `rotate(${o.angle}deg) translate(var(--orbit-r)) rotate(${-o.angle}deg) translate(-50%,-50%)`,
          animation: "pulse 3s ease-in-out infinite", animationDelay: o.delay,
        }}>
          {o.type === "star" ? <StarIcon size={o.size} /> : <MoonIcon size={o.size} />}
        </div>
      ))}
    </div>
  );
}
function ImageFrame() {
  return (
    <div className="photo-frame hero-image-container">
      <div className="photo-ring" />
      <div className="photo-ring-2" />
      <div className="photo-circle">
        {/* UPDATE THIS WITH YOUR IMAGE URL */}
        <img src="a.jpeg" alt="Devesh Pratap Singh" />
      </div>
      {/* Stars & moon orbiting the photo — radius scales fluidly with the frame */}
      <div style={{ position: "absolute", inset: 0, animation: "spin 40s linear infinite", ["--orbit-r" as any]: "clamp(96px, 17vw, 162px)" }}>
        <OrbitDecor />
      </div>
    </div>
  );
}

/* ── HERO ── */
function Hero() {
  const [mouse, setMouse] = useState({ x: .5, y: .5 });
  useEffect(() => {
    const fn = (e: MouseEvent) => setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: "4rem" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(3,7,18,0.72)" }} />
      <div style={{
        position: "absolute", inset: 0, transition: "all .8s",
        background: `
          radial-gradient(ellipse 90% 70% at ${35 + mouse.x * 15}% ${25 + mouse.y * 20}%, rgba(56,189,248,.15) 0%, transparent 55%),
          radial-gradient(ellipse 70% 50% at ${70 - mouse.x * 10}% ${65 + mouse.y * 10}%, rgba(167,139,250,.1) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 15% 85%, rgba(16,185,129,.08) 0%, transparent 50%)
        `,
      }} />
      <div style={{ position: "absolute", inset: 0, opacity: .03, backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "50px 50px" }} />

      <div style={{
        position: "relative", zIndex: 5, maxWidth: "70rem", margin: "0 auto",
        padding: "2rem 1rem", width: "100%",
        display: "grid", gridTemplateColumns: "1fr auto",
        gap: "clamp(1rem, 3vw, 2.5rem)", alignItems: "center"
      }} className="hero-grid">

        {/* Left Column */}
        <div style={{ animation: "fadeUp .7s .3s cubic-bezier(.16,1,.3,1) both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", padding: ".3rem 0.8rem", borderRadius: 99, background: "rgba(56,189,248,.08)", border: "1px solid rgba(56,189,248,.25)", marginBottom: "1.5rem" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#38bdf8", animation: "pulse 2s ease-in-out infinite", display: "inline-block" }} />
            <span className="mono" style={{ fontSize: ".55rem", letterSpacing: ".15em", color: "#7dd3fc" }}>REACT DEVELOPER · NOIDA, INDIA</span>
          </div>

          {DATA.name.map((word, wi) => (
            <div key={wi} style={{ overflow: "visible", paddingBottom: "0.25rem" }}>
              <h1 className="syne" style={{
                fontSize: "clamp(1.8rem,8vw,6rem)", fontWeight: 800, lineHeight: .95,
                letterSpacing: "-0.02em", wordBreak: "break-word",
                background: wi === 0
                  ? "linear-gradient(135deg,#fff 0%,rgba(255,255,255,.7) 100%)"
                  : "linear-gradient(135deg,#38bdf8,#a78bfa,#f472b6)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                animation: wi === 0
                  ? "fadeUp .7s .5s cubic-bezier(.16,1,.3,1) both"
                  : "fadeUp .7s .7s cubic-bezier(.16,1,.3,1) both, shimmer 4s linear infinite",
              }}>{word}</h1>
            </div>
          ))}

          <div style={{ marginTop: "1rem", marginBottom: "0.75rem", animation: "fadeUp .7s 1s cubic-bezier(.16,1,.3,1) both" }}>
            <span className="mono" style={{ fontSize: "clamp(.75rem,2vw,1rem)", color: "rgba(255,255,255,.6)" }}>
              <TypeWriter texts={["React Developer", "MERN Stack Developer", "UI/UX Enthusiast", "REST API Integrator"]} />
            </span>
          </div>

          <p style={{ maxWidth: 500, color: "rgba(255,255,255,.5)", lineHeight: 1.65, marginBottom: "1.8rem", fontSize: ".85rem", animation: "fadeUp .7s 1.2s cubic-bezier(.16,1,.3,1) both" }}>
            {DATA.about}
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.25rem", flexWrap: "nowrap", marginBottom: "2.5rem", animation: "fadeUp .7s 1.4s cubic-bezier(.16,1,.3,1) both", overflowX: "auto", paddingBottom: "0.5rem" }}>
            <a href={`mailto:${DATA.email}`} style={{
              display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: ".5rem 0.75rem", borderRadius: 6,
              background: "linear-gradient(135deg,#7c3aed,#ec4899)", backgroundSize: "200% 200%", animation: "gradShift 4s ease infinite",
              color: "#fff", fontWeight: 600, fontSize: ".85rem", textDecoration: "none",
              boxShadow: "0 4px 16px rgba(139,92,246,.3)", whiteSpace: "nowrap", flex: "0 0 auto",
            }}>💬 Contact</a>

            <a href={DATA.links.linkedin} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: ".5rem 0.75rem", borderRadius: 6,
              background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.15)",
              color: "rgba(255,255,255,.8)", fontWeight: 500, fontSize: ".85rem", textDecoration: "none", whiteSpace: "nowrap", flex: "0 0 auto",
            }}>💼 LinkedIn</a>

            <a href={DATA.links.github} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: ".5rem 0.75rem", borderRadius: 6,
              background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.15)",
              color: "rgba(255,255,255,.8)", fontWeight: 500, fontSize: ".85rem", textDecoration: "none", whiteSpace: "nowrap", flex: "0 0 auto",
            }}>🐙 GitHub</a>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "nowrap", overflowX: "auto", paddingBottom: "0.5rem", animation: "fadeUp .7s 1.6s cubic-bezier(.16,1,.3,1) both" }}>
            {DATA.stats.map((s, i) => (
              <div key={i} className="card-lift" style={{
                padding: "0.8rem 0.7rem", borderRadius: 12,
                background: "rgba(255,255,255,.03)", border: `1px solid ${s.color}22`,
                position: "relative", overflow: "hidden", minWidth: "70px", flex: "0 0 auto",
              }}>
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 0% 0%, ${s.color}15, transparent 70%)` }} />
                <div className="syne" style={{ fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 800, color: s.color, textShadow: `0 0 15px ${s.glow}`, lineHeight: 1 }}>{s.value}</div>
                <div className="mono" style={{ fontSize: ".5rem", letterSpacing: ".12em", color: "rgba(255,255,255,.4)", textTransform: "uppercase", marginTop: ".2rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ animation: "scaleIn .8s .6s cubic-bezier(.16,1,.3,1) both", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ImageFrame />
        </div>
      </div>
    </section>
  );
}

/* ── ABOUT ── */
function About() {
  return (
    <section id="about" style={{ padding: "3rem 1rem", background: "rgba(3,7,18,0.72)", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,.05), transparent)", pointerEvents: "none" }} />
      <div style={{ maxWidth: "70rem", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SH num="01 /" title="About Me" color="#a78bfa" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: "2rem", alignItems: "start" }}>

          <div>
            <h3 className="reveal syne" style={{ fontSize: "clamp(1rem,3vw,1.5rem)", fontWeight: 700, lineHeight: 1.3, marginBottom: "1rem" }}>
              Building <span className="text-shimmer" style={{ fontStyle: "italic" }}>enterprise-grade</span> and product-based apps.
            </h3>
            <p className="reveal" style={{ color: "rgba(255,255,255,.55)", lineHeight: 1.7, marginBottom: "1.5rem", fontSize: ".85rem", transitionDelay: ".1s" }}>{DATA.about}</p>
            <div className="reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".6rem", transitionDelay: ".2s" }}>
              {DATA.achievements.map((a, i) => (
                <div key={i} className="card-lift" style={{ padding: "0.8rem", borderRadius: 10, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", transition: "all .35s" }}>
                  <span style={{ fontSize: "1.1rem" }}>{a.icon}</span>
                  <div className="syne" style={{ fontSize: ".75rem", fontWeight: 700, color: a.color, marginTop: ".3rem" }}>{a.title}</div>
                  <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,.4)", marginTop: ".15rem" }}>{a.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-r" style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            {/* Contact Card */}
            <div style={{ borderRadius: 14, border: "1px solid rgba(167,139,250,.2)", overflow: "hidden", background: "rgba(255,255,255,.02)" }}>
              <div style={{ padding: ".6rem 1rem", background: "linear-gradient(135deg,rgba(167,139,250,.15),rgba(244,114,182,.1))", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                <span className="mono" style={{ fontSize: ".55rem", letterSpacing: ".18em", color: "rgba(255,255,255,.5)", textTransform: "uppercase" }}>Contact Info</span>
              </div>
              {[["✉", "Email", DATA.email], ["📱", "Phone", DATA.phone], ["📍", "Location", DATA.location]].map(([icon, k, v]) => (
                <div key={k} style={{ display: "flex", gap: ".6rem", padding: ".7rem 1rem", borderBottom: "1px solid rgba(255,255,255,.04)", alignItems: "flex-start" }}>
                  <span style={{ fontSize: ".8rem", marginTop: 2 }}>{icon}</span>
                  <div>
                    <div className="mono" style={{ fontSize: ".5rem", color: "rgba(255,255,255,.3)", textTransform: "uppercase", letterSpacing: ".15em" }}>{k}</div>
                    <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.75)", wordBreak: "break-all", marginTop: ".1rem" }}>{v}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Education Card */}
            <div style={{ borderRadius: 14, border: "1px solid rgba(52,211,153,.2)", overflow: "hidden", background: "rgba(255,255,255,.02)" }}>
              <div style={{ padding: ".6rem 1rem", background: "linear-gradient(135deg,rgba(52,211,153,.1),rgba(20,184,166,.1))", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                <span className="mono" style={{ fontSize: ".55rem", letterSpacing: ".18em", color: "rgba(255,255,255,.5)", textTransform: "uppercase" }}>Education</span>
              </div>
              <div style={{ padding: "1rem" }}>
                {DATA.education.map((e, i) => (
                  <div key={i} style={{ marginBottom: i < DATA.education.length - 1 ? "0.8rem" : 0 }}>
                    <div className="syne" style={{ fontWeight: 700, fontSize: ".85rem", marginBottom: ".2rem" }}>{e.degree}</div>
                    <div style={{ fontSize: ".7rem", color: "rgba(255,255,255,.45)" }}>{e.inst}</div>
                    <div className="mono" style={{ fontSize: ".6rem", color: "rgba(255,255,255,.3)", marginTop: ".15rem" }}>{e.period}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── EXPERIENCE ── */
function Experience() {
  const [open, setOpen] = useState(0);
  return (
    <section id="experience" style={{ padding: "3rem 1rem", background: "rgba(3,7,18,0.72)", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(56,189,248,.04), transparent)", pointerEvents: "none" }} />
      <div style={{ maxWidth: "70rem", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SH num="02 /" title="Experience" color="#38bdf8" />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {DATA.experience.map((exp, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="reveal" style={{
                borderRadius: 14, overflow: "hidden",
                border: `1px solid ${isOpen ? exp.color + "44" : "rgba(255,255,255,.08)"}`,
                background: isOpen ? "rgba(255,255,255,.04)" : "rgba(255,255,255,.02)",
                transition: "all .4s cubic-bezier(.16,1,.3,1)",
                boxShadow: isOpen ? `0 6px 24px ${exp.color}18` : "none",
              }}>
                <div style={{ height: isOpen ? 2 : 0, background: `linear-gradient(90deg, ${exp.color}, transparent)`, transition: "height .3s" }} />
                <button onClick={() => setOpen(isOpen ? -1 : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "1rem 1.2rem", textAlign: "left" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.8rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: exp.color, marginTop: 5, flexShrink: 0, boxShadow: `0 0 ${isOpen ? "10px 3px" : "0 0"} ${exp.color}`, transition: "box-shadow .4s", animation: exp.current ? "pulse 2s ease-in-out infinite" : "none" }} />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap", marginBottom: ".2rem" }}>
                          <span className="syne" style={{ fontSize: "1rem", fontWeight: 800, background: `linear-gradient(135deg,${exp.color},#fff)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{exp.company}</span>
                          {exp.current && <span className="mono" style={{ fontSize: ".5rem", letterSpacing: ".12em", padding: ".1rem .5rem", borderRadius: 99, background: "rgba(52,211,153,.1)", border: "1px solid rgba(52,211,153,.3)", color: "#34d399" }}>CURRENT</span>}
                        </div>
                        <div className="mono" style={{ fontSize: ".55rem", color: "rgba(255,255,255,.35)", marginBottom: ".3rem" }}>{exp.sub}</div>
                        <div style={{ display: "flex", gap: ".3rem", flexWrap: "wrap", alignItems: "center" }}>
                          <span style={{ fontSize: ".75rem", color: "rgba(255,255,255,.7)", fontWeight: 500 }}>{exp.role}</span>
                          <span style={{ color: "rgba(255,255,255,.2)" }}>·</span>
                          <span style={{ fontSize: ".7rem", color: "rgba(255,255,255,.4)" }}>{exp.project}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div className="mono" style={{ fontSize: ".6rem", color: "rgba(255,255,255,.4)" }}>{exp.period}</div>
                      <div className="mono" style={{ fontSize: ".55rem", color: "rgba(255,255,255,.25)", marginTop: ".15rem" }}>{exp.location}</div>
                      <div style={{ fontSize: ".9rem", color: isOpen ? exp.color : "rgba(255,255,255,.3)", marginTop: ".3rem", transition: "transform .3s, color .3s", transform: isOpen ? "rotate(180deg)" : "none", display: "inline-block" }}>↓</div>
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div style={{ padding: "0 1.2rem 1.2rem", animation: "fadeUp .4s cubic-bezier(.16,1,.3,1) both" }}>
                    <div style={{ paddingLeft: "1.2rem", marginBottom: "1rem", display: "flex", flexWrap: "wrap", gap: ".3rem" }}>
                      {exp.tech.map((t) => (
                        <span key={t} className="mono" style={{ fontSize: ".55rem", padding: ".15rem .55rem", borderRadius: 5, background: exp.color + "18", border: `1px solid ${exp.color}33`, color: exp.color }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: ".6rem" }}>
                      {exp.bullets.map((b, j) => (
                        <div key={j} style={{ display: "flex", gap: ".6rem", alignItems: "flex-start", animation: `fadeUp .4s ${j * 80}ms cubic-bezier(.16,1,.3,1) both` }}>
                          <span className="mono" style={{ fontSize: ".6rem", color: exp.color, flexShrink: 0, marginTop: 2, minWidth: 18 }}>0{j + 1}</span>
                          <span style={{ fontSize: ".78rem", color: "rgba(255,255,255,.65)", lineHeight: 1.6 }}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── PROJECTS ── */
function Projects() {
  return (
    <section id="projects" style={{ padding: "3rem 1rem", background: "rgba(3,7,18,0.72)", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(52,211,153,.04), transparent)", pointerEvents: "none" }} />
      <div style={{ maxWidth: "70rem", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SH num="03 /" title="Key Projects" color="#34d399" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "1.2rem" }}>
          {DATA.projects.map((p, i) => (
            <div key={i} className="reveal card-lift" style={{
              borderRadius: 16, border: `1px solid ${p.color}22`,
              background: "rgba(255,255,255,.025)", overflow: "hidden",
              display: "flex", flexDirection: "column", position: "relative",
              transition: "transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s, border-color .35s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = p.color + "55"; e.currentTarget.style.boxShadow = `0 12px 36px ${p.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = p.color + "22"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ height: 2, background: `linear-gradient(90deg, ${p.color}, transparent)` }} />
              <div style={{ padding: "1.2rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.8rem" }}>
                  <span className="mono" style={{ fontSize: ".55rem", color: "rgba(255,255,255,.3)", letterSpacing: ".1em" }}>{p.period}</span>
                  <span className="syne" style={{ fontSize: "2.5rem", fontWeight: 900, lineHeight: 1, color: p.color, opacity: .15 }}>{p.num}</span>
                </div>
                <h3 className="syne" style={{ fontSize: "1rem", fontWeight: 800, marginBottom: ".5rem", color: "#fff" }}>{p.title}</h3>
                <p style={{ fontSize: ".75rem", color: "rgba(255,255,255,.5)", lineHeight: 1.6, marginBottom: "1rem", flex: 1 }}>{p.desc}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".3rem", marginBottom: "1rem" }}>
                  {p.metrics.map((m, j) => (
                    <div key={j} style={{ padding: ".4rem .5rem", borderRadius: 6, background: p.color + "10", border: `1px solid ${p.color}20`, textAlign: "center" }}>
                      <span className="mono" style={{ fontSize: ".55rem", color: p.color + "cc" }}>{m}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".3rem" }}>
                  {p.tags.map((t) => (
                    <span key={t} className="mono" style={{ fontSize: ".5rem", padding: ".15rem .45rem", borderRadius: 4, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.5)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── SKILLS ── */
function Skills() {
  const [active, setActive] = useState<keyof typeof DATA.skills>("Frontend");
  const allItems = Object.values(DATA.skills).flatMap((s) => s.items);

  return (
    <section id="skills" style={{ padding: "3rem 1rem", background: "rgba(3,7,18,0.72)", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(251,146,60,.04), transparent)", pointerEvents: "none" }} />
      <div style={{ maxWidth: "70rem", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SH num="04 /" title="Technical Skills" color="#fb923c" />

        {/* Marquee */}
        <div className="reveal" style={{ borderTop: "1px solid rgba(255,255,255,.06)", borderBottom: "1px solid rgba(255,255,255,.06)", padding: "0.7rem 0", overflow: "hidden", position: "relative", marginBottom: "2rem" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 50, background: "linear-gradient(90deg,#030712,transparent)", zIndex: 1 }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 50, background: "linear-gradient(270deg,#030712,transparent)", zIndex: 1 }} />
          <div style={{ display: "flex", gap: "2rem", width: "max-content", animation: "marq 25s linear infinite" }}>
            {[...allItems, ...allItems].map((sk, i) => (
              <span key={i} className="mono" style={{ fontSize: ".65rem", color: "rgba(255,255,255,.35)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: ".5rem" }}>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#38bdf8", display: "inline-block" }} />
                {sk}
              </span>
            ))}
          </div>
        </div>

        {/* Category Buttons */}
        <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: "1.5rem" }}>
          {(Object.keys(DATA.skills) as (keyof typeof DATA.skills)[]).map((cat) => {
            const isActive = active === cat;
            const col = DATA.skills[cat].color;
            return (
              <button key={cat} onClick={() => setActive(cat)} style={{
                padding: ".4rem 1rem", borderRadius: 8, cursor: "pointer",
                fontFamily: "JetBrains Mono, monospace", fontSize: ".55rem", letterSpacing: ".1em", textTransform: "uppercase",
                border: `1px solid ${isActive ? col + "66" : "rgba(255,255,255,.1)"}`,
                background: isActive ? col + "18" : "rgba(255,255,255,.03)",
                color: isActive ? col : "rgba(255,255,255,.45)",
                transition: "all .25s", boxShadow: isActive ? `0 0 12px ${col}28` : "none",
              }}>
                {cat}
              </button>
            );
          })}
        </div>

        {/* Active Skill Pills */}
        <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", minHeight: 48, marginBottom: "2rem" }}>
          {DATA.skills[active].items.map((sk: string, i: number) => (
            <span key={sk} className="skill-pill mono" style={{
              padding: ".4rem 0.9rem", borderRadius: 8,
              fontSize: ".68rem", border: `1px solid ${DATA.skills[active].color}44`,
              background: DATA.skills[active].color + "12",
              color: DATA.skills[active].color,
              animation: `scaleIn .3s ${i * 50}ms cubic-bezier(.16,1,.3,1) both`,
            }}>
              <span>{sk}</span>
            </span>
          ))}
        </div>

        {/* All Skills Grid */}
        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "0.8rem" }}>
          {Object.entries(DATA.skills).map(([cat, info]) => (
            <div key={cat} className="card-lift" style={{
              borderRadius: 12, border: `1px solid ${info.color}22`,
              background: "rgba(255,255,255,.025)", padding: "1rem",
              transition: "border-color .3s, transform .35s, box-shadow .35s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = info.color + "55"; e.currentTarget.style.boxShadow = `0 6px 18px ${info.color}18`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = info.color + "22"; e.currentTarget.style.boxShadow = "none"; }}>
              <div className="mono" style={{ fontSize: ".52rem", letterSpacing: ".18em", color: info.color + "cc", textTransform: "uppercase", marginBottom: ".6rem", paddingBottom: ".5rem", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", justifyContent: "space-between" }}>
                <span>{cat}</span>
                <span style={{ color: "rgba(255,255,255,.2)" }}>{info.items.length}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem" }}>
                {info.items.map((sk) => (
                  <span key={sk} style={{ fontSize: ".65rem", padding: ".18rem .5rem", borderRadius: 5, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "rgba(255,255,255,.6)", transition: "all .2s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = info.color; e.currentTarget.style.borderColor = info.color + "44"; e.currentTarget.style.background = info.color + "12"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,.6)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.08)"; e.currentTarget.style.background = "rgba(255,255,255,.04)"; }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ── */
function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(DATA.email); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <section id="contact" style={{ padding: "3rem 1rem 2.5rem", background: "rgba(3,7,18,0.72)", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(244,114,182,.05), transparent)", pointerEvents: "none" }} />
      <div style={{ maxWidth: "70rem", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SH num="05 /" title="Let's Talk" color="#f472b6" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "clamp(1.5rem,4vw,2.5rem)", alignItems: "center" }}>
          <div>
            <h2 className="reveal syne" style={{ fontSize: "clamp(2rem,6vw,4rem)", fontWeight: 900, lineHeight: .95, letterSpacing: "-0.02em", marginBottom: "1rem" }}>
              Let's build<br />
              <span className="text-shimmer">something</span><br />
              <span style={{ fontSize: "clamp(.9rem,2.5vw,1.2rem)", fontWeight: 400, color: "rgba(255,255,255,.3)", fontStyle: "italic" }}>remarkable together.</span>
            </h2>
            <p className="reveal" style={{ color: "rgba(255,255,255,.45)", lineHeight: 1.7, marginBottom: "1.5rem", fontSize: ".85rem" }}>
              Open to React.js / MERN Stack roles. Immediate Joiner. Open to Relocation.
            </p>
            <div className="reveal" style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              {[["LinkedIn", DATA.links.linkedin, "#3b82f6"], ["GitHub", DATA.links.github, "#6b7280"]].map(([l, h, col]) => (
                <a key={l} href={h} target="_blank" rel="noreferrer" style={{
                  padding: ".5rem 1.2rem", borderRadius: 8, fontWeight: 600, fontSize: ".75rem",
                  background: col + "20", border: `1px solid ${col}44`, color: col,
                  textDecoration: "none", transition: "all .25s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = col + "35"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = col + "20"; e.currentTarget.style.transform = "none"; }}>
                  {l} ↗
                </a>
              ))}
            </div>
          </div>

          <div className="reveal-r" style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,.08)", overflow: "hidden", background: "rgba(255,255,255,.02)" }}>
            {[
              { k: "Email", v: DATA.email, action: copy, actionLabel: copied ? "Copied ✓" : "Copy" },
              { k: "Phone", v: DATA.phone },
              { k: "Location", v: DATA.location },
            ].map(({ k, v, action, actionLabel }) => (
              <div key={k} style={{ padding: "1rem 1.2rem", borderBottom: "1px solid rgba(255,255,255,.06)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.8rem", flexWrap: "wrap" }}>
                <div>
                  <div className="mono" style={{ fontSize: ".5rem", color: "rgba(255,255,255,.25)", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: ".2rem" }}>{k}</div>
                  <div className="mono" style={{ fontSize: ".7rem", color: "rgba(255,255,255,.75)", wordBreak: "break-all" }}>{v}</div>
                </div>
                {action && (
                  <button onClick={action} style={{
                    padding: ".35rem 0.8rem", borderRadius: 6, border: "none", cursor: "pointer",
                    background: copied ? "linear-gradient(135deg,#34d399,#14b8a6)" : "linear-gradient(135deg,#7c3aed,#ec4899)",
                    color: "#fff", fontWeight: 600, fontSize: ".65rem", flexShrink: 0, transition: "transform .2s",
                  }}>
                    {actionLabel}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer style={{ background: "rgba(3,7,18,0.72)", borderTop: "1px solid rgba(255,255,255,.06)", padding: "1.2rem" }}>
      <div style={{ maxWidth: "70rem", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.8rem" }}>
        <span className="syne" style={{ fontSize: "0.9rem", fontWeight: 800, background: "linear-gradient(135deg,#38bdf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>DEVESH PRATAP SINGH</span>
        <span className="mono" style={{ fontSize: ".5rem", color: "rgba(255,255,255,.25)", letterSpacing: ".15em" }}>© {new Date().getFullYear()} · NOIDA, INDIA · REACT DEVELOPER</span>
      </div>
    </footer>
  );
}

/* ── APP ── */
export default function Portfolio() {
  useScrollReveal();
  return (
    <div style={{ background: "#030712", minHeight: "100vh", color: "#fff" }}>
      <GlobalStyles />
      <NightSky />
      <Particles />
      <div style={{ position: "relative", zIndex: 2 }}>
        <Nav />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}