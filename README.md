<div align="center">

  <img src="public/icon-white.png" alt="Introlic Emblem" width="72" height="72" />

  # INTROLIC

  **Engineering High-Performance AI & Software Systems.**  
  *Founded in India • Building for the World*

  [![Website](https://img.shields.io/badge/Website-introlic.in-00a3ff?style=flat-square&logo=google-chrome&logoColor=white)](https://introlic.in)
  [![Research](https://img.shields.io/badge/Research_Papers-introlic.in%2Fresearch-00a3ff?style=flat-square)](https://introlic.in/research)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

</div>

---

## ⚡ What is Introlic?

**Introlic** ([introlic.in](https://introlic.in)) is an independent AI research and engineering lab based in India. We focus on investigating alternative foundational model architectures—specifically **Discrete Diffusion Language Models (DLMs)** and **Score Entropy Discrete Diffusion (SEDD)**—to make high-performance text generation more compute-efficient and self-correcting.

---

## 🔬 Core Research: Discrete Diffusion & SEDD

### 1. The Bottleneck with Autoregressive Transformers
Most modern language models generate text strictly token-by-token from left to right. This design has two main limitations:
- **Compounding Errors:** If the model makes a reasoning mistake early on, it cannot backtrack or correct itself—it continues generating and compounding the error.
- **Context Scaling Costs:** Attention mechanisms scale quadratically with sequence length, creating heavy compute requirements for long contexts.

### 2. The Discrete Diffusion Alternative
Pioneered by researchers at frontier labs like **Inception Labs**, discrete diffusion models approach generation globally:
- **Bidirectional Refinement:** The model starts from masked tokens and iteratively denoises the entire sequence simultaneously.
- **Real-Time Self-Correction:** Because every token attends to all other tokens across diffusion steps, the model has the innate ability to detect internal inconsistencies and self-correct during generation.

### 3. Our Investigation & Hypothesis
> *"We are not claiming to have invented discrete diffusion. We are investigating whether this promising research direction can be made significantly more accessible and cost-effective under severe compute constraints."*

- **The Problem:** Discrete diffusion is currently seen as too compute-heavy and complex for independent researchers.
- **Our Hypothesis:** Specific optimizations in noise corruption schedules, parameter-efficient architectures, and sample-efficient training configurations can meaningfully improve the compute-performance trade-off.
- **The Prototype:** We are training and evaluating a **220M-parameter SEDD prototype** to collect empirical data on loss convergence, self-correction fidelity, and training efficiency.

---

## 🌐 The IN1 Initiative

The **IN1 Initiative** is an open-research movement started at Introlic to help build an active deep-tech engineering culture in India:
- **Open Checkpoints & Code:** Open-sourcing model weights, training scripts, and preprocessing pipelines.
- **Empirical Transparency:** Publishing raw loss curves, ablation tests, and negative findings openly—showing what works and what fails.
- **Educational Notes:** Publishing technical write-ups to help other young engineers understand, reproduce, and build upon foundational AI research.

---

## 🗺️ Research Roadmap

- [x] **Phase 1: Mathematical Foundations & Pipeline Setup**
  - Literature review on score entropy discrete diffusion (SEDD).
  - Data ingestion, cleaning, and tokenization pipelines for reasoning and math datasets.
- [ ] **Phase 2: 220M SEDD Prototype Pre-Training**
  - Pre-training the 220M prototype on cloud GPU compute (JarvisLabs A100/H100).
  - Evaluating noise schedules across varying sampling steps (32, 64, 128, 256).
- [ ] **Phase 3: Empirical Benchmarking & Error-Correction Evaluation**
  - Benchmarking loss curves and self-correction accuracy against autoregressive baselines.
  - Publishing public benchmark reports and findings on [introlic.in/research](https://introlic.in/research).
- [ ] **Phase 4: Open-Source Release**
  - Releasing open-weights on HuggingFace and interactive demos on [introlic.in](https://introlic.in).

---

## 🔗 Links

- **Lab Website:** [https://introlic.in](https://introlic.in)
- **Research Papers & Notes:** [https://introlic.in/research](https://introlic.in/research)
- **Projects:** [https://introlic.in/projects](https://introlic.in/projects)

---

<div align="center">
  <sub>Introlic Research • Founded in India • Building for the World</sub>
</div>
