import { useState, useEffect, useRef } from "react";

const C = {
  orange: "#E85D04",
  orangeLight: "#FF8C42",
  orangeDark: "#9C3C00",
  cream: "#F5F0E8",
  charcoal: "#1A1A18",
  mid: "#3A3832",
  muted: "#7A7568",
  cardBg: "#F9F5EE",
  border: "rgba(232,93,4,0.18)",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', sans-serif; background: ${C.cream}; color: ${C.charcoal}; overflow-x: hidden; }
  body::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 999; opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
  @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
`;

// ── ICONS ──────────────────────────────────────────
const PrinterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
);
const CncIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M8 12h8M12 8v8"/>
  </svg>
);
const DesignIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const TruckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.orangeLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.orangeLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.34 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.04 6.04l1.12-1.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15.17z"/>
  </svg>
);
const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.orangeLight} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

// ── NAV ────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = ["services","process","materials","pricing","gallery"];
  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding: scrolled ? "0.75rem 3rem" : "1.2rem 3rem",
      background:"rgba(245,240,232,0.9)", backdropFilter:"blur(12px)",
      borderBottom:`1px solid ${C.border}`, transition:"padding 0.3s",
    }}>
      <a href="#" style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.8rem", letterSpacing:"0.06em", color:C.charcoal, textDecoration:"none"}}>
        Engineering<span style={{color:C.orange}}>Industries</span>
      </a>
      <div style={{display:"flex", alignItems:"center", gap:"2.5rem"}}>
        {links.map(l => (
          <a key={l} href={`#${l}`} style={{fontSize:"0.8rem", fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:C.mid, textDecoration:"none"}}>
            {l}
          </a>
        ))}
        <a href="#contact" style={{
          background:C.orange, color:"#fff", fontSize:"0.8rem", fontWeight:600,
          letterSpacing:"0.08em", padding:"0.5rem 1.4rem", borderRadius:"4px", textDecoration:"none",
        }}>Get a Quote</a>
      </div>
    </nav>
  );
}

// ── HERO ───────────────────────────────────────────
function Hero() {
  const services = [
    { icon: <PrinterIcon />, name: "FDM 3D Printing", sub: "PLA · PETG · ABS · TPU · ASA" },
    { icon: <CncIcon />, name: "Wood CNC Routing", sub: "Signs · panels · parts" },
  ];
  return (
    <section id="hero" style={{minHeight:"100vh", display:"flex", alignItems:"center", padding:"8rem 3rem 5rem", position:"relative", overflow:"hidden", background:C.cream}}>
      <div style={{position:"absolute", bottom:"-2rem", right:"-1rem", fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(8rem,18vw,22rem)", color:"rgba(232,93,4,0.06)", lineHeight:1, pointerEvents:"none", userSelect:"none", whiteSpace:"nowrap"}}>EI</div>
      <div style={{display:"grid", gridTemplateColumns:"1fr 0.85fr", gap:"4rem", alignItems:"center", maxWidth:1200, margin:"0 auto", width:"100%"}}>
        {/* Left */}
        <div style={{animation:"fadeUp 0.7s ease both"}}>
          <div style={{display:"inline-flex", alignItems:"center", gap:"0.5rem", fontFamily:"'DM Mono',monospace", fontSize:"0.75rem", letterSpacing:"0.14em", textTransform:"uppercase", color:C.orange, border:`1px solid ${C.orange}`, padding:"0.35rem 0.85rem", borderRadius:"100px", marginBottom:"1.5rem"}}>
            <span style={{width:7, height:7, borderRadius:"50%", background:C.orange, display:"inline-block", animation:"pulse 2s infinite"}} />
            Custom Engineering Services
          </div>
          <h1 style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(3.5rem,7vw,7rem)", lineHeight:0.95, letterSpacing:"0.02em", color:C.charcoal, marginBottom:"1.5rem"}}>
            Built to<br/><span style={{color:C.orange}}>Spec.</span><br/>Made to<br/>Last.
          </h1>
          <p style={{fontSize:"1.1rem", lineHeight:1.75, color:C.mid, maxWidth:480, marginBottom:"2.5rem", fontWeight:300}}>
            From detailed 3D-printed toys and functional parts to precision CNC-routed wood components — we turn your designs into real, tangible objects.
          </p>
          <div style={{display:"flex", gap:"1rem", flexWrap:"wrap"}}>
            <a href="#contact" style={{display:"inline-flex", alignItems:"center", gap:"0.5rem", background:C.orange, color:"#fff", fontSize:"0.9rem", fontWeight:600, letterSpacing:"0.06em", padding:"0.85rem 2rem", borderRadius:"4px", textDecoration:"none"}}>Get a Free Quote →</a>
            <a href="#services" style={{display:"inline-flex", alignItems:"center", gap:"0.5rem", background:"transparent", color:C.charcoal, fontSize:"0.9rem", fontWeight:500, letterSpacing:"0.06em", padding:"0.85rem 2rem", borderRadius:"4px", border:`1.5px solid ${C.charcoal}`, textDecoration:"none"}}>Our Services</a>
          </div>
          <div style={{display:"flex", gap:"2rem", marginTop:"3rem", paddingTop:"2rem", borderTop:`1px solid ${C.border}`}}>
            {[["50+","Materials Available"],["0.1mm","Print Resolution"],["48hr","Turnaround (typical)"]].map(([n,l]) => (
              <div key={l}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.4rem", color:C.charcoal, lineHeight:1}}>{n}</div>
                <div style={{fontSize:"0.75rem", color:C.muted, letterSpacing:"0.08em", textTransform:"uppercase", marginTop:"0.2rem"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Right card */}
        <div style={{position:"relative", animation:"fadeUp 0.7s 0.15s ease both", opacity:1}}>
          <div style={{background:C.charcoal, borderRadius:10, padding:"2rem", color:"#fff", position:"relative", overflow:"hidden"}}>
            <div style={{position:"absolute", top:"-40%", right:"-20%", width:"70%", paddingBottom:"70%", borderRadius:"50%", background:"radial-gradient(circle, rgba(232,93,4,0.22) 0%, transparent 70%)", pointerEvents:"none"}} />
            <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.7rem", letterSpacing:"0.16em", textTransform:"uppercase", color:C.orangeLight, marginBottom:"1.2rem"}}>// Active Capabilities</div>
            <div style={{display:"flex", flexDirection:"column", gap:"0.75rem"}}>
              {services.map(s => (
                <div key={s.name} style={{display:"flex", alignItems:"center", gap:"1rem", padding:"1rem 1.2rem", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"4px"}}>
                  <div style={{width:40, height:40, borderRadius:"4px", background:"rgba(232,93,4,0.18)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:C.orangeLight}}>{s.icon}</div>
                  <div>
                    <div style={{fontWeight:500, fontSize:"0.95rem"}}>{s.name}</div>
                    <div style={{fontSize:"0.75rem", color:"rgba(255,255,255,0.45)", marginTop:"0.1rem"}}>{s.sub}</div>
                  </div>
                  <span style={{marginLeft:"auto", fontFamily:"'DM Mono',monospace", fontSize:"0.68rem", letterSpacing:"0.08em", padding:"0.25rem 0.6rem", borderRadius:"100px", background:"rgba(232,93,4,0.2)", color:C.orangeLight}}>AVAILABLE</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{position:"absolute", bottom:"-1.5rem", left:"-1.5rem", background:C.cream, border:`1px solid ${C.border}`, borderRadius:10, padding:"1rem 1.3rem", display:"flex", alignItems:"center", gap:"0.75rem", boxShadow:"0 8px 24px rgba(0,0,0,0.08)"}}>
            <div style={{width:10, height:10, borderRadius:"50%", background:"#22c55e", flexShrink:0, animation:"pulse 2.5s infinite"}} />
            <div style={{fontSize:"0.78rem", color:C.mid}}>
              <strong style={{display:"block", fontWeight:600, color:C.charcoal, fontSize:"0.82rem"}}>Ready to produce</strong>
              Send your files — we'll get started today
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── TICKER ─────────────────────────────────────────
function Ticker() {
  const items = ["3D Printing","CNC Routing","Custom Parts","Functional Prototypes","Wood Engraving","Toy Design","Engineering Services","Fast Turnaround"];
  const doubled = [...items, ...items];
  return (
    <div style={{background:C.charcoal, padding:"0.9rem 0", overflow:"hidden", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{display:"flex", gap:"3rem", whiteSpace:"nowrap", animation:"ticker 28s linear infinite"}}>
        {doubled.map((t, i) => (
          <span key={i} style={{display:"inline-flex", alignItems:"center", gap:"0.75rem", fontFamily:"'DM Mono',monospace", fontSize:"0.78rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", flexShrink:0}}>
            <span style={{width:5, height:5, borderRadius:"50%", background:C.orange, display:"inline-block", flexShrink:0}} />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── SERVICES ───────────────────────────────────────
function Services() {
  const matProps = [["Strength",85],["Detail",95],["Flexibility",60],["Heat Resist.",70]];
  return (
    <section id="services" style={{padding:"6rem 3rem", background:"#fff"}}>
      <div style={{maxWidth:1200, margin:"0 auto"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2rem", alignItems:"end", marginBottom:"3.5rem"}}>
          <div>
            <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.orange, marginBottom:"0.75rem"}}>// What We Do</div>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,5vw,4rem)", letterSpacing:"0.02em", lineHeight:1, color:C.charcoal}}>Our Core<br/>Services</h2>
          </div>
          <p style={{fontSize:"1rem", lineHeight:1.75, color:C.muted, fontWeight:300}}>We specialize in two powerful fabrication methods covering a wide range of custom manufacturing needs — from intricate one-offs to small production runs.</p>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem"}}>
          {/* Featured */}
          <div style={{background:C.charcoal, color:"#fff", borderRadius:10, padding:"2rem", gridColumn:"span 2", display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:"2rem", alignItems:"center", position:"relative", overflow:"hidden"}}>
            <div>
              <div style={{display:"flex", alignItems:"center", gap:"0.5rem", fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.14em", textTransform:"uppercase", color:C.orangeLight, marginBottom:"0.75rem"}}>
                <PrinterIcon /> 3D Printing
              </div>
              <h3 style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", letterSpacing:"0.03em", color:"#fff", marginBottom:"0.75rem"}}>FDM<br/>3D Printing</h3>
              <p style={{fontSize:"0.9rem", lineHeight:1.7, color:"rgba(255,255,255,0.55)", fontWeight:300}}>From functional engineering parts that need strength and heat resistance to toys and collectibles — we print it all with FDM technology. Upload your STL and get a quote within hours.</p>
              <div style={{marginTop:"1.5rem", display:"flex", flexDirection:"column", gap:"0.5rem"}}>
                {["Toys, figures & collectibles","Functional mechanical parts & enclosures","Prototypes & proof-of-concept models","Multi-material & flexible parts (TPU)","Layer heights from 0.1mm to 0.3mm"].map(f => (
                  <div key={f} style={{display:"flex", alignItems:"center", gap:"0.6rem", fontSize:"0.82rem", color:"rgba(255,255,255,0.65)"}}>
                    <span style={{width:18, height:18, borderRadius:"50%", background:"rgba(232,93,4,0.2)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"0.65rem", color:C.orange}}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"4px", padding:"1.5rem"}}>
              <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.12em", color:"rgba(255,255,255,0.25)", marginBottom:"0.75rem"}}>MATERIAL PROPERTIES</div>
              {matProps.map(([label, val]) => (
                <div key={label} style={{display:"flex", alignItems:"center", gap:"0.75rem", fontSize:"0.8rem", color:"rgba(255,255,255,0.5)", marginBottom:"0.75rem"}}>
                  <span style={{minWidth:80}}>{label}</span>
                  <div style={{height:8, borderRadius:"100px", background:"rgba(255,255,255,0.08)", flex:1, position:"relative", overflow:"hidden"}}>
                    <div style={{position:"absolute", top:0, left:0, bottom:0, width:`${val}%`, background:C.orange, borderRadius:"100px"}} />
                  </div>
                  <span style={{fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", color:C.orangeLight, minWidth:32, textAlign:"right"}}>{val}%</span>
                </div>
              ))}
              <div style={{marginTop:"1rem", paddingTop:"1rem", borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.12em", color:"rgba(255,255,255,0.25)", marginBottom:"0.35rem"}}>BUILD VOLUME</div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.6rem", color:"#fff", letterSpacing:"0.04em"}}>220 × 220 × 250 mm</div>
                <div style={{fontSize:"0.72rem", color:"rgba(255,255,255,0.3)"}}>FDM · Larger on request</div>
              </div>
            </div>
          </div>
          {/* CNC */}
          {[
            { num:"01", icon:<CncIcon/>, label:"Wood CNC", title:"CNC Router\nServices", desc:"Precision-routed wood panels, signs, decorative pieces, and structural components cut from your DXF or SVG files. Hardwoods, plywoods, and MDF all welcome.", features:["Custom signs & lettering","Decorative panels & wall art","Structural wood parts & jigs","Inlay & relief carving"] },
            { num:"02", icon:<DesignIcon/>, label:"Design Help", title:"File Prep &\nDesign Aid", desc:"Don't have a model? We can help prepare your concept for fabrication, optimize models for printing, or create simple designs from scratch.", features:["STL optimization & repair","DXF / SVG file prep for CNC","Simple 3D modeling add-on"] },
          ].map(card => (
            <div key={card.num} style={{background:C.cardBg, border:"1px solid rgba(0,0,0,0.07)", borderRadius:10, padding:"2rem", position:"relative", overflow:"hidden"}}>
              <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.7rem", letterSpacing:"0.18em", color:C.muted, marginBottom:"1.2rem"}}>{card.num} ——</div>
              <div style={{display:"flex", alignItems:"center", gap:"0.5rem", fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.14em", textTransform:"uppercase", color:C.orange, marginBottom:"0.75rem"}}>
                {card.icon} {card.label}
              </div>
              <h3 style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", letterSpacing:"0.03em", color:C.charcoal, marginBottom:"0.75rem"}}>{card.title.split('\n').map((l,i)=><span key={i}>{l}{i===0&&<br/>}</span>)}</h3>
              <p style={{fontSize:"0.9rem", lineHeight:1.7, color:C.muted, fontWeight:300}}>{card.desc}</p>
              <div style={{marginTop:"1.5rem", display:"flex", flexDirection:"column", gap:"0.5rem"}}>
                {card.features.map(f => (
                  <div key={f} style={{display:"flex", alignItems:"center", gap:"0.6rem", fontSize:"0.82rem", color:C.mid}}>
                    <span style={{width:18, height:18, borderRadius:"50%", background:"rgba(232,93,4,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"0.65rem", color:C.orange}}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── PROCESS ────────────────────────────────────────
function Process() {
  const steps = [
    { num:"01", icon:<UploadIcon/>, title:"Submit Your Files", desc:"Send us your STL, DXF, SVG, or even a sketch. We accept most common design formats and will confirm receipt quickly." },
    { num:"02", icon:<ShieldIcon/>, title:"Review & Quote", desc:"We review your files, confirm dimensions and material choices, then send you a clear quote — usually within a few hours." },
    { num:"03", icon:<PrinterIcon/>, title:"We Fabricate", desc:"Once approved, your part goes into production. We print or route it with care and inspect the result before shipping." },
    { num:"04", icon:<TruckIcon/>, title:"Ship or Pick Up", desc:"Your finished parts are carefully packaged and shipped, or available for local pickup. Typical turnaround is 24–72 hours." },
  ];
  return (
    <section id="process" style={{padding:"6rem 3rem", background:C.cream}}>
      <div style={{maxWidth:1200, margin:"0 auto"}}>
        <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.orange, marginBottom:"0.75rem"}}>// How It Works</div>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,5vw,4rem)", letterSpacing:"0.02em", lineHeight:1, color:C.charcoal, marginBottom:"3.5rem"}}>Simple 4-Step<br/>Process</h2>
        <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1.5rem"}}>
          {steps.map((s, i) => (
            <div key={s.num} style={{position:"relative"}}>
              {i < steps.length - 1 && <span style={{position:"absolute", top:"1.6rem", right:"-1rem", fontSize:"1.2rem", color:C.border, transform:"translateX(50%)"}}>→</span>}
              <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"3.5rem", color:"rgba(232,93,4,0.12)", lineHeight:1, marginBottom:"1rem"}}>{s.num}</div>
              <div style={{width:44, height:44, background:C.orange, borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1rem"}}>{s.icon}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.4rem", letterSpacing:"0.04em", color:C.charcoal, marginBottom:"0.5rem"}}>{s.title}</div>
              <div style={{fontSize:"0.85rem", lineHeight:1.65, color:C.muted, fontWeight:300}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── MATERIALS ──────────────────────────────────────
function Materials() {
  const filaments = [
    { name:"PLA", tags:["RIGID","ECO"] },
    { name:"PETG", tags:["DURABLE","FOOD SAFE"] },
    { name:"ABS", tags:["HEAT RES.","IMPACT"] },
    { name:"TPU / Flexible", tags:["FLEX","RUBBER-LIKE"] },
    { name:"ASA", tags:["UV RES.","OUTDOOR"] },
  ];
  const woods = [
    { name:"Baltic Birch Plywood", tags:["STRONG","PRECISE"] },
    { name:"MDF", tags:["PAINTABLE","SMOOTH"] },
    { name:"Hardwoods (Oak, Maple, Walnut)", tags:["PREMIUM"] },
    { name:"Cedar / Pine", tags:["LIGHT","AROMATIC"] },
  ];
  const specs = [["Min Feature Size","0.4 mm","~1.5 mm"],["Max Part Size","220×220×250 mm","24\" × 48\""],["Tolerance","±0.2 mm","±0.5 mm"],["File Formats","STL, OBJ, 3MF","DXF, SVG, G-code"]];
  const MatList = ({ items }) => (
    <div style={{display:"flex", flexDirection:"column", gap:"0.6rem"}}>
      {items.map(item => (
        <div key={item.name} style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.85rem 1rem", background:C.cardBg, borderRadius:"4px", border:"1px solid rgba(0,0,0,0.05)"}}>
          <span style={{fontSize:"0.88rem", fontWeight:500, color:C.charcoal}}>{item.name}</span>
          <div style={{display:"flex", gap:"0.5rem"}}>
            {item.tags.map(t => (
              <span key={t} style={{fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", padding:"0.2rem 0.5rem", borderRadius:"100px", background:"rgba(232,93,4,0.1)", color:C.orangeDark, letterSpacing:"0.06em"}}>{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <section id="materials" style={{padding:"6rem 3rem", background:"#fff"}}>
      <div style={{maxWidth:1200, margin:"0 auto"}}>
        <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.orange, marginBottom:"0.75rem"}}>// What We Work With</div>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,5vw,4rem)", letterSpacing:"0.02em", lineHeight:1, color:C.charcoal, marginBottom:"3.5rem"}}>Materials &<br/>Specifications</h2>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", alignItems:"start"}}>
          <div>
            <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.14em", textTransform:"uppercase", color:C.orange, marginBottom:"0.5rem"}}>3D Printing Materials</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.8rem", color:C.charcoal, marginBottom:"1.2rem"}}>FDM Filaments</div>
            <MatList items={filaments} />
          </div>
          <div>
            <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.14em", textTransform:"uppercase", color:C.orange, marginBottom:"0.5rem"}}>CNC Router Materials</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.8rem", color:C.charcoal, marginBottom:"1.2rem"}}>Wood & Sheet Goods</div>
            <MatList items={woods} />
            <table style={{width:"100%", borderCollapse:"collapse", marginTop:"1.5rem"}}>
              <thead>
                <tr>
                  {["Spec","3D Printing","CNC Wood"].map(h => (
                    <th key={h} style={{textAlign:"left", fontFamily:"'DM Mono',monospace", fontSize:"0.68rem", letterSpacing:"0.1em", textTransform:"uppercase", color:C.muted, padding:"0.5rem 0.75rem", borderBottom:`1.5px solid ${C.charcoal}`}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specs.map(([s,a,b]) => (
                  <tr key={s}>
                    <td style={{padding:"0.7rem 0.75rem", fontSize:"0.85rem", color:C.charcoal, fontWeight:500, borderBottom:"1px solid rgba(0,0,0,0.05)"}}>{s}</td>
                    <td style={{padding:"0.7rem 0.75rem", fontSize:"0.85rem", color:C.mid, borderBottom:"1px solid rgba(0,0,0,0.05)"}}>{a}</td>
                    <td style={{padding:"0.7rem 0.75rem", fontSize:"0.85rem", color:C.mid, borderBottom:"1px solid rgba(0,0,0,0.05)"}}>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── PRICING ────────────────────────────────────────
function Pricing() {
  const cards = [
    { service:"3D Printing", name:"Small Parts", price:"$10", note:"Starting price · final quote per file", popular:false,
      features:["Parts up to ~100 cm³ volume","Standard PLA or PETG","0.2mm layer height (default)","48–72 hr turnaround","Basic sanding/support removal"] },
    { service:"3D Printing", name:"Toys & Figures", price:"$25", note:"Starting price · quoted by complexity", popular:true,
      features:["Detailed models & articulated toys","Any filament material","0.1–0.15mm fine-detail settings","Light post-processing included","Multicolor available (add-on)"] },
    { service:"Wood CNC", name:"Signs & Panels", price:"$30", note:"Starting price · per sheet / project", popular:false,
      features:["Custom lettering & logos","Plywood, MDF, or hardwood","Profile cuts & pockets","Light sanding finish","DXF or SVG file required"] },
  ];
  return (
    <section id="pricing" style={{padding:"6rem 3rem", background:C.charcoal}}>
      <div style={{maxWidth:1200, margin:"0 auto"}}>
        <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.orangeLight, marginBottom:"0.75rem"}}>// Transparent Rates</div>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,5vw,4rem)", letterSpacing:"0.02em", lineHeight:1, color:"#fff", marginBottom:"1rem"}}>Pricing Tiers</h2>
        <p style={{fontSize:"1rem", lineHeight:1.75, color:"rgba(255,255,255,0.45)", fontWeight:300, maxWidth:560, marginBottom:"3.5rem"}}>Every project is quoted individually, but here's a starting-point guide. Complex geometry, rush orders, and premium materials are quoted accordingly.</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.5rem"}}>
          {cards.map(card => (
            <div key={card.name} style={{background: card.popular ? "rgba(232,93,4,0.06)" : "rgba(255,255,255,0.04)", border:`1px solid ${card.popular ? C.orange : "rgba(255,255,255,0.08)"}`, borderRadius:10, padding:"2rem", position:"relative"}}>
              {card.popular && <div style={{position:"absolute", top:"-0.75rem", left:"50%", transform:"translateX(-50%)", background:C.orange, color:"#fff", fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", padding:"0.3rem 0.9rem", borderRadius:"100px", whiteSpace:"nowrap"}}>Most Popular</div>}
              <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.7rem", letterSpacing:"0.14em", textTransform:"uppercase", color:C.orangeLight, marginBottom:"0.5rem"}}>{card.service}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.6rem", letterSpacing:"0.04em", color:"#fff", marginBottom:"1.2rem"}}>{card.name}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"3rem", lineHeight:1, color:"#fff"}}>{card.price}<span style={{fontSize:"1.2rem", color:"rgba(255,255,255,0.4)"}}>+</span></div>
              <div style={{fontSize:"0.75rem", color:"rgba(255,255,255,0.35)", marginBottom:"1.8rem"}}>{card.note}</div>
              <div style={{height:1, background:"rgba(255,255,255,0.08)", marginBottom:"1.5rem"}} />
              <div style={{display:"flex", flexDirection:"column", gap:"0.65rem", marginBottom:"2rem"}}>
                {card.features.map(f => (
                  <div key={f} style={{display:"flex", alignItems:"flex-start", gap:"0.6rem", fontSize:"0.83rem", color:"rgba(255,255,255,0.6)", lineHeight:1.5}}>
                    <span style={{color:C.orange, flexShrink:0}}>✓</span>{f}
                  </div>
                ))}
              </div>
              <a href="#contact" style={{display:"block", textAlign:"center", padding:"0.85rem", borderRadius:"4px", border: card.popular ? `1px solid ${C.orange}` : "1px solid rgba(255,255,255,0.2)", background: card.popular ? C.orange : "transparent", color:"#fff", fontSize:"0.85rem", fontWeight:500, letterSpacing:"0.08em", textDecoration:"none"}}>Request Quote</a>
            </div>
          ))}
        </div>
        <p style={{textAlign:"center", marginTop:"2rem", fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.1em", color:"rgba(255,255,255,0.25)", textTransform:"uppercase"}}>All prices are estimates. Final quotes depend on geometry, material, and quantity.</p>
      </div>
    </section>
  );
}

// ── GALLERY ────────────────────────────────────────
function Gallery() {
  const items = [
    { emoji:"⚙", tag:"3D Print · PETG", name:"Custom Bracket Assembly", tall:true, bg:"#2a1f1a" },
    { emoji:"🧸", tag:"3D Print · FDM", name:"Articulated Figure", bg:"#1a2028" },
    { emoji:"🌲", tag:"CNC · Birch Plywood", name:"Decorative Wall Panel", bg:"#1c2218" },
    { emoji:"🪵", tag:"CNC · Oak Hardwood", name:"Business Signage with Inlay Relief", wide:true, bg:"#28201a" },
  ];
  return (
    <section id="gallery" style={{padding:"6rem 3rem", background:C.cream}}>
      <div style={{maxWidth:1200, margin:"0 auto"}}>
        <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.orange, marginBottom:"0.75rem"}}>// Example Work</div>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,5vw,4rem)", letterSpacing:"0.02em", lineHeight:1, color:C.charcoal, marginBottom:"3rem"}}>What We've<br/>Made</h2>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gridTemplateRows:"auto auto", gap:"1rem"}}>
          {items.map(item => (
            <div key={item.name} style={{borderRadius:10, overflow:"hidden", position:"relative", background:item.bg, minHeight: item.tall ? 380 : 180, display:"flex", alignItems:"flex-end", gridRow: item.tall ? "span 2" : undefined, gridColumn: item.wide ? "span 2" : undefined}}>
              <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"4rem", opacity:0.18}}>{item.emoji}</div>
              <div style={{position:"relative", zIndex:1, padding:"1rem 1.2rem", width:"100%", background:"linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)"}}>
                <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.12em", textTransform:"uppercase", color:C.orangeLight, marginBottom:"0.25rem"}}>{item.tag}</div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.15rem", letterSpacing:"0.04em", color:"#fff"}}>{item.name}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{marginTop:"1.5rem", fontSize:"0.82rem", color:C.muted, fontStyle:"italic"}}>Photos of actual completed parts available on request — contact us for our full portfolio.</p>
      </div>
    </section>
  );
}

// ── FAQ ────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState(0);
  const faqs = [
    { q:"What file formats do you accept?", a:"For 3D printing we accept STL, OBJ, 3MF, and STEP files. For CNC wood routing we accept DXF, SVG, or G-code. If you only have a sketch or idea, we can help with basic file preparation as an add-on service." },
    { q:"How long does production take?", a:"Most small 3D prints complete in 24–48 hours after order approval. Larger or more detailed parts may take 48–72 hours. CNC wood pieces are typically 48–96 hours depending on complexity. Rush orders can often be accommodated — just ask." },
    { q:"Can I get multiple copies at a discount?", a:"Yes! Volume pricing applies to orders of 5+ identical parts. The per-unit cost drops with quantity since setup overhead is spread across more pieces. Contact us for a volume quote." },
    { q:"Do you offer finishing or painting?", a:"Basic support removal and sanding is included. Priming, painting, and specialty finishes (epoxy coating, staining for CNC wood) are available as add-ons. We quote these per job." },
    { q:"What if my part doesn't turn out right?", a:"We inspect every part before it ships. If there's a defect on our end, we'll reprint or recut at no cost. We'll always review your files and flag potential issues before production begins." },
    { q:"Do you ship or is it local pickup only?", a:"Both! Local pickup is available and free. We also ship via USPS, UPS, or FedEx — shipping cost is calculated at checkout based on package size and destination." },
  ];
  return (
    <section id="faq" style={{padding:"6rem 3rem", background:"#fff"}}>
      <div style={{maxWidth:1200, margin:"0 auto"}}>
        <div style={{display:"grid", gridTemplateColumns:"0.7fr 1fr", gap:"4rem", alignItems:"start"}}>
          <div>
            <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.orange, marginBottom:"0.75rem"}}>// Common Questions</div>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,5vw,4rem)", letterSpacing:"0.02em", lineHeight:1, color:C.charcoal}}>FAQ</h2>
            <p style={{fontSize:"1rem", lineHeight:1.75, color:C.muted, fontWeight:300, marginTop:"0.75rem"}}>Still have questions? Reach out directly and we'll answer within a few hours.</p>
            <a href="#contact" style={{display:"inline-flex", alignItems:"center", gap:"0.5rem", background:C.orange, color:"#fff", fontSize:"0.9rem", fontWeight:600, letterSpacing:"0.06em", padding:"0.85rem 2rem", borderRadius:"4px", textDecoration:"none", marginTop:"2rem"}}>Ask Us Directly →</a>
          </div>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} style={{borderBottom:"1px solid rgba(0,0,0,0.07)", padding:"1.2rem 0"}}>
                <div onClick={() => setOpen(open === i ? -1 : i)} style={{display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", fontWeight:500, fontSize:"0.95rem", color:C.charcoal, gap:"1rem"}}>
                  {faq.q}
                  <span style={{width:24, height:24, borderRadius:"50%", background: open===i ? C.orange : C.cardBg, border:"1px solid rgba(0,0,0,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"1rem", color: open===i ? "#fff" : C.orange, transition:"background 0.2s"}}>
                    {open === i ? "−" : "+"}
                  </span>
                </div>
                {open === i && <div style={{fontSize:"0.85rem", lineHeight:1.75, color:C.muted, paddingTop:"0.75rem", fontWeight:300}}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CONTACT ────────────────────────────────────────
function Contact() {
  const [status, setStatus] = useState("idle");
  const handleSubmit = () => {
    setStatus("sending");
    setTimeout(() => { setStatus("sent"); setTimeout(() => setStatus("idle"), 3000); }, 1000);
  };
  const contactInfo = [
    { icon:<MailIcon/>, text:"hello@engineeringindustries.com" },
    { icon:<PhoneIcon/>, text:"(555) 123-4567" },
    { icon:<PinIcon/>, text:"Serving locally + shipping nationwide" },
  ];
  return (
    <section id="contact" style={{padding:"6rem 3rem", background:C.charcoal}}>
      <div style={{maxWidth:1200, margin:"0 auto"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", color:C.orangeLight, marginBottom:"0.75rem"}}>// Start Your Project</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(2.5rem,4.5vw,3.8rem)", lineHeight:1, color:"#fff", letterSpacing:"0.02em", marginBottom:"1rem"}}>Get a Free<br/>Custom Quote</div>
            <p style={{fontSize:"0.92rem", lineHeight:1.75, color:"rgba(255,255,255,0.45)", marginBottom:"2rem", fontWeight:300}}>Send us your project details and we'll get back to you with a clear, itemized quote — usually within 2–4 hours during business hours.</p>
            <div style={{display:"flex", flexDirection:"column", gap:"1rem", marginBottom:"2rem"}}>
              {contactInfo.map((item, i) => (
                <div key={i} style={{display:"flex", alignItems:"center", gap:"0.85rem", fontSize:"0.88rem", color:"rgba(255,255,255,0.65)"}}>
                  <div style={{width:36, height:36, borderRadius:"4px", background:"rgba(232,93,4,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>{item.icon}</div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"2rem"}}>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"1rem"}}>
              {[["First Name","Ethan"],["Last Name","Fuller"]].map(([label, ph]) => (
                <div key={label} style={{display:"flex", flexDirection:"column", gap:"0.4rem"}}>
                  <label style={{fontFamily:"'DM Mono',monospace", fontSize:"0.68rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)"}}>{label}</label>
                  <input placeholder={ph} style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"4px", padding:"0.75rem 1rem", fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", color:"#fff", outline:"none", width:"100%"}} />
                </div>
              ))}
            </div>
            {[["Email","you@example.com","email"]].map(([label, ph, type]) => (
              <div key={label} style={{display:"flex", flexDirection:"column", gap:"0.4rem", marginBottom:"1rem"}}>
                <label style={{fontFamily:"'DM Mono',monospace", fontSize:"0.68rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)"}}>{label}</label>
                <input type={type} placeholder={ph} style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"4px", padding:"0.75rem 1rem", fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", color:"#fff", outline:"none", width:"100%"}} />
              </div>
            ))}
            <div style={{display:"flex", flexDirection:"column", gap:"0.4rem", marginBottom:"1rem"}}>
              <label style={{fontFamily:"'DM Mono',monospace", fontSize:"0.68rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)"}}>Service Needed</label>
              <select style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"4px", padding:"0.75rem 1rem", fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", color:"#fff", outline:"none", width:"100%", appearance:"none"}}>
                <option value="">Select a service…</option>
                {["3D Printing — Toys / Figures","3D Printing — Functional Parts","3D Printing — Prototype","CNC Wood — Sign / Lettering","CNC Wood — Decorative Panel","CNC Wood — Structural Part","File Prep / Design Help","Multiple Services"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:"0.4rem", marginBottom:"1rem"}}>
              <label style={{fontFamily:"'DM Mono',monospace", fontSize:"0.68rem", letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)"}}>Project Description</label>
              <textarea placeholder="Describe your part, approximate size, quantity, material preference, and any deadline…" rows={4} style={{background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"4px", padding:"0.75rem 1rem", fontFamily:"'DM Sans',sans-serif", fontSize:"0.88rem", color:"#fff", outline:"none", width:"100%", resize:"vertical"}} />
            </div>
            <button onClick={handleSubmit} style={{width:"100%", background: status==="sent" ? "#22c55e" : C.orange, border:"none", color:"#fff", fontFamily:"'DM Sans',sans-serif", fontSize:"0.9rem", fontWeight:600, letterSpacing:"0.08em", padding:"0.95rem", borderRadius:"4px", cursor:"pointer", transition:"background 0.2s"}}>
              {status==="sending" ? "Sending…" : status==="sent" ? "✓ Request Sent! We'll be in touch soon." : "Send Quote Request →"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FLYER ──────────────────────────────────────────
function Flyer() {
  const flyerServices = [
    { icon:<PrinterIcon/>, title:"3D Printing Services", desc:"FDM printing in a wide range of filament materials — from tough functional parts to detailed toys and figures.", items:["Toys, figures & collectibles","Functional mechanical parts","Enclosures & housings","PLA, PETG, ABS, TPU, ASA","Starting at $10 per part"] },
    { icon:<CncIcon/>, title:"CNC Wood Routing", desc:"Precision-cut wood parts, signs, decorative panels, and structural components from your design files.", items:["Custom signs & lettering","Decorative wall panels","Relief carving & inlay","Plywood, MDF, hardwoods","Starting at $30 per project"] },
  ];
  return (
    <div id="flyer" style={{background:C.charcoal, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"4rem 3rem", position:"relative", overflow:"hidden"}}>
      <div style={{position:"absolute", top:"-200px", right:"-150px", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(232,93,4,0.12) 0%, transparent 70%)", pointerEvents:"none"}} />
      <div style={{position:"absolute", bottom:"-150px", left:"-100px", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(232,93,4,0.08) 0%, transparent 70%)", pointerEvents:"none"}} />
      <div style={{maxWidth:760, width:"100%", position:"relative"}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"4rem"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.2rem", letterSpacing:"0.06em", color:"#fff"}}>Engineering<span style={{color:C.orange}}>Industries</span></div>
          <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.7rem", letterSpacing:"0.14em", textTransform:"uppercase", color:C.orangeLight, border:"1px solid rgba(232,93,4,0.3)", padding:"0.4rem 1rem", borderRadius:"100px"}}>Custom Engineering Services</div>
        </div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(3.5rem,8vw,7rem)", lineHeight:0.92, letterSpacing:"0.02em", color:"#fff", marginBottom:"0.5rem"}}>
          Print It.<br/><span style={{color:C.orange}}>Cut It.</span><br/>Build It.
        </div>
        <p style={{fontSize:"1.1rem", color:"rgba(255,255,255,0.45)", fontWeight:300, marginBottom:"3.5rem", maxWidth:480, lineHeight:1.6}}>Professional FDM 3D printing and CNC wood routing — custom made to your exact specifications. Toys, functional parts, signs, panels, and more.</p>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"3rem"}}>
          {flyerServices.map(svc => (
            <div key={svc.title} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"1.5rem"}}>
              <div style={{width:48, height:48, background:"rgba(232,93,4,0.15)", borderRadius:"4px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"1rem", color:C.orangeLight}}>{svc.icon}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.3rem", letterSpacing:"0.04em", color:"#fff", marginBottom:"0.4rem"}}>{svc.title}</div>
              <div style={{fontSize:"0.8rem", color:"rgba(255,255,255,0.4)", lineHeight:1.65, fontWeight:300, marginBottom:"0.75rem"}}>{svc.desc}</div>
              <div style={{display:"flex", flexDirection:"column", gap:"0.3rem"}}>
                {svc.items.map(item => (
                  <div key={item} style={{fontSize:"0.75rem", color:"rgba(255,255,255,0.5)", display:"flex", alignItems:"center", gap:"0.4rem"}}>
                    <span style={{color:C.orange, fontSize:"0.8rem"}}>—</span>{item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{height:1, background:"rgba(255,255,255,0.07)", marginBottom:"2rem"}} />
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem", marginBottom:"2rem"}}>
          {[["0.1mm","Print Resolution"],["48hr","Typical Turnaround"]].map(([val, lbl]) => (
            <div key={lbl} style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"8px", padding:"1rem", textAlign:"center"}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", color:"#fff", lineHeight:1}}>{val}</div>
              <div style={{fontSize:"0.72rem", color:"rgba(255,255,255,0.35)", marginTop:"0.25rem", fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", textTransform:"uppercase"}}>{lbl}</div>
            </div>
          ))}
          <div style={{background:"rgba(232,93,4,0.1)", border:"1px solid rgba(232,93,4,0.25)", borderRadius:"8px", padding:"1rem", textAlign:"center"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem", color:C.orangeLight, lineHeight:1}}>FREE</div>
            <div style={{fontSize:"0.72rem", color:"rgba(255,255,255,0.35)", marginTop:"0.25rem", fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", textTransform:"uppercase"}}>Quotes & File Review</div>
          </div>
        </div>
        <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.5rem 2rem", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:10, gap:"2rem", flexWrap:"wrap"}}>
          {[["Email","hello@engineeringindustries.com"],["Phone","(555) 123-4567"],["Web","www.engineeringindustries.com"]].map(([lbl,val]) => (
            <div key={lbl}>
              <div style={{fontFamily:"'DM Mono',monospace", fontSize:"0.62rem", letterSpacing:"0.14em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)"}}>{lbl}</div>
              <div style={{fontSize:"0.88rem", color:"rgba(255,255,255,0.75)", fontWeight:500}}>{val}</div>
            </div>
          ))}
          <a href="#contact" style={{display:"inline-flex", alignItems:"center", gap:"0.5rem", background:C.orange, color:"#fff", fontSize:"0.85rem", fontWeight:600, letterSpacing:"0.08em", padding:"0.75rem 1.8rem", borderRadius:"4px", textDecoration:"none", whiteSpace:"nowrap"}}>Get a Free Quote →</a>
        </div>
        <div style={{height:1, background:"rgba(255,255,255,0.07)", margin:"2rem 0"}} />
        <div style={{textAlign:"center", fontFamily:"'DM Mono',monospace", fontSize:"0.65rem", letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.2)"}}>Engineering Industries · 3D Printing & CNC Routing · All rights reserved · Contact us for current availability and pricing</div>
      </div>
    </div>
  );
}

// ── FOOTER ─────────────────────────────────────────
function Footer() {
  return (
    <footer style={{background:"#0f0f0d", padding:"3rem", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"1rem", flexWrap:"wrap"}}>
      <a href="#" style={{fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.6rem", letterSpacing:"0.06em", color:"rgba(255,255,255,0.6)", textDecoration:"none"}}>Engineering<span style={{color:C.orange}}>Industries</span></a>
      <div style={{display:"flex", gap:"2rem"}}>
        {["services","materials","pricing","contact","flyer"].map(l => (
          <a key={l} href={`#${l}`} style={{fontSize:"0.78rem", color:"rgba(255,255,255,0.3)", textDecoration:"none", letterSpacing:"0.08em", textTransform:"uppercase"}}>{l}</a>
        ))}
      </div>
      <div style={{fontSize:"0.75rem", color:"rgba(255,255,255,0.2)", fontFamily:"'DM Mono',monospace"}}>© 2025 Engineering Industries · Custom Engineering</div>
    </footer>
  );
}

// ── APP ────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <Nav />
      <Hero />
      <Ticker />
      <Services />
      <Process />
      <Materials />
      <Pricing />
      <Gallery />
      <FAQ />
      <Contact />
      <Flyer />
      <Footer />
    </>
  );
}
