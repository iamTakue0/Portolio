import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleArrowUp,
  Moon,
  Sun,
  X,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { siteData } from "./siteData";

gsap.registerPlugin(ScrollTrigger);

const serviceKeys = siteData.services;

function CircularBadge() {
  return (
    <div
      className="orbit-badge"
      aria-label={`Open to work, based in ${siteData.location}`}
    >
      <svg className="orbit-type" viewBox="0 0 140 140" aria-hidden="true">
        <defs>
          <path
            id="orbit-circle"
            d="M70,70 m-51,0 a51,51 0 1,1 102,0 a51,51 0 1,1 -102,0"
          />
        </defs>
        <text>
          <textPath href="#orbit-circle">
            OPEN TO WORK · BASED IN ZIMBABWE ·{" "}
          </textPath>
        </text>
      </svg>
      <span className="orbit-star" aria-hidden="true">
        ✳
      </span>
    </div>
  );
}

function MagneticLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const move = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (bounds.left + bounds.width / 2);
    const dy = event.clientY - (bounds.top + bounds.height / 2);
    gsap.to(event.currentTarget, {
      x: dx * 0.12,
      y: dy * 0.18,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  const reset = () => {
    if (ref.current)
      gsap.to(ref.current, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: "elastic.out(1, 0.45)",
      });
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={move}
      onMouseLeave={reset}
      className={`magnetic-link ${className}`}
    >
      {children}
    </a>
  );
}

function App() {
  const rootRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      return localStorage.getItem("takunda-theme") === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });
  const [activeService, setActiveService] = useState(0);
  const [selectedProject, setSelectedProject] = useState<
    (typeof siteData.projects)[number] | null
  >(null);
  const [testimonial, setTestimonial] = useState(0);
  const [localTime, setLocalTime] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [formSent, setFormSent] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#f3f0e9" : "#0b0b0c");
    try {
      localStorage.setItem("takunda-theme", theme);
    } catch {
      // Keep the selected theme for this session if storage is unavailable.
    }
  }, [theme]);

  useEffect(() => {
    const updateTime = () => {
      setLocalTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: siteData.timeZone,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
      setCurrentYear(String(new Date().getFullYear()));
    };
    updateTime();
    const timer = window.setInterval(updateTime, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 20
      : 1350;
    const timer = window.setTimeout(() => setLoading(false), delay);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.9,
      smoothWheel: true,
    });
    lenis.scrollTo(0, { immediate: true });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      gsap.fromTo(
        ".hero-word",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "expo.out",
          delay: 1.05,
        },
      );
      gsap.fromTo(
        ".hero-detail",
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 1.35,
        },
      );
      gsap.fromTo(
        ".hero-image-wrap",
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "expo.out", delay: 0.95 },
      );
      gsap.to(".hero-name-solid", {
        xPercent: -13,
        opacity: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 0.65,
        },
      });
      gsap.to(".hero-name-outline", {
        xPercent: 12,
        opacity: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: "#home",
          start: "top top",
          end: "bottom top",
          scrub: 0.65,
        },
      });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 38, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          },
        );
      });
      gsap.utils
        .toArray<HTMLElement>(".process-card")
        .forEach((element, index) => {
          gsap.fromTo(
            element,
            { y: 55, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              delay: index * 0.09,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 88%", once: true },
            },
          );
        });
      gsap.fromTo(
        ".tools-list li",
        { opacity: 0.48, y: 12 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.11,
          ease: "none",
          scrollTrigger: {
            trigger: ".tools-list",
            start: "top 82%",
            end: "bottom 60%",
            scrub: 0.4,
          },
        },
      );
      gsap.fromTo(
        ".experience-section",
        { clipPath: "inset(0 0 8%)" },
        {
          clipPath: "inset(0)",
          ease: "none",
          scrollTrigger: {
            trigger: ".experience-section",
            start: "top 75%",
            end: "top 20%",
            scrub: 0.5,
          },
        },
      );
      gsap.utils
        .toArray<HTMLElement>(".award-card")
        .forEach((element, index) => {
          gsap.to(element, {
            y: index * -22,
            ease: "none",
            scrollTrigger: {
              trigger: ".awards-section",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        });
    }, rootRef);

    let previousScroll = 0;
    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty(
        "--scroll-progress",
        `${total > 0 ? scroll / total : 0}`,
      );
      if (!navRef.current) return;
      const hide = scroll > 160 && scroll > previousScroll + 2;
      const show = scroll < previousScroll - 2;
      if (hide) navRef.current.classList.add("nav-away");
      if (show || scroll < 80) navRef.current.classList.remove("nav-away");
      previousScroll = scroll;
    });

    return () => {
      context.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () =>
        setTestimonial((current) => (current + 1) % siteData.quotations.length),
      7000,
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;
    const move = (event: MouseEvent) =>
      gsap.to(cursor, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.2,
        ease: "power3.out",
      });
    const over = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor]",
      );
      setCursorLabel(target?.dataset.cursor ?? "");
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    const close = (event: KeyboardEvent) =>
      event.key === "Escape" && setSelectedProject(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [selectedProject]);

  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const subject = encodeURIComponent(
      `Project enquiry from ${values.get("name")}`,
    );
    const body = encodeURIComponent(
      `Name: ${values.get("name")}\nEmail: ${values.get("email")}\nProject type: ${values.get("type")}\nBudget: ${values.get("budget")}\n\n${values.get("message")}`,
    );
    window.location.href = `mailto:${siteData.email}?subject=${subject}&body=${body}`;
    setFormSent(true);
  };

  const activeTestimonial = siteData.quotations[testimonial];

  return (
    <main ref={rootRef} className="portfolio-site">
      <div className="grain" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <div
        ref={cursorRef}
        className={`custom-cursor ${cursorLabel ? "cursor-active" : ""}`}
        aria-hidden="true"
      >
        {cursorLabel}
      </div>

      <div
        className={`preloader ${loading ? "preloader-visible" : "preloader-done"}`}
        aria-hidden={!loading}
      >
        <div className="preloader-name" aria-label={siteData.preloaderText}>
          {siteData.preloaderText.split("").map((letter, index) => (
            <span
              className={letter === "." ? "preloader-punctuation" : undefined}
              key={`${letter}-${index}`}
              style={{ animationDelay: `${index * 45}ms` }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      <nav ref={navRef} className="top-nav" aria-label="Main navigation">
        <a
          className="nav-logo"
          href="#home"
          aria-label={`${siteData.name} home`}
        >
          T<span>.</span>
        </a>
        <div className="nav-links">
          {siteData.navigation.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
        <div className="nav-meta">
          <span className="nav-time">
            {localTime || "--:--"} <i /> {siteData.location}
          </span>
          <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
          </button>
          <a className="nav-cta" href="#contact">
            Get in touch{" "}
            <span>
              <ArrowUpRight size={13} />
            </span>
          </a>
        </div>
        <div className="mobile-actions">
          <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <a
            className="nav-mobile-cta"
            href="#contact"
            aria-label="Get in touch"
          >
            <ArrowUpRight size={17} />
          </a>
        </div>
      </nav>

      <section id="home" className="hero-section">
        <div className="hero-topline">
          <span className="availability">
            <i /> Available for new projects
          </span>
          <span className="hero-index">
            Independent creative practice · 2025—26
          </span>
        </div>
        <div className="hero-stage">
          <div className="hero-title-wrap">
            <h1 className="hero-title" aria-label={siteData.name}>
              <span className="hero-line hero-name-solid">
                <span className="hero-word">TAKUNDA</span>
                <b>.</b>
              </span>
              <span className="hero-line hero-name-outline">
                <span className="hero-word">CHITAMBIRA</span>
              </span>
            </h1>
          </div>
          <div className="hero-image-wrap">
            <div className="portrait-wash" />
            <img
              className="hero-portrait"
              src={siteData.portrait}
              alt="Generic profile avatar"
              fetchPriority="high"
            />
          </div>
          <CircularBadge />
          <div className="hero-socials">
            {siteData.socials.map((social, index) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
              >
                {String(index + 1).padStart(2, "0")}
              </a>
            ))}
          </div>
        </div>
        <div className="hero-bottomline">
          <div className="hero-role hero-detail">
            <p>{siteData.role}</p>
            <span>
              I design and build thoughtful digital experiences for culture,
              commerce, and the in-between.
            </span>
          </div>
          <a className="hero-scroll hero-detail" href="#clients">
            Scroll to explore <ArrowDown size={14} />
          </a>
          <MagneticLink href="#contact" className="lime-pill hero-detail">
            Let’s collaborate{" "}
            <span>
              <ArrowUpRight size={14} />
            </span>
          </MagneticLink>
        </div>
      </section>

      <section
        id="clients"
        className="client-strip"
        aria-label="Selected collaborators"
      >
        <p>/ SELECTED COLLABORATORS</p>
        <div className="client-track-wrap">
          <div className="client-track">
            {[0, 1].map((loop) =>
              siteData.brands.map((brand, index) => (
                <span key={`${loop}-${brand}`} aria-hidden={loop === 1}>
                  {brand}
                  <i>{index % 2 ? "✳" : "·"}</i>
                </span>
              )),
            )}
          </div>
        </div>
      </section>

      <section id="services" className="services-section section-pad">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-label">/ SERVICES</p>
            <span className="ghost-word" aria-hidden="true">
              SERVICES
            </span>
          </div>
          <p className="section-aside">
            A small set of skills. A wide field of possibility.
          </p>
        </div>
        <div className="services-intro">
          <h2 className="display-heading">
            DESIGN THAT MOVES
            <br />
            BRANDS FORWARD<span>.</span>
          </h2>
          <p className="services-lede">
            Good digital work should do more than look right. It should make the
            next step feel obvious.
          </p>
        </div>
        <div className="service-explorer">
          <div className="service-copy" aria-live="polite">
            <p className="service-number">
              {serviceKeys[activeService].index} / 04
            </p>
            <h3
              key={serviceKeys[activeService].title}
              className="service-active-title"
            >
              {serviceKeys[activeService].title}
            </h3>
            <p
              key={serviceKeys[activeService].detail}
              className="service-active-detail"
            >
              {serviceKeys[activeService].detail}
            </p>
            <a href="#contact" className="text-link">
              Start a conversation <ArrowUpRight size={14} />
            </a>
            <div className="service-list">
              {serviceKeys.map((service, index) => (
                <button
                  type="button"
                  key={service.key}
                  onMouseEnter={() => setActiveService(index)}
                  onFocus={() => setActiveService(index)}
                  onClick={() => setActiveService(index)}
                  className={
                    activeService === index ? "service-list-active" : ""
                  }
                >
                  <span>{service.title.toUpperCase()} ↗</span>
                  <i />
                </button>
              ))}
            </div>
          </div>
          <div className="service-visual">
            <img
              key={serviceKeys[activeService].image}
              src={serviceKeys[activeService].image}
              alt={`${serviceKeys[activeService].title} visual`}
              loading="lazy"
            />
            <div className="service-thumbnails">
              {serviceKeys.map((service, index) => (
                <button
                  type="button"
                  key={service.key}
                  aria-label={`Show ${service.title}`}
                  aria-pressed={activeService === index}
                  onClick={() => setActiveService(index)}
                >
                  <img src={service.image} alt="" loading="lazy" />
                  <span>{service.index}</span>
                </button>
              ))}
            </div>
            <span className="visual-caption">
              01 — 04&nbsp;&nbsp; / &nbsp;&nbsp;
              {serviceKeys[activeService].title}
            </span>
          </div>
        </div>
      </section>

      <section id="work" className="work-section section-pad">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-label">/ SELECTED WORK</p>
            <span className="ghost-word" aria-hidden="true">
              PORTFOLIO
            </span>
          </div>
          <p className="section-aside">
            A few good collaborations, made with intent.
          </p>
        </div>
        <div className="work-grid">
          {siteData.projects.map((project, index) => (
            <button
              type="button"
              data-cursor="VIEW"
              className={`work-card work-card-${index + 1}`}
              key={project.id}
              onClick={() => setSelectedProject(project)}
            >
              <span className="work-image">
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  loading="lazy"
                />
                <i className="work-open">
                  <ArrowUpRight size={17} />
                </i>
              </span>
              <span className="work-meta">
                <span>
                  <small>
                    {project.year} &nbsp; / &nbsp; {project.type}
                  </small>
                  <strong>{project.title}</strong>
                </span>
                <span className="tag-list">
                  {project.services.slice(0, 2).map((service) => (
                    <i key={service}>{service}</i>
                  ))}
                </span>
              </span>
            </button>
          ))}
        </div>
        <div className="work-more">
          <p>Have a project that deserves a little more?</p>
          <a href="#contact" className="outline-pill">
            More featured work{" "}
            <span>
              <ArrowUpRight size={14} />
            </span>
          </a>
        </div>
      </section>

      <section id="process" className="process-section section-pad">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-label">/ PROCESS</p>
            <span className="ghost-word" aria-hidden="true">
              METHOD
            </span>
          </div>
          <p className="section-aside">
            Clear thinking makes room for better ideas.
          </p>
        </div>
        <div className="process-layout">
          <div className="process-grid">
            {siteData.process.map(([number, title, detail]) => (
              <article className="process-card" key={number}>
                <span className="process-number">{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </div>
                <ArrowDownRight className="process-arrow" size={18} />
              </article>
            ))}
          </div>
          <aside className="tools-panel">
            <p className="section-label">/ TOOLS I USE</p>
            <ul className="tools-list">
              {siteData.tools.map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
            <p className="tools-note">
              The right tool is the one that helps the idea get there.
            </p>
          </aside>
        </div>
      </section>

      <section id="experience" className="experience-section section-pad">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-label">/ EXPERIENCE</p>
            <span className="ghost-word" aria-hidden="true">
              JOURNEY
            </span>
          </div>
          <p className="section-aside">Good work comes from good people.</p>
        </div>
        <div className="experience-list">
          {siteData.experience.map((item) => (
            <article
              className="experience-row"
              key={item.company}
              data-cursor="MORE"
              onMouseMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                event.currentTarget.style.setProperty(
                  "--mx",
                  `${event.clientX - bounds.left - bounds.width / 2}px`,
                );
                event.currentTarget.style.setProperty(
                  "--my",
                  `${event.clientY - bounds.top - bounds.height / 2}px`,
                );
              }}
            >
              <div>
                <h3>{item.company}</h3>
                <p>{item.role}</p>
              </div>
              <span>{item.dates}</span>
              <img src={item.image} alt="" loading="lazy" />
            </article>
          ))}
        </div>
      </section>

      <section className="awards-section section-pad">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-label">/ AWARDS & NOTES</p>
            <span className="ghost-word" aria-hidden="true">
              RECOGNITION
            </span>
          </div>
          <p className="section-aside">
            A nod from people whose work I admire.
          </p>
        </div>
        <div className="awards-grid">
          {siteData.awards.map((award) => (
            <article
              className="award-card"
              key={`${award.title}-${award.year}`}
            >
              <div className="award-top">
                <span>{award.year}</span>
                <ArrowUpRight size={15} />
              </div>
              <h3>{award.title}</h3>
              <p>{award.award}</p>
              <small>{award.description}</small>
            </article>
          ))}
        </div>
      </section>

      <section
        className="testimonial-section section-pad"
        aria-label="Selected quotations"
      >
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-label">/ WORDS TO WORK BY</p>
            <span className="ghost-word" aria-hidden="true">
              QUOTES
            </span>
          </div>
          <span className="section-aside">
            {String(testimonial + 1).padStart(2, "0")} /{" "}
            {String(siteData.quotations.length).padStart(2, "0")}
          </span>
        </div>
        <div className="quote-layout">
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <div className="quote-content" key={activeTestimonial.name}>
            <blockquote>{activeTestimonial.quote}</blockquote>
            <div className="quote-byline">
              <span>
                <strong>{activeTestimonial.name}</strong>
                <small>
                  {activeTestimonial.role} · {activeTestimonial.location}
                </small>
                <a
                  className="quote-source"
                  href={activeTestimonial.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Source: {activeTestimonial.source} <ArrowUpRight size={11} />
                </a>
              </span>
              <div className="quote-controls">
                <button
                  type="button"
                  aria-label="Previous quotation"
                  onClick={() =>
                    setTestimonial(
                      (testimonial + siteData.quotations.length - 1) %
                        siteData.quotations.length,
                    )
                  }
                >
                  <ArrowLeft size={15} />
                </button>
                <button
                  type="button"
                  aria-label="Next quotation"
                  onClick={() =>
                    setTestimonial(
                      (testimonial + 1) % siteData.quotations.length,
                    )
                  }
                >
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
          <figure className="quote-portrait">
            <img
              src={activeTestimonial.image}
              alt={activeTestimonial.imageAlt}
              loading="lazy"
            />
            <figcaption>{activeTestimonial.imageCredit}</figcaption>
          </figure>
        </div>
      </section>

      <section id="contact" className="contact-section section-pad">
        <div className="section-heading" data-reveal>
          <div>
            <p className="section-label">/ CONTACT</p>
            <span className="ghost-word" aria-hidden="true">
              LET’S TALK
            </span>
          </div>
          <p className="section-aside">Available for select projects.</p>
        </div>
        <div className="contact-layout">
          <div className="contact-intro">
            <h2 className="display-heading">
              LET’S CREATE SOMETHING
              <br />
              WORTH REMEMBERING<span>.</span>
            </h2>
            <p>
              Have a big thought, a small question, or a project that needs a
              good collaborator? I’d love to hear about it.
            </p>
            <a className="contact-email" href={`mailto:${siteData.email}`}>
              {siteData.email}
              <ArrowUpRight size={18} />
            </a>
          </div>
          <form className="contact-form" onSubmit={submitForm}>
            <label>
              Name
              <input
                name="name"
                autoComplete="name"
                placeholder="Your name"
                required
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
              />
            </label>
            <div className="form-row">
              <label>
                Project type
                <select name="type" defaultValue="">
                  <option value="" disabled>
                    Select one
                  </option>
                  <option>Digital product</option>
                  <option>Website</option>
                  <option>Brand system</option>
                  <option>Motion & interaction</option>
                  <option>Something else</option>
                </select>
              </label>
              <label>
                Budget
                <select name="budget" defaultValue="">
                  <option value="" disabled>
                    Select range
                  </option>
                  <option>Under $500</option>
                  <option>$500 – $1,000</option>
                  <option>$1,000 – $2,500</option>
                  <option>$2,500+</option>
                </select>
              </label>
            </div>
            <label>
              Tell me a little about it
              <textarea
                name="message"
                rows={3}
                placeholder="What are you imagining?"
                required
              />
            </label>
            <button type="submit" className="lime-pill form-submit">
              {formSent ? "Opening your email app" : "Send your note"}
              <span>
                {formSent ? <Check size={15} /> : <ArrowUpRight size={15} />}
              </span>
            </button>
          </form>
        </div>
      </section>

      <footer className="site-footer section-pad">
        <div className="footer-top">
          <p className="section-label">/ UNTIL NEXT TIME</p>
          <a href="#home" className="back-top">
            Back to top <CircleArrowUp size={17} />
          </a>
        </div>
        <div className="footer-columns">
          <div>
            <p className="footer-label">Pages</p>
            {siteData.navigation.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <div>
            <p className="footer-label">Elsewhere</p>
            {siteData.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
              >
                {social.label}
                <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>
        <a href="#home" className="footer-wordmark">
          TAKUNDA<span>.</span>
        </a>
        <div className="footer-bottom">
          <span>
            © {currentYear} {siteData.name}
          </span>
          <span>Made with intention in {siteData.location}</span>
        </div>
        <MagneticLink href={`mailto:${siteData.email}`} className="fixed-talk">
          Let’s talk <ArrowUpRight size={14} />
        </MagneticLink>
      </footer>

      {selectedProject && (
        <div
          className="case-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-title"
        >
          <button
            type="button"
            className="case-close"
            onClick={() => setSelectedProject(null)}
            aria-label="Close case study"
          >
            <X size={19} />
          </button>
          <div className="case-content">
            <p className="section-label">
              / CASE STUDY · {selectedProject.year}
            </p>
            <h2 id="case-title">{selectedProject.title}</h2>
            <p className="case-description">{selectedProject.description}</p>
            <div className="case-facts">
              <div>
                <small>CLIENT</small>
                <span>{selectedProject.client}</span>
              </div>
              <div>
                <small>SERVICES</small>
                <span>{selectedProject.services.join(" · ")}</span>
              </div>
              <div>
                <small>TOOLS</small>
                <span>{selectedProject.tools.join(" · ")}</span>
              </div>
              <div>
                <small>TIMELINE</small>
                <span>8 weeks</span>
              </div>
            </div>
            <div className="case-image">
              <img src={selectedProject.image} alt={selectedProject.imageAlt} />
            </div>
            <a
              className="lime-pill"
              href="#contact"
              onClick={() => setSelectedProject(null)}
            >
              Discuss a similar project{" "}
              <span>
                <ArrowUpRight size={14} />
              </span>
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
