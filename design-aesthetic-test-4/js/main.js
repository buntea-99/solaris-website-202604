// --------------------------------------------------------
// TASTE ENGINE: Core Animation & Physics Orchestration
// --------------------------------------------------------

gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Apple-like Smooth Scrolling (Lenis)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like easing map
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Tie GSAP to Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);


// 2. Initial Page Load Orchestration (Cinematic Entrance)
window.addEventListener("load", () => {
  const masterTimeline = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.5 } });

  // Floating Nav Drop
  masterTimeline.to(".nav-fluid-entrance", {
    y: 10,
    opacity: 1,
    scale: 1,
    duration: 1.2,
    ease: "expo.out",
  }, 0.2);

  // Hero Stamp
  masterTimeline.to(".stamp-reveal", {
    y: "0%",
    opacity: 1,
    duration: 1
  }, 0.1);

  // Hero Text Sequence
  masterTimeline.to(".line-anim", {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
    stagger: 0.1,
    duration: 1.2,
  }, 0.3);

  // Inline Image Pop
  masterTimeline.to(".img-inline-anim", {
    scale: 1,
    opacity: 1,
    ease: "elastic.out(1, 0.75)",
    duration: 1.5
  }, 0.6);

  // Description and Blob
  masterTimeline.to(".desc-anim", {
    y: 0,
    opacity: 1,
  }, 0.8);
  masterTimeline.to(".hero-blob", {
    y: 0,
    opacity: 0.2, // Back to normal opacity
    duration: 2,
    ease: "power2.out"
  }, 0.5);
});


// 3. Scroll Interactions & Parallax

// Horizontal Scroll Hijack (The "Capabilities" engine)
const horizontalWrap = document.querySelector(".horizontal-gallery");
if(horizontalWrap) {
  const scrollWidth = horizontalWrap.scrollWidth - window.innerWidth;
  
  gsap.to(horizontalWrap, {
    x: -scrollWidth,
    ease: "none",
    scrollTrigger: {
      trigger: "#capabilities-wrap",
      pin: true,
      scrub: 1.5,
      start: "top top",
      end: () => "+=" + scrollWidth,
    }
  });

  // Fade in the section header
  gsap.to(".horizontal-heading", {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: "#capabilities-wrap",
      start: "top 30%",
      end: "top top",
      scrub: true,
    }
  });
}

// Bento Box Grid Stagger Reveal
const bentoCards = gsap.utils.toArray(".bento-up");
if(bentoCards.length > 0) {
  ScrollTrigger.create({
    trigger: "#deployments",
    start: "top 60%",
    onEnter: () => {
      gsap.fromTo(bentoCards, 
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "expo.out" }
      );
    }
  });

  // Text Split Reveal Header
  gsap.fromTo(".split-text-reveal",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: "#deployments", start: "top 70%" } }
  );

  // Number Counter Animation
  const counterObj = { val: 0 };
  gsap.to(counterObj, {
    val: 100,
    duration: 2,
    ease: "power2.out",
    scrollTrigger: { trigger: ".mono-counter", start: "top 80%" },
    onUpdate: () => {
      document.querySelector(".mono-counter").innerHTML = Math.round(counterObj.val) + "K+";
    }
  });

  // Progress Bar Expand
  gsap.to(".progress-bar-anim", {
    scaleX: 1,
    duration: 2,
    ease: "expo.out",
    scrollTrigger: { trigger: ".mono-counter", start: "top 80%" }
  });
}

// 4. Footer Sequence
const footerElements = gsap.utils.toArray(".footer-reveal");
if(footerElements.length) {
  gsap.fromTo(footerElements,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: "footer", start: "top 60%" } }
  );
}

// 5. Perpetual Micro-Interactions (Magnetic Hover & Floating)
document.addEventListener("mousemove", (e) => {
  const { clientX, clientY } = e;
  
  // Parallax the Hero Inline Image slightly based on mouse
  const imgInline = document.querySelector(".img-inline-anim");
  if(imgInline) {
    const x = (clientX / window.innerWidth - 0.5) * 15;
    const y = (clientY / window.innerHeight - 0.5) * 15;
    gsap.to(imgInline, { x: x, y: y, duration: 1, ease: "power2.out" });
  }

  // Tilt cards slightly
  document.querySelectorAll(".hover-card-tilt").forEach(card => {
    const rect = card.getBoundingClientRect();
    const isHovering = (
      clientX >= rect.left && 
      clientX <= rect.right && 
      clientY >= rect.top && 
      clientY <= rect.bottom
    );
    
    if(isHovering) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateX = ((clientY - centerY) / (rect.height / 2)) * -2;
      const rotateY = ((clientX - centerX) / (rect.width / 2)) * 2;
      
      gsap.to(card, { rotateX, rotateY, duration: 0.5, ease: "power2.out" });
    } else {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
    }
  });
});
