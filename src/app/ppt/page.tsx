"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './style.css';

export default function PptPage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 13;

  // Track Mouse Spotlight coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        setCurrentSlide((prev) => (prev === totalSlides ? 1 : prev + 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide((prev) => (prev === 1 ? totalSlides : prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides ? 1 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 1 ? totalSlides : prev - 1));
  };

  const percentage = (currentSlide / totalSlides) * 100;

  const handlePageClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) return;
    nextSlide();
  };

  return (
    <div className="app-container" onClick={handlePageClick} style={{ cursor: 'pointer' }}>

      {/* Top Meta Header Bar */}
      <header className="header-bar">
        <div className="brand-wrapper">
          <Link href="/" className="flex items-center gap-2.5 text-decoration-none group" onClick={(e) => e.stopPropagation()}>
            <img src="/icon.png" alt="Introlic Emblem" className="brand-logo" />
            <span className="brand-title">INTROLiC</span>
          </Link>
          <span className="brand-pill">KOTHARI FELLOWSHIP PITCH</span>
        </div>

        {/* Interactive Slide Jump Dots */}
        <div className="slide-dots-container" onClick={(e) => e.stopPropagation()}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              className={`slide-dot ${currentSlide === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i + 1)}
              title={`Jump to Slide ${i + 1}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="slide-counter-badge">
          SLIDE {currentSlide.toString().padStart(2, '0')} // {totalSlides.toString().padStart(2, '0')}
        </div>
      </header>

      {/* Main Slide View Area */}
      <div className="main-content">

        {/* ============================================================ */}
        {/* Slide 1: Personal Introduction — Meet Faiz */}
        {/* ============================================================ */}
        <section className={`slide ${currentSlide === 1 ? 'active' : ''}`} id="slide-1">
          <main className="hero-pane">
            <div className="slide-num">[ 01 // WHO IS FAIZ ]</div>
            <h1>
              Hi. I'm Faiz. I'm <em>17 years old</em>.
            </h1>
            <p>
              I was born in 2009 in India. I have no college degree, no institutional backing, and no family capital in tech. What I do have is seven years of obsessive, self-directed building — starting on a 5-inch Android phone with no computer. I taught myself to code at age 12 from YouTube videos, ran Apache web servers on my phone, built a 13,000-user platform from zero, got rejected by investors because of my age, and kept going anyway. I am not applying to the Kothari Fellowship because I have a polished corporate pitch. I am applying because I genuinely believe I have found something important — and I need compute time to prove it.
            </p>
          </main>
          <aside className="meta-pane">
            <div className="meta-card">
              <div className="meta-label">NAME</div>
              <div className="meta-content">Faiz (mr.Faiz)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">AGE</div>
              <div className="meta-content">17 years old (Born 2009)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">LOCATION</div>
              <div className="meta-content">India — Building for the World</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">CORE GOAL</div>
              <div className="meta-content">Pioneer India's first DLM / SEDD sovereign AI frontier</div>
            </div>
          </aside>
        </section>

        {/* ============================================================ */}
        {/* Slide 2: The Lab Overview */}
        {/* ============================================================ */}
        <section className={`slide ${currentSlide === 2 ? 'active' : ''}`} id="slide-2">
          <main className="hero-pane">
            <div className="slide-num">[ 02 // INTROLIC — THE LAB ]</div>
            <h1>
              Faiz is building <em>Introlic</em>.
            </h1>
            <p>
              Introlic is an independent AI research lab I founded on March 26, 2026. While the entire global AI industry is crowded into established Transformers, I am exploring an untapped gold mine: <strong>Discrete Diffusion Language Models (DLMs)</strong> and <strong>SEDD (Score Entropy Discrete Diffusion) architectures</strong>. We are opening an entirely new foundational AI frontier in India — to solve context window limits, eliminate next-token hallucinations, and build sovereign self-correcting intelligence from first mathematical principles. Visit us at <a href="https://introlic.in" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>introlic.in</a>.
            </p>
          </main>
          <aside className="meta-pane">
            <div className="meta-card">
              <div className="meta-label">LAB</div>
              <div className="meta-content">Introlic — introlic.in</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">CORE FOCUS</div>
              <div className="meta-content">Discrete Diffusion (DLM) &amp; SEDD</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">MACRO MISSION</div>
              <div className="meta-content">Sovereign Indian Deep-Tech &amp; AI</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">FELLOWSHIP TARGET</div>
              <div className="meta-content">Kothari Fellowship ($5,000 – $7,000)</div>
            </div>
          </aside>
        </section>

        {/* ============================================================ */}
        {/* Slide 3: The DLM Gold Mine — Problem & Core Idea */}
        {/* ============================================================ */}
        <section className={`slide ${currentSlide === 3 ? 'active' : ''}`} id="slide-3">
          <main className="hero-pane">
            <div className="slide-num">[ 03 // THE UNEXPLORED GOLD MINE ]</div>
            <h1>
              The DLM Gold Mine: <em>Beyond Transformers</em>.
            </h1>
            <p>
              Everyone is building on standard autoregressive Transformers because it is the safe, established default. But Transformers have critical flaws: quadratic O(N²) context window explosion and rigid left-to-right generation where the model cannot fix its own errors. Discrete Diffusion Language Models (DLMs) and SEDD represent an unexplored gold mine where text is generated via iterative bidirectional denoising — allowing models to fix mistakes during generation, handle long contexts efficiently, and discover brand-new reasoning dynamics. The entire global AI industry is crowded here, and almost nobody in India is even looking at it.
            </p>
          </main>
          <aside className="meta-pane">
            <div className="meta-card">
              <div className="meta-label">THE TRANSFORMER TRAP</div>
              <div className="meta-content">Left-to-right generation cannot fix mistakes</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">CONTEXT BOTTLENECK</div>
              <div className="meta-content">Quadratic O(N²) attention cost limits long context</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">THE DLM GOLD MINE</div>
              <div className="meta-content">Iterative score-based discrete denoising (SEDD)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">SUPERPOWER</div>
              <div className="meta-content">Real-time self-correction &amp; bidirectional reasoning</div>
            </div>
          </aside>
        </section>

        {/* ============================================================ */}
        {/* Slide 4: Mobile Origins (2018 - 2022) */}
        {/* ============================================================ */}
        <section className={`slide ${currentSlide === 4 ? 'active' : ''}`} id="slide-4">
          <main className="hero-pane">
            <div className="slide-num">[ 04 // MOBILE ORIGINS ]</div>
            <h1>
              Coding on a 5-inch phone: <em>Spck Editor &amp; Termux</em>.
            </h1>
            <p>
              I discovered coding in 2018 through Python tutorials on YouTube. I was 9 years old. Lacking a computer, I used an Android app called Spck Editor on a 5-inch phone screen to write code. To test my programs, I ran local MySQL and Apache web servers directly on Android via KSWEB and Termux. Four years of building with zero hardware privilege. By the time I touched a real computer, I already knew HTML, CSS, JavaScript, PHP, SQL, Python, and Node.js. I learned by doing — because that was the only option I had.
            </p>
          </main>
          <aside className="meta-pane">
            <div className="meta-card">
              <div className="meta-label">DEVELOPMENT ENV</div>
              <div className="meta-content">Spck Editor / Termux on Android</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">LOCAL SERVERS</div>
              <div className="meta-content">Apache, MariaDB &amp; PHP on Android</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">PROGRAMMING MASTERED</div>
              <div className="meta-content">HTML, CSS, JS, PHP, SQL, Python, Node.js</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">TIMELINE</div>
              <div className="meta-content">2018 – 2022 (Zero hardware privilege)</div>
            </div>
          </aside>
        </section>

        {/* ============================================================ */}
        {/* Slide 5: Minecraft Modding & Freelancing (2022 - 2025) */}
        {/* ============================================================ */}
        <section className={`slide ${currentSlide === 5 ? 'active' : ''}`} id="slide-5">
          <main className="hero-pane">
            <div className="slide-num">[ 05 // MOD ARCHITECTURE ]</div>
            <h1>
              From gamer to <em>backend developer</em>.
            </h1>
            <p>
              I played Minecraft like any other teenager. But instead of just gaming, I became obsessed with how the backend systems, mods, and custom plugins worked. I taught myself Java and Kotlin to write custom plugins. By 2025, I was freelancing — building and selling custom Minecraft server plugins to earn my own capital. High developer competition eventually oversaturated the market, but it gave me my first real lessons: client management, production-grade logic, and what it means to ship something that real people pay for.
            </p>
          </main>
          <aside className="meta-pane">
            <div className="meta-card">
              <div className="meta-label">THE DRIFT</div>
              <div className="meta-content">Minecraft gamer to backend developer</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">CUSTOM WORK</div>
              <div className="meta-content">Java &amp; Kotlin mods and server plugins</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">COMMERCIAL</div>
              <div className="meta-content">Minecraft plugin freelancing (2025)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">LESSON</div>
              <div className="meta-content">Saturated markets &amp; early monetization instincts</div>
            </div>
          </aside>
        </section>

        {/* ============================================================ */}
        {/* Slide 6: LLM Obsession — Diving into AI Mathematics (2022 - 2023) */}
        {/* ============================================================ */}
        <section className={`slide ${currentSlide === 6 ? 'active' : ''}`} id="slide-6">
          <main className="hero-pane">
            <div className="slide-num">[ 06 // AI MATHEMATICS ]</div>
            <h1>
              Diving into <em>Attention Mathematics</em>.
            </h1>
            <p>
              When ChatGPT launched on Nov 30, 2022, I was obsessed. Not just with using it — with understanding exactly how it worked. I used ChatGPT itself to teach me Transformer mathematics, attention matrices, and loss curves. Deconstructing these foundations showed me where Transformers hit brick walls — the context window scaling problem and autoregressive compounding errors. That realization is what eventually pulled me toward Discrete Diffusion as the next unexplored frontier. I wasn't looking for a trend. I was following the math.
            </p>
          </main>
          <aside className="meta-pane">
            <div className="meta-card">
              <div className="meta-label">TURNING POINT</div>
              <div className="meta-content">ChatGPT Launch (Nov 30, 2022)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">LEARNING METHOD</div>
              <div className="meta-content">Prompting LLMs to deconstruct Attention maps</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">MATHEMATICS MASTERED</div>
              <div className="meta-content">Scaled Dot-Product Attention &amp; MLP layers</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">REALIZATION</div>
              <div className="meta-content">Transformers will hit an autoregressive ceiling</div>
            </div>
          </aside>
        </section>

        {/* ============================================================ */}
        {/* Slide 7: First PC & Hosting Failure (2023 - 2024) */}
        {/* ============================================================ */}
        <section className={`slide ${currentSlide === 7 ? 'active' : ''}`} id="slide-7">
          <main className="hero-pane">
            <div className="slide-num">[ 07 // THE FIRST PC ]</div>
            <h1>
              First PC &amp; <em>infrastructure lessons</em>.
            </h1>
            <p>
              I bought my first computer in mid-2023. When Omegle was banned in November 2023, I spotted the gap immediately and started building a Node.js clone. I bought shared PHP hosting to deploy it — and it couldn't run WebSockets. My first real infrastructure failure. But I didn't call it a loss. I called it a lesson: web development isn't just code. It's hosting, servers, thread pools, and socket buffers. I learned Linux server administration the hard way, and I never forgot what that felt like.
            </p>
          </main>
          <aside className="meta-pane">
            <div className="meta-card">
              <div className="meta-label">HARDWARE</div>
              <div className="meta-content">1st Desktop PC (Bought Mid-2023)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">MARKET VACUUM</div>
              <div className="meta-content">Omegle Ban (Nov 8, 2023)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">DEPLOYMENT LESSON</div>
              <div className="meta-content">Node.js WebSockets on Shared PHP Hosting</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">KNOWLEDGE GAINED</div>
              <div className="meta-content">Linux servers, socket buffers, thread pools</div>
            </div>
          </aside>
        </section>

        {/* ============================================================ */}
        {/* Slide 8: Reflimitgaming 13K Users (2024 - 2025) */}
        {/* ============================================================ */}
        <section className={`slide ${currentSlide === 8 ? 'active' : ''}`} id="slide-8">
          <main className="hero-pane">
            <div className="slide-num">[ 08 // TRAFFIC SCALE ]</div>
            <h1>
              Scaling to <em>13,000 registered users</em>.
            </h1>
            <p>
              Using hosting credit I had earned, I built reflimitgaming.in — a gaming community platform. I sponsored Minecraft creator SanjitGaming to promote it, and the platform scaled to over 13,000 registered users. Shared hosting limits eventually forced a shutdown, but the ad profits funded my second developer machine. More importantly, I proved something to myself: I could build a real product, grow a real audience, and monetize — all at age 15, from India, without a single investor. The platform shut down on my terms, not someone else's.
            </p>
          </main>
          <aside className="meta-pane">
            <div className="meta-card">
              <div className="meta-label">PLATFORM</div>
              <div className="meta-content">reflimitgaming.in (Active 2024–2025)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">AUDIENCE SCALE</div>
              <div className="meta-content">13,000+ Registered Users</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">CREATOR PROOF</div>
              <div className="meta-content">
                <a href="https://youtu.be/yrdg9IY1EzI" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                  SanjitGaming Sponsor Video
                </a>
              </div>
            </div>
            <div className="meta-card">
              <div className="meta-label">OUTCOME</div>
              <div className="meta-content">Profits funded 2nd developer PC in 2026</div>
            </div>
          </aside>
        </section>

        {/* ============================================================ */}
        {/* Slide 9: Inslian Scan & First Pitch (2025) */}
        {/* ============================================================ */}
        <section className={`slide ${currentSlide === 9 ? 'active' : ''}`} id="slide-9">
          <main className="hero-pane">
            <div className="slide-num">[ 09 // THE ALL IN PITCH ]</div>
            <h1>
              Rejected for my age. <em>Kept going anyway</em>.
            </h1>
            <p>
              In 2025, I built Inslian Scan — a mobile AI food scanner that parsed ingredient labels and provided deep nutritional analysis using Computer Vision and OCR. I pitched it to All In Capital for seed funding. They rejected me. Not because of the product — because of my age. I was 16. Instead of walking away, I wrote back and asked: "What were my exact mistakes? Help me learn." That response — that willingness to be corrected — is one of the most important things I know about myself. I don't repeat mistakes I understand. The fellowship committee will never have to tell me the same thing twice.
            </p>
          </main>
          <aside className="meta-pane">
            <div className="meta-card">
              <div className="meta-label">AI APP</div>
              <div className="meta-content">Inslian Scan (AI Food Scanner)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">TECH STACK</div>
              <div className="meta-content">Computer Vision + OCR + AI Analysis</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">PITCH TARGET</div>
              <div className="meta-content">All In Capital (Rejected — Age)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">KEY ATTRIBUTE</div>
              <div className="meta-content">Radical coachability &amp; mistake dissection</div>
            </div>
          </aside>
        </section>

        {/* ============================================================ */}
        {/* Slide 10: The Paradigm Shift & DLM Frontier (2026) */}
        {/* ============================================================ */}
        <section className={`slide ${currentSlide === 10 ? 'active' : ''}`} id="slide-10">
          <main className="hero-pane">
            <div className="slide-num">[ 10 // THE PARADIGM SHIFT ]</div>
            <h1>
              Opening the <em>DLM &amp; SEDD frontier</em>.
            </h1>
            <p>
              DeepSeek proved that challenging US monopolies doesn't require billions of dollars — it takes bold architectural shifts. While major global labs remain locked into standard autoregressive Transformers, frontier research from Inception Labs and Stanford SEDD proved Diffusion Language Models (DLM) are an unexplored gold mine. DLMs refine entire thoughts simultaneously, self-correcting mistakes in real-time. We are opening this exact frontier in India. Not because it's trendy. Because the math says it's real, and almost no one in our country is looking at it.
            </p>
          </main>
          <aside className="meta-pane">
            <div className="meta-card">
              <div className="meta-label">INSPIRATION</div>
              <div className="meta-content">DeepSeek MoE &amp; Inception Labs (SEDD)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">ARCHITECTURE</div>
              <div className="meta-content">Discrete Diffusion (DLM) &amp; SEDD</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">KEY ADVANTAGE</div>
              <div className="meta-content">Iterative text denoising &amp; self-correction</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">STRATEGIC OPPORTUNITY</div>
              <div className="meta-content">Untapped gold mine for novel Indian AI discoveries</div>
            </div>
          </aside>
        </section>

        {/* ============================================================ */}
        {/* Slide 11: The "in1" Movement & Roadmap */}
        {/* ============================================================ */}
        <section className={`slide ${currentSlide === 11 ? 'active' : ''}`} id="slide-11">
          <main className="hero-pane">
            <div className="slide-num">[ 11 // ROADMAP &amp; MOVEMENT ]</div>
            <h1>
              The <em>"in1" movement</em>.
            </h1>
            <p>
              I am training prototype Discrete Diffusion Language Models starting at 220M parameters based on SEDD architectures — to prove bidirectional self-correcting reasoning and context window scaling work. Once validated, I will launch a public developer movement called 'in1' on social media to rally Indian engineers and build sovereign DLMs together. The $5,000 – $7,000 Kothari Fellowship will fund cloud GPU compute clusters (H100/A100 instances) to train and benchmark our SEDD prototypes. If you reject me, please tell me my exact mistake points so I can learn. I mean that literally.
            </p>
          </main>
          <aside className="meta-pane">
            <div className="meta-card">
              <div className="meta-label">PROTOTYPE GOAL</div>
              <div className="meta-content">220M SEDD Diffusion Model (DLM)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">PUBLIC MOVEMENT</div>
              <div className="meta-content">'in1' developer alliance for Indian AI</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">COACHABILITY</div>
              <div className="meta-content">Requesting feedback on mistakes if rejected</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">FELLOWSHIP ASK</div>
              <div className="meta-content">Kothari Fellowship ($5,000 – $7,000 Compute)</div>
            </div>
          </aside>
        </section>

        {/* ============================================================ */}
        {/* Slide 12: The Core Pitch */}
        {/* ============================================================ */}
        <section className={`slide ${currentSlide === 12 ? 'active' : ''}`} id="slide-12">
          <main className="hero-pane">
            <div className="slide-num">[ 12 // THE CORE PITCH ]</div>
            <h1>
              Not a wrapper. A bid to validate the <em>DLM gold mine</em>.
            </h1>
            <p>
              I'm not asking for funding to build another ChatGPT wrapper. I'm applying for the Kothari Fellowship ($5,000 – $7,000) to validate a Discrete Diffusion Language Model (DLM) and SEDD architecture that solves the context window problem, lets AI fix its mistakes during generation, and breaks free from the autoregressive Transformer trap. I'm 17, self-funded, and working from India. I don't need permission to build. I need compute time to prove what I already believe is true.
            </p>
          </main>
          <aside className="meta-pane">
            <div className="meta-card">
              <div className="meta-label">GOAL</div>
              <div className="meta-content">Validate SEDD / DLM discrete diffusion architecture</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">DIFFERENTIATION</div>
              <div className="meta-content">Math-native DLM research, not Transformer wrappers</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">FELLOWSHIP TARGET</div>
              <div className="meta-content">Kothari Fellowship ($5,000 – $7,000)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">FOCUS</div>
              <div className="meta-content">Bidirectional self-correction &amp; context scaling</div>
            </div>
          </aside>
        </section>

        {/* ============================================================ */}
        {/* Slide 13: The Fellowship Mission */}
        {/* ============================================================ */}
        <section className={`slide ${currentSlide === 13 ? 'active' : ''}`} id="slide-13">
          <main className="hero-pane">
            <div className="slide-num">[ 13 // THE FELLOWSHIP MISSION ]</div>
            <h1>
              Building India's <em>Sovereign AI Foundation</em>.
            </h1>
            <p>
              The next frontier of AI will not be won by scaling up legacy autoregressive Transformer clusters with brute force. It will be won by mathematical breakthroughs in non-autoregressive discrete diffusion, score-based reasoning, and compute efficiency from first principles. A 17-year-old from India, self-taught on a phone, with 13,000 users built from zero, is asking for the chance to prove that. With the Kothari Fellowship, Introlic will train and validate our 220M SEDD prototype, open-source our research benchmarks, and rally an entire generation of Indian engineers through the 'in1' movement. Join us in building foundational technology from India for the world. <a href="https://introlic.in" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>introlic.in</a>
            </p>
          </main>
          <aside className="meta-pane">
            <div className="meta-card">
              <div className="meta-label">MACRO MISSION</div>
              <div className="meta-content">Sovereign Deep-Tech &amp; AI Ecosystem for India</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">FELLOWSHIP ASK</div>
              <div className="meta-content">Kothari Fellowship ($5,000 – $7,000 Compute)</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">IMMEDIATE MILESTONE</div>
              <div className="meta-content">220M SEDD Prototype Training &amp; Validation</div>
            </div>
            <div className="meta-card">
              <div className="meta-label">DEVELOPER ALLIANCE</div>
              <div className="meta-content">'in1' Movement — introlic.in</div>
            </div>
          </aside>
        </section>

      </div>

      {/* Bottom Control Footer */}
      <footer className="footer-bar">
        {/* Left: Previous Slide */}
        <div className="min-w-[170px]">
          {currentSlide === 1 ? (
            <div className="kbd-shortcut">
              <span className="kbd-key">SPACE / ARROWS</span> TO NAVIGATE
            </div>
          ) : (
            <button
              className="nav-btn"
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            >
              <span>&larr; PREVIOUS</span>
            </button>
          )}
        </div>

        {/* Center: Sleek Progress Bar */}
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Right: Next Slide / Restart PPT */}
        <div className="min-w-[170px] flex justify-end">
          <button
            className={`nav-btn ${currentSlide === totalSlides ? 'primary' : ''}`}
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          >
            {currentSlide === totalSlides ? (
              <span>RESTART DECK &#8634;</span>
            ) : (
              <span>NEXT SLIDE &rarr;</span>
            )}
          </button>
        </div>
      </footer>

    </div>
  );
}
