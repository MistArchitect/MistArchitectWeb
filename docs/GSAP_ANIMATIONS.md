# GSAP Animation Skills & Patterns for MistArchitects

Based on the animation analysis of the high-end architectural website (Mersi Architecture), this document serves as a "Skill Reference" for implementing similar "Quiet Luxury" animations within the **MistArchitects** Next.js project using `gsap` (@gsap/react).

## Prerequisites

Ensure you are using the officially supported `@gsap/react` hook `useGSAP` for safe cleanup in React/Next.js Strict Mode.

```bash
# If not already installed:
npm install gsap @gsap/react
```

```javascript
// Typical Setup in a Server/Client Component
'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);
```

---

## 1. Smooth Scrolling Setup

High-end sites like Mersi completely rely on inertia-based smooth scrolling to make scroll-triggered animations feel deliberate. 

**Implementation Pattern (using Lenis + GSAP):**
We strongly recommend coupling GSAP ScrollTrigger with **Lenis** (a lightweight smooth scroll library) wrapped at the `layout.tsx` level.

```javascript
'use client';
import { ReactLenis } from '@studio-freight/react-lenis';
import gsap from 'gsap';

export function SmoothScrolling({ children }) {
  // Sync Lenis scroll with GSAP ScrollTrigger
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
```

---

## 2. Horizontal Scroll Hijacking (Projects Showcase)

Mersi uses a vertical-to-horizontal scrolling effect on the homepage to elegantly display projects without breaking the user flow.

**Skill / Pattern:**
Pin a container and translate its inner wrapper along the X-axis based on the scroll progress.

```tsx
'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const panels = gsap.utils.toArray('.project-panel');
    
    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 1, // Smooth scrubbing
        snap: 1 / (panels.length - 1), // Optional: snap to nearest project
        end: () => "+=" + scrollWrapperRef.current?.offsetWidth,
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="h-screen overflow-hidden flex bg-dark-gray text-white">
      <div ref={scrollWrapperRef} className="flex h-full w-[300vw]">
        {/* Render your project panels here */}
        <div className="project-panel w-screen h-full flex-shrink-0 grid place-items-center">
            Project 1
        </div>
        <div className="project-panel w-screen h-full flex-shrink-0 grid place-items-center">
            Project 2
        </div>
      </div>
    </section>
  );
}
```

---

## 3. Scroll Reveals (Images & Text)

For the "About" (Agence) or "Process" sections, elements should subtly glide upwards and fade in as they enter the viewport. Staggered reveals provide a sense of hierarchy.

**Skill / Pattern:**

```tsx
'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function TextRevealSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // 1. Reveal Titles (Split text style)
    gsap.from('.reveal-text', {
      y: 50,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%', // Triggers when the top of section hits 80% of window height
      }
    });

    // 2. Parallax Image Reveal
    gsap.from('.reveal-image', {
      scale: 1.1,
      opacity: 0,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.reveal-image',
        start: 'top 85%',
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 px-8">
      <h2 className="reveal-text overflow-hidden text-4xl">Elevating Context</h2>
      <h2 className="reveal-text overflow-hidden text-4xl">Through Design</h2>
      
      <div className="mt-12 overflow-hidden rounded-md">
        <img src="/assets/project1.jpg" className="reveal-image w-full h-[60vh] object-cover" />
      </div>
    </section>
  );
}
```

---

## 4. "Rolling Text" Navigation Hover

On hover, the visible navigation link slides up and an identical link slides in from below to replace it.

**Avoid complex GSAP for simple hover states unless absolutely needed.** CSS is often smoother and lighter for this specific micro-interaction, but here is how to structure the HTML/CSS for it, which fits perfectly with GSAP paradigms.

**Skill / Pattern:**
Group texts inside a container with `overflow-hidden`. 

**CSS Module or Global CSS approach:**
```css
.rolling-link {
  position: relative;
  display: inline-block;
  overflow: hidden;
  height: 1.2em; /* Line height */
}

.rolling-link span {
  display: flex;
  flex-direction: column;
  transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
}

.rolling-link:hover span {
  transform: translateY(-50%); /* Moves the top text up and pulls the bottom text in */
}
```

**React Component:**
```tsx
export default function RollingLink({ href, text }) {
  return (
    <a href={href} className="rolling-link font-medium hover:text-accent">
      <span>
        {/* Primary visible text */}
        <span className="block h-[1.2em]">{text}</span>
        {/* Text hidden below, ready to slide up */}
        <span className="block h-[1.2em]">{text}</span>
      </span>
    </a>
  );
}
```
*(If you must use GSAP, you'd target the `<span>` to animate `yPercent: -50` on `onMouseEnter` and `yPercent: 0` on `onMouseLeave`)*.

---

## Animation Best Practices for "Quiet Luxury"

1. **Easing is Everything:** Use `power3.out`, `power4.out`, or custom cubic-bezier curves (e.g., `CustomEase`). Avoid generic `linear` or default `power1` as they feel cheap.
2. **Timing & Stagger:** Slower duration (`0.8s` - `1.5s`) with very subtle scaling or movement (`y: 30` to `50` pixels) is more elegant than fast, snappy, large movements.
3. **Avoid Over-Animation:** If every element bounces and slides, the UX becomes overwhelming. Reserve complex layouts (like Horizontal scroll) to the main hero or project showcase, while keeping standard content blocks to simple opacity/translate reveals.
