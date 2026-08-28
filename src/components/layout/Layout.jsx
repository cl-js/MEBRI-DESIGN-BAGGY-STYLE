import React, { useLayoutEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PerimeterNav from "./PerimeterNav";
import KineticFooter from "./KineticFooter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import SEO from "./../SEO";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Layout() {
  const smootherRef = useRef(null);
  const location = useLocation();

  useLayoutEffect(() => {
    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.3,
      effects: true,
      smoothTouch: 0.1,
    });
    return () => {
      smootherRef.current?.kill();
    };
  }, []);

  useLayoutEffect(() => {
    if (smootherRef.current) {
      smootherRef.current.scrollTo(0, false);
      ScrollTrigger.refresh();
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <>
      <SEO />
      <PerimeterNav />
      <div id="smooth-wrapper" style={{ overflow: "hidden", position: "fixed", height: "100%", width: "100%", top: 0, left: 0 }}>
        <div id="smooth-content" className="ghost-grid min-h-screen">
          <main>
            <Outlet />
          </main>
          <KineticFooter />
        </div>
      </div>
    </>
  );
}