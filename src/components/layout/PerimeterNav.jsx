import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sun, Moon, ChevronDown } from "lucide-react";
import { useProjectData } from "@/lib/ProjectDataContext";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/LanguageContext";

function FullScreenMenu({ isOpen, onClose }) {
  const { text } = useLanguage();
  const { projects } = useProjectData();
  const localizedNavLinks = [
    { label: text.home, path: "/" },
    { label: text.projects, path: "/projects" },
    { label: text.gallery, path: "/gallery" },
    { label: text.about, path: "/about" },
    { label: text.contact, path: "/contact" },
  ];
  const [rotation, setRotation] = useState(0);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const targetRotation = React.useRef(0);
  const rafRef = React.useRef(null);

  useEffect(() => {
    if (isOpen) {
      setRotation(0);
      targetRotation.current = 0;
      setProjectsOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onWheel = (e) => {
      e.preventDefault();
      const radius = Math.min(window.innerWidth, window.innerHeight) * 0.85;
      const spread = 22;
      const halfSpan = ((localizedNavLinks.length - 1) / 2) * spread;
      const bufferDeg = (100 / radius) * (180 / Math.PI);
      targetRotation.current -= e.deltaY * 0.04;
      targetRotation.current = Math.max(-(halfSpan + bufferDeg), Math.min(halfSpan, targetRotation.current));
      const animate = () => {
        setRotation(prev => {
          const diff = targetRotation.current - prev;
          if (Math.abs(diff) < 0.01) return targetRotation.current;
          return prev + diff * 0.1;
        });
        rafRef.current = requestAnimationFrame(animate);
      };
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen]);

  const RADIUS = Math.min(window.innerWidth, window.innerHeight) * 0.85;
  const cx = window.innerWidth / 2 - RADIUS;
  const cy = window.innerHeight / 2 - 20;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-charcoal overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 text-gallery p-2 focus:outline-none z-10"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Rotating circle */}
          <div
            className="absolute inset-0"
            style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${cx}px ${cy}px` }}
          >
            {/* Circle SVG */}
            <svg
              className="absolute"
              style={{ left: cx - RADIUS, top: cy - RADIUS, width: RADIUS * 2, height: RADIUS * 2, overflow: 'visible' }}
              viewBox={`0 0 ${RADIUS * 2} ${RADIUS * 2}`}
            >
              <circle
                cx={RADIUS}
                cy={RADIUS}
                r={RADIUS - 1}
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />
            </svg>

            {/* Hovered project image */}
            {hoveredProject && (
              <div
                className="absolute"
                style={{
                  left: cx,
                  top: cy,
                  width: RADIUS * 2,
                  height: RADIUS * 2,
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  zIndex: 5,
                }}
              >
                <img
                  src={hoveredProject.image}
                  alt={hoveredProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Nav items on circle perimeter */}
            {localizedNavLinks.map((link, i) => {
              const spread = 22 * (Math.PI / 180);
              const angle = (i - (localizedNavLinks.length - 1) / 2) * spread;
              const x = cx + RADIUS * Math.cos(angle);
              const y = cy + RADIUS * Math.sin(angle);
              const counterRotate = -rotation;
              return (
                <div
                  key={link.path}
                  className="absolute flex flex-col items-start"
                  style={{
                    left: x,
                    top: y,
                    transform: `translate(0, -50%) rotate(${counterRotate}deg)`,
                    transformOrigin: 'center center',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-cobalt flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-mono text-xs text-white/40 tracking-widest">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {link.path === '/projects' ? (
                        <div className="flex items-center gap-3">
                          <Link
                            to={link.path}
                            onClick={onClose}
                            className="font-body text-3xl md:text-4xl font-light text-gallery hover:text-cobalt transition-colors duration-300 focus:outline-none leading-tight"
                          >
                            {link.label}
                          </Link>
                          <button
                            onClick={(e) => { e.preventDefault(); setProjectsOpen(p => !p); }}
                            className="text-white/50 hover:text-cobalt transition-colors duration-200 focus:outline-none mt-1"
                            aria-label="Toggle projects"
                          >
                            <ChevronDown
                              className="w-5 h-5 transition-transform duration-300"
                              style={{ transform: projectsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            />
                          </button>
                        </div>
                      ) : (
                        <Link
                          to={link.path}
                          onClick={onClose}
                          className="font-body text-3xl md:text-4xl font-light text-gallery hover:text-cobalt transition-colors duration-300 focus:outline-none leading-tight"
                        >
                          {link.label}
                        </Link>
                      )}
                      {link.path === '/projects' && projectsOpen && (
                        <div className="mt-3 flex flex-col gap-1 pl-1">
                          {projects.map((p, pi) => (
                            <Link
                              key={p.slug}
                              to={`/project/${p.slug}`}
                              onClick={onClose}
                              onMouseEnter={() => setHoveredProject(p)}
                              onMouseLeave={() => setHoveredProject(null)}
                              className="font-body text-base font-light text-white/50 hover:text-cobalt transition-colors duration-200 focus:outline-none leading-snug"
                            >
                              <span className="font-mono text-xs text-white/30 mr-2">{p.id}</span>
                              {p.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AnimatedLogo() {
  return <img src="/images/mebri-design-logo.png" alt="Mebri Design" className="h-[63px] w-[73px] border-none" />;
}

export default function PerimeterNav() {
  const { theme, setTheme } = useTheme();
  const { text } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const location = useLocation();

  const isProjectPage = location.pathname.startsWith("/project/");

  useEffect(() => {
    setMenuOpen(false);
    setHeroVisible(true);
  }, [location]);

  useEffect(() => {
    if (!isProjectPage) return;
    const onScroll = () => {
      const heroHeight = window.innerHeight;
      setHeroVisible(window.scrollY < heroHeight * 0.8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isProjectPage, location.pathname]);

  const shouldShowBackground = !heroVisible && typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      <div className="fixed inset-0 z-40 pointer-events-none" aria-hidden="true">
        {/* Unified header background */}
        <div
          className="pointer-events-none lg:hidden fixed top-4 left-4 right-4 flex h-[82px] items-start justify-between overflow-visible sm:top-6 sm:left-6 sm:right-6"
          style={{
            backgroundColor: shouldShowBackground ? 'rgba(255, 255, 255, 0.6)' : 'transparent',
            backdropFilter: shouldShowBackground ? 'blur(10px)' : 'none',
            borderRadius: '8px',
            padding: shouldShowBackground ? '8px' : '0px',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Top Left  -  Name */}
          <Link
            to="/"
            className="pointer-events-auto absolute left-0 top-1/2 shrink-0 -translate-y-1/2 hover:text-cobalt transition-colors duration-500 focus:outline-none"
            style={{
              color: isProjectPage && heroVisible ? '#F5F5F7' : undefined
            }}
          >
            <AnimatedLogo />
          </Link>

          {/* Top Center  -  Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5 hover:text-cobalt transition-colors duration-300 focus:outline-none"
            style={{
              color: isProjectPage && heroVisible ? '#F5F5F7' : undefined
            }}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 scale-90" /> : <Moon className="w-5 h-5 scale-90" />}
          </button>

          {/* Top Right  -  Menu Trigger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="pointer-events-auto absolute right-0 top-1/2 z-10 w-max shrink-0 -translate-y-1/2 whitespace-nowrap font-mono text-xs tracking-widest uppercase hover:text-cobalt transition-colors duration-500 focus:outline-none"
            style={{
              color: isProjectPage && heroVisible ? '#F5F5F7' : undefined
            }}
            aria-label="Open menu"
          >
              {text.menu}
          </button>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:block">
          {/* Top Left  -  Name */}
          <Link
            to="/"
            className="pointer-events-auto absolute top-2 left-6 md:top-2 md:left-8 hover:text-cobalt transition-colors duration-500 focus:outline-none"
            style={{
              color: isProjectPage && heroVisible ? '#F5F5F7' : undefined
            }}
          >
            <AnimatedLogo />
          </Link>

          {/* Top Center  -  Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="pointer-events-auto absolute top-6 left-1/2 -translate-x-1/2 md:top-8 p-1.5 hover:text-cobalt transition-colors duration-300 focus:outline-none"
            style={{
              color: isProjectPage && heroVisible ? '#F5F5F7' : undefined
            }}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 scale-90" /> : <Moon className="w-5 h-5 scale-90" />}
          </button>

          {/* Top Right  -  Menu Trigger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="pointer-events-auto absolute top-6 right-6 md:top-8 md:right-8 whitespace-nowrap font-mono text-xs md:text-sm tracking-widest uppercase hover:text-cobalt transition-colors duration-500 focus:outline-none"
            style={{
              color: isProjectPage && heroVisible ? '#F5F5F7' : undefined
            }}
            aria-label="Open menu"
          >
            {text.menu}
          </button>
        </div>



        {/* Bottom Right  -  CTA */}
        <Link
          to="/contact"
          className="pointer-events-auto absolute bottom-[26px] right-[26px] font-mono text-xs md:text-sm tracking-widest uppercase hover:text-cobalt transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-cobalt focus:ring-offset-4 md:max-lg:hidden"
          style={{ color: isProjectPage && heroVisible ? '#F5F5F7' : undefined }}
        >
          {text.commission} &gt;
        </Link>
      </div>

      <FullScreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}