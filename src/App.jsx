import { useEffect, useState } from 'react';
import { client } from './lib/appwrite';
import emailjs from '@emailjs/browser';

const navLinks = [
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#materials', label: 'Materials' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Get a Quote', cta: true }
];

const tickerItems = [
  '3D Printing',
  'CNC Routing',
  'Custom Parts',
  'Functional Prototypes',
  'Wood Engraving',
  'Toy Design',
  'Engineering Services',
  'Fast Turnaround'
];

const activeCapabilities = [
  {
    name: 'FDM 3D Printing',
    subtitle: 'PLA · PETG · ABS · TPU · ASA',
    icon: (
      <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
    ),
    badge: 'AVAILABLE'
  },
  {
    name: 'Wood CNC Routing',
    subtitle: 'Signs · panels · parts',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M3 3h18v18H3z" /><path d="M8 12h8M12 8v8" /></svg>
    ),
    badge: 'AVAILABLE'
  }
];

const serviceCards = [
  {
    featured: true,
    label: '3D Printing',
    title: 'FDM 3D Printing',
    description:
      "From functional engineering parts that need strength and heat resistance to toys and collectibles — we print it all with FDM technology. Upload your STL or STEP file and get a quote within hours.",
    features: [
      'Toys, figures & collectibles',
      'Functional mechanical parts & enclosures',
      'Prototypes & proof-of-concept models',
      'Multi-material & flexible parts (TPU)',
      'Accepts STL and STEP files',
      'Layer heights from 0.1mm to 0.3mm'
    ],
    mockup: [
      { label: 'Strength', value: 85 },
      { label: 'Detail', value: 95 },
      { label: 'Flexibility', value: 60 },
      { label: 'Heat Resist.', value: 70 }
    ],
    volume: '220 × 220 × 250 mm'
  },
  {
    number: '01 ——',
    label: 'Wood CNC',
    title: 'CNC Router Services',
    description:
      "Precision-routed wood panels, signs, decorative pieces, and structural components cut from your DXF or SVG files. Don't have a file? We can design your sign or panel for you. Hardwoods, plywoods, and MDF all welcome.",
    features: [
      'Custom signs & lettering',
      'Decorative panels & wall art',
      'Structural wood parts & jigs',
      'Inlay & relief carving',
      'Custom design available — no file needed'
    ],
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 12h8M12 8v8" /></svg>
    )
  },
  {
    number: '02 ——',
    label: 'Design Help',
    title: 'File Prep & Design Aid',
    description:
      "Don't have a model? No problem. We can help prepare your concept for fabrication, optimize models for printing, or create simple designs from scratch.",
    features: [
      'STL/STEP optimization & repair',
      'DXF / SVG file prep for CNC',
      'Simple 3D modeling add-on'
    ],
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>
    )
  }
];

const processSteps = [
  {
    number: '01',
    title: 'Submit Your Files',
    description:
      'Send us your STL, STEP, DXF, SVG, or even a sketch. We accept most common design formats and will confirm receipt quickly.',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
    )
  },
  {
    number: '02',
    title: 'Review & Quote',
    description:
      'We review your files, confirm dimensions and material choices, then send you a clear quote — by end of day.',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    )
  },
  {
    number: '03',
    title: 'We Fabricate',
    description:
      'Once approved, your part goes into production. We print or route it with care and inspect the result before moving to delivery.',
    icon: (
      <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
    )
  },
  {
    number: '04',
    title: 'Ship or Pick Up',
    description:
      'Your finished parts are ready for local pickup, or we can ship them to you — shipping is an additional cost and will be estimated in your quote. Typical turnaround is 24–72 hours.',
    icon: (
      <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
    )
  }
];

const printingMaterials = [
  { name: 'PLA', tags: ['RIGID', 'ECO'] },
  { name: 'PETG', tags: ['DURABLE', 'FOOD SAFE'] },
  { name: 'ABS', tags: ['HEAT RES.', 'IMPACT'] },
  { name: 'TPU / Flexible', tags: ['FLEX', 'RUBBER-LIKE'] },
  { name: 'ASA', tags: ['UV RES.', 'OUTDOOR'] }
];

const cncMaterials = [
  { name: 'Baltic Birch Plywood', tags: ['STRONG', 'PRECISE'] },
  { name: 'MDF', tags: ['PAINTABLE', 'SMOOTH'] },
  { name: 'Hardwoods (Oak, Maple, Walnut)', tags: ['PREMIUM'] },
  { name: 'Cedar / Pine', tags: ['LIGHT', 'AROMATIC'] }
];

const pricingCards = [
  {
    service: '3D Printing',
    name: 'Toys & Small Items',
    amount: '$10+',
    note: 'Base rate for toys and small items — custom designs may incur an extra charge',
    features: [
      'Parts up to ~100 cm³ volume',
      'Standard PLA or PETG',
      '0.2mm layer height (default)',
      '24–48 hr turnaround (excl. shipping)',
      'Basic sanding/support removal'
    ]
  },
  {
    popular: true,
    service: '3D Printing',
    name: 'Prototype',
    amount: '$25+',
    note: 'Starting price · surcharge may apply if design work is required',
    features: [
      'Detailed models & articulated toys',
      'Any filament material',
      '0.1–0.15mm fine-detail settings',
      'Light post-processing included',
      'Any filament material'
    ]
  },
  {
    service: 'Wood CNC',
    name: 'Signs & Panels',
    amount: '$30+',
    note: 'Starting price · per sheet / project',
    features: [
      'Custom lettering & logos',
      'Plywood, MDF, or hardwood',
      'Profile cuts & pockets',
      'Light sanding finish',
      'DXF/SVG preferred — we can design one for you'
    ]
  }
];

const galleryItems = [
  { variant: 'tall', emoji: '⚙', tag: '3D Print · PETG', name: 'Custom Bracket Assembly' },
  { emoji: '🧸', tag: '3D Print · FDM', name: 'Articulated Figure' },
  { emoji: '🌲', tag: 'CNC · Birch Plywood', name: 'Decorative Wall Panel' },
  { variant: 'wide', emoji: '🪵', tag: 'CNC · Oak Hardwood', name: 'Business Signage with Inlay Relief' }
];

const faqItems = [
  {
    question: 'What file formats do you accept?',
    answer:
      'For 3D printing we accept STL, STEP, OBJ, and 3MF files. For CNC wood routing we accept DXF or SVG. If you only have a sketch or idea, we can help with basic file preparation as an add-on service.'
  },
  {
    question: 'How long does production take?',
    answer:
      'Toys and small 3D prints typically complete in 24–48 hours after order approval (not including shipping time). Larger or more detailed parts may take 48–72 hours. CNC wood pieces are typically 48–96 hours depending on complexity. Rush orders can often be accommodated — just ask.'
  },
  {
    question: 'Can I get multiple copies at a discount?',
    answer:
      'Yes! Volume pricing applies to orders of 5+ identical parts. The per-unit cost drops with quantity since setup overhead is spread across more pieces. Contact us for a volume quote.'
  },
  {
    question: 'Do you offer finishing or painting?',
    answer:
      'Basic support removal and sanding is included. Priming, painting, staining, and sealant are available as add-ons. We quote these per job.'
  },
  {
    question: "What if my part doesn't turn out right?",
    answer:
      "We inspect every part before it ships. If something doesn't look right, we'll be more than willing to look into it and see if it is applicable for a reprint or recut at no extra cost. We'll always review your files and flag potential issues before production begins."
  },
  {
    question: 'Do you ship or is it local pickup only?',
    answer:
      'Both! Local pickup is available and free. We also ship — shipping cost is an additional charge and will be estimated in your quote.'
  }
];

const contactItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
    ),
    text: 'etwan07@gmail.com'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.34 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.04 6.04l1.12-1.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 15.17z" /></svg>
    ),
    text: '(812) 453-0522'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
    text: 'Local pickup available — shipping nationwide (extra cost, estimated in quote)'
  }
];

const flyerServices = [
  {
    icon: (
      <svg viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
    ),
    title: '3D Printing Services',
    description:
      'FDM printing in a wide range of filament materials — from tough functional parts to detailed toys and figures.',
    bullets: [
      'Toys, figures & collectibles',
      'Functional mechanical parts',
      'Enclosures & housings',
      'PLA, PETG, ABS, TPU, ASA',
      'Starting at $10 per part'
    ]
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
    ),
    title: 'CNC Wood Routing',
    description:
      'Precision-cut wood parts, signs, decorative panels, and structural components from your design files.',
    bullets: [
      'Custom signs & lettering',
      'Decorative wall panels',
      'Relief carving & inlay',
      'Plywood, MDF, hardwoods',
      'Starting at $30 per project'
    ]
  }
];

function App() {
  const [activeFaq, setActiveFaq] = useState(0);
  const [submitLabel, setSubmitLabel] = useState('Send Quote Request →');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [serviceNeeded, setServiceNeeded] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const toggleMenu = () => setMenuOpen((current) => !current);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const revealEls = document.querySelectorAll('.service-card, .process-step, .price-card, .gallery-item, .mat-item');
    revealEls.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), index * 60);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      if (!nav) return;
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    client.ping()
      .then(() => console.log('Appwrite ping successful'))
      .catch((error) => console.error('Appwrite ping failed', error));
  }, []);

  const handleFaqToggle = (index) => {
    setActiveFaq((current) => (current === index ? -1 : index));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitLabel('Sending…');

    emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        from_name: `${firstName} ${lastName}`.trim(),
        from_email: emailAddress,
        service_needed: serviceNeeded || 'Not specified',
        message: projectDescription || 'No description provided.',
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).then(() => {
      setSubmitLabel('✓ Message sent!');
      setFirstName('');
      setLastName('');
      setEmailAddress('');
      setServiceNeeded('');
      setProjectDescription('');
      setTimeout(() => {
        setSubmitLabel('Send Quote Request →');
        setIsSubmitting(false);
      }, 3000);
    }).catch(() => {
      setSubmitLabel('Failed to send — please try again');
      setTimeout(() => {
        setSubmitLabel('Send Quote Request →');
        setIsSubmitting(false);
      }, 3000);
    });
  };

  return (
    <>
      <nav>
        <a href="#" className="nav-logo">
          Engineering<span> Industries</span>
        </a>
        <button className="nav-toggle" onClick={toggleMenu} aria-expanded={menuOpen} aria-label="Toggle navigation">
          <span />
          <span />
          <span />
        </button>
        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className={link.cta ? 'nav-cta' : undefined} onClick={closeMenu}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="hero" id="hero">
        <div className="hero-bg-text">EI</div>
        <div className="hero-grid">
          <div>
            <div className="hero-tag">Custom Engineering Services</div>
            <h1>
              Built to Test last
              <br />
              <span className="accent">Spec.</span>
              <br />
              Made to
              <br />
              Last.
            </h1>
            <p className="hero-desc">
              From detailed 3D-printed toys and functional parts to precision CNC-routed wood components — we turn your designs into real, tangible objects.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="btn-primary">
                Get a Free Quote →
              </a>
              <a href="#services" className="btn-secondary">
                Our Services
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <div className="stat-num">Variety</div>
                <div className="stat-label">of Materials</div>
              </div>
              <div>
                <div className="stat-num">0.1mm</div>
                <div className="stat-label">Print Resolution</div>
              </div>
              <div>
                <div className="stat-num">72hr</div>
                <div className="stat-label">Turnaround (typical)</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-label">// Active Capabilities</div>
              <div className="service-visual-list">
                {activeCapabilities.map((item) => (
                  <div className="svc-item" key={item.name}>
                    <div className="svc-icon">{item.icon}</div>
                    <div>
                      <div className="svc-name">{item.name}</div>
                      <div className="svc-sub">{item.subtitle}</div>
                    </div>
                    <span className="svc-badge">{item.badge}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-spec-float">
              <div className="spec-dot" />
              <div className="spec-text">
                <strong>Ready to produce</strong>
                Send your files — we'll get started today
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="ticker">
        <div className="ticker-track">
          {Array.from({ length: 2 }).map((_, index) =>
            tickerItems.map((item) => (
              <span className="ticker-item" key={`${item}-${index}`}>
                <span className="ticker-dot" />
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      <section id="services">
        <div className="section-inner">
          <div className="services-header">
            <div>
              <div className="section-label">// What We Do</div>
              <h2>
                Our Core
                <br />
                Services
              </h2>
            </div>
            <p className="section-desc">
              We specialize in two powerful fabrication methods that cover a wide range of custom manufacturing needs — from intricate one-offs to small production runs.
            </p>
          </div>

          <div className="services-grid">
            {serviceCards.map((card) => (
              <div key={card.title} className={`service-card${card.featured ? ' featured' : ''}`}>
                <div>
                  {card.number && <div className="service-card-num">{card.number}</div>}
                  <div className="service-card-label">
                    {card.icon}
                    {card.label}
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <div className="service-features">
                    {card.features.map((feature) => (
                      <div className="feat-row" key={feature}>
                        <span className="check">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                {card.featured && (
                  <div className="service-visual-mockup">
                    <div className="service-card-label" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', marginBottom: '0.5rem' }}>
                      MATERIAL PROPERTIES
                    </div>
                    {card.mockup.map((row) => (
                      <div className="mockup-row" key={row.label}>
                        <span>{row.label}</span>
                        <div className="mockup-bar">
                          <div className="mockup-fill" style={{ width: `${row.value}%` }} />
                        </div>
                        <span className="mockup-val">{row.value}%</span>
                      </div>
                    ))}
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', marginBottom: '0.35rem' }}>
                        BUILD VOLUME
                      </div>
                      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '1.6rem', color: '#fff', letterSpacing: '0.04em' }}>
                        {card.volume}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                        FDM · Larger on request
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="process">
        <div className="section-inner">
          <div className="section-label">// How It Works</div>
          <h2>
            Simple 4-Step
            <br />
            Process
          </h2>
          <div className="process-grid">
            {processSteps.map((step) => (
              <div className="process-step" key={step.number}>
                <div className="step-num">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="materials">
        <div className="section-inner">
          <div className="section-label">// What We Work With</div>
          <h2>
            Materials &
            <br />
            Specifications
          </h2>
          <div className="materials-grid">
            <div>
              <div className="mat-category">3D Printing Materials</div>
              <div className="mat-category-title">FDM Filaments</div>
              <div className="mat-list">
                {printingMaterials.map((item) => (
                  <div className="mat-item" key={item.name}>
                    <div className="mat-name">{item.name}</div>
                    <div className="mat-props">
                      {item.tags.map((tag) => (
                        <span className="mat-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mat-category">CNC Router Materials</div>
              <div className="mat-category-title">Wood & Sheet Goods</div>
              <div className="mat-list">
                {cncMaterials.map((item) => (
                  <div className="mat-item" key={item.name}>
                    <div className="mat-name">{item.name}</div>
                    <div className="mat-props">
                      {item.tags.map((tag) => (
                        <span className="mat-tag" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <table className="spec-table" style={{ marginTop: '1.5rem' }}>
                <tbody>
                  <tr>
                    <th>Spec</th>
                    <th>3D Printing</th>
                    <th>CNC Wood</th>
                  </tr>
                  <tr>
                    <td>Min Feature Size</td>
                    <td>0.4 mm</td>
                    <td>~1.5 mm</td>
                  </tr>
                  <tr>
                    <td>Max Part Size</td>
                    <td>220×220×250 mm</td>
                    <td>24" × 48"</td>
                  </tr>
                  <tr>
                    <td>Tolerance</td>
                    <td>±0.2 mm</td>
                    <td>±0.5 mm</td>
                  </tr>
                  <tr>
                    <td>File Formats</td>
                    <td>STL, STEP, OBJ, 3MF</td>
                    <td>DXF, SVG</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing">
        <div className="section-inner">
          <div className="section-label">// Transparent Rates</div>
          <h2>Pricing Tiers</h2>
          <p className="section-desc">
            Every project is quoted individually, but here&apos;s a starting-point guide. Complex geometry, rush orders, and premium materials are quoted accordingly.
          </p>
          <div className="pricing-grid">
            {pricingCards.map((card) => (
              <div key={card.name} className={`price-card${card.popular ? ' popular' : ''}`}>
                {card.popular && <div className="popular-badge">Most Popular</div>}
                <div className="price-service">{card.service}</div>
                <div className="price-name">{card.name}</div>
                <div className="price-amount">{card.amount}</div>
                <div className="price-note">{card.note}</div>
                <div className="price-divider" />
                <div className="price-features">
                  {card.features.map((feature) => (
                    <div className="pfeat" key={feature}>
                      <span className="pcheck">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
                <a href="#contact" className="btn-price">
                  Request Quote
                </a>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '2rem', fontFamily: "'DM Mono',monospace", fontSize: '0.72rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
            All prices are estimates. Final quotes depend on geometry, material, and quantity.
          </p>
        </div>
      </section>

      <section id="gallery">
        <div className="section-inner">
          <div className="section-label">// Example Work</div>
          <h2>
            What We&apos;ve
            <br />
            Made
          </h2>
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <div key={item.name} className={`gallery-item${item.variant ? ` ${item.variant}` : ''}`}>
                <div className="gallery-fill">{item.emoji}</div>
                <div className="gallery-info">
                  <div className="gallery-tag">{item.tag}</div>
                  <div className="gallery-name">{item.name}</div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--muted)', fontStyle: 'italic' }}>
            Photos of actual completed parts available on request — contact us for our full portfolio.
          </p>
        </div>
      </section>

      <section id="faq">
        <div className="section-inner">
          <div className="faq-grid">
            <div>
              <div className="section-label">// Common Questions</div>
              <h2>FAQ</h2>
              <p className="section-desc" style={{ marginTop: '0.75rem' }}>
                Still have questions? Reach out directly and we&apos;ll answer within a few hours.
              </p>
              <a href="#contact" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
                Ask Us Directly →
              </a>
            </div>

            <div className="faq-list">
              {faqItems.map((item, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div className={`faq-item${isOpen ? ' open' : ''}`} key={item.question}>
                    <div className="faq-q" onClick={() => handleFaqToggle(index)}>
                      {item.question}
                      <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
                    </div>
                    <div className="faq-a">{item.answer}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="contact">
        <div className="section-inner">
          <div className="contact-wrap">
            <div>
              <div className="section-label" style={{ color: 'var(--orange-light)' }}>// Start Your Project</div>
              <div className="contact-heading">Get a Free<br />Custom Quote</div>
              <p className="contact-desc">
                Send us your project details and we&apos;ll get back to you with a clear, itemized quote — usually within 12-24 hours during business hours.
              </p>
              <div className="contact-items">
                {contactItems.map((contact) => (
                  <div className="contact-item" key={contact.text}>
                    <div className="contact-icon">{contact.icon}</div>
                    {contact.text}
                  </div>
                ))}
              </div>
            </div>

            <form className="contact-form" onSubmit={handleFormSubmit}>
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="Ethan"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Fuller"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }} />
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={emailAddress}
                  onChange={(event) => setEmailAddress(event.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Service Needed</label>
                <select value={serviceNeeded} onChange={(event) => setServiceNeeded(event.target.value)}>
                  <option value="">Select a service…</option>
                  <option>3D Printing — Toys / Figures</option>
                  <option>3D Printing — Functional Parts</option>
                  <option>3D Printing — Prototype</option>
                  <option>CNC Wood — Sign / Lettering</option>
                  <option>CNC Wood — Decorative Panel</option>
                  <option>CNC Wood — Structural Part</option>
                  <option>File Prep / Design Help</option>
                  <option>Multiple Services</option>
                </select>
              </div>
              <div className="form-group">
                <label>Project Description</label>
                <textarea
                  placeholder="Describe your part, approximate size, quantity, material preference, and any deadline…"
                  value={projectDescription}
                  onChange={(event) => setProjectDescription(event.target.value)}
                />
              </div>
              <button className="form-submit" type="submit">
                {submitLabel}
              </button>
            </form>
          </div>
        </div>
      </section>

      <div className="flyer-page" id="flyer">
        <div className="flyer-bg-circle c1" />
        <div className="flyer-bg-circle c2" />
        <div className="flyer-inner">
          <div className="flyer-top">
            <div className="flyer-logo">
              Engineering<span>Industries</span>
            </div>
            <div className="flyer-tagline-chip">Custom Engineering Services</div>
          </div>
          <div className="flyer-headline">
            Print It.
            <br />
            <span className="accent">Cut It.</span>
            <br />
            Build It.
          </div>
          <p className="flyer-sub">
            Professional 3D printing and CNC wood routing — custom made to your exact specifications. Toys, functional parts, signs, panels, and more.
          </p>
          <div className="flyer-services">
            {flyerServices.map((service) => (
              <div className="flyer-svc" key={service.title}>
                <div className="flyer-svc-icon">{service.icon}</div>
                <div className="flyer-svc-title">{service.title}</div>
                <div className="flyer-svc-desc">{service.description}</div>
                <div className="flyer-svc-list">
                  {service.bullets.map((bullet) => (
                    <div className="flyer-svc-li" key={bullet}>
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flyer-divider" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { value: '0.1mm', label: 'Print Resolution' },
              { value: '72hr', label: 'Typical Turnaround' },
              { value: 'FREE', label: 'Quotes & File Review' }
            ].map((item) => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '2rem', color: '#fff', lineHeight: 1 }}>{item.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.25rem', fontFamily: "'DM Mono',monospace", letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
          <div className="flyer-bottom">
            <div className="flyer-contact-item">
              <div className="flyer-contact-lbl">Email</div>
              <div className="flyer-contact-val">etwan007@gmail.com</div>
            </div>
            <div className="flyer-contact-item">
              <div className="flyer-contact-lbl">Phone</div>
              <div className="flyer-contact-val">(812) 453-0522</div>
            </div>
            <div className="flyer-contact-item">
              <div className="flyer-contact-lbl">Web</div>
              <div className="flyer-contact-val">www.engineeringindustries.com</div>
            </div>
            <a href="#contact" className="flyer-cta-btn">
              Get a Free Quote →
            </a>
          </div>
          <div className="flyer-divider" />
          <div className="flyer-micro">
            Engineering Industries · 3D Printing & CNC Routing · All rights reserved · Contact us for current availability and pricing
          </div>
        </div>
      </div>

      <footer>
        <a href="#" className="footer-logo">
          Engineering<span>Industries</span>
        </a>
        <ul className="footer-links">
          {navLinks.slice(0, 4).map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
          <li>
            <a href="#flyer">Flyer</a>
          </li>
        </ul>
        <div className="footer-copy">© 2025 Engineering Industries · Custom Engineering</div>
      </footer>
    </>
  );
}

export default App;
