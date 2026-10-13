# Design: System Specification and Sign Translation Architecture

## Context

See `proposal.md` for motivation. The project is an Austrian Sign Language (ÖGS) real-time bidirectional translation system developed as an 18-month diploma project (SYP4, HTL Leonding) by a 5-person team. The repository recently added `docs/sysspec.md` as the formal German Pflichtenheft template. This design establishes how `docs/sysspec.md` is populated and how the underlying technical architecture is structured.

## Goals / Non-Goals

**Goals:**
- Populate `docs/sysspec.md` with complete, verified specifications reflecting the project proposal, presentation pitch, and architectural designs without making unsupported assumptions.
- Specify the complete multimodal pipeline: WebRTC video ingestion, MediaPipe GPU tracking, keypoint pruning, gesture activity detection (GAD), non-manual marker (NMM) facial blendshape classification, and constrained sentence synthesis.
- Define in-memory data structures, frame budgets (<= 33 ms for 30 FPS), and two-way interaction protocols.
- Document project milestones (M1–M5), team role distribution, and GitHub Scrum workflow.

**Non-Goals:**
- Implementing production machine learning or React frontend code in this change.
- Deciding unconfirmed personal member names or binding external calendar submission deadlines prematurely.

## Decisions

### 1. Edge-First PWA Architecture with WebRTC and MediaPipe Tasks
- **Decision:** Target a Progressive Web App (React / TypeScript) executing MediaPipe Tasks and neural models directly on the client via WebGL/WebGPU.
- **Rationale:** Ensures cross-platform compatibility (desktop/laptops and mobile browsers) without app store review delays or server bandwidth costs for continuous video streams.
- **Alternatives Considered:** Native iOS/Android app (too high initial platform divergence risk; kept as stretch goal after PWA is proven).

### 2. 87% Keypoint Pruning for Real-Time Frame Budgets
- **Decision:** Filter MediaPipe output down to 42 hand points (21 per hand), 12 upper-body pose points, and 52 facial blendshape parameters (~214 values instead of 1,629).
- **Rationale:** Processing all 543 raw landmarks causes thermal throttling on consumer devices. Pruning achieves the required ~26 ms per frame budget (well within the 33 ms threshold for 30 FPS).
- **Alternatives Considered:** Processing full facial and bodily meshes (discarded due to latency and heat).

### 3. Gesture Activity Detection (GAD) via Pause Threshold (~0.8s)
- **Decision:** Segment sentences automatically when hands remain at rest for approximately 0.8 seconds.
- **Rationale:** Sign language requires both hands. Physical buttons or push-to-talk interactions are ergonomically impossible while signing.
- **Alternatives Considered:** Manual hotkey or foot pedal (incompatible with mobile and public counter scenarios).

### 4. Non-Manual Marker Facial Grammar Integration
- **Decision:** Feed 52 facial blendshape coefficients into a classification MLP to determine sentence modality (`STATEMENT`, `QUESTION`, `NEGATION`, `EMPHASIS`).
- **Rationale:** In sign language, identical hand signs produce completely different meanings based on facial expression (e.g. raised eyebrows convert a statement into a question; head shaking negates the predicate without a separate "not" sign).
- **Alternatives Considered:** Pure hand gesture recognition (fundamentally inadequate for sign language syntax).

### 5. Constrained Decoding for Sentence Synthesis
- **Decision:** Use a compact NLP sentence generator with temperature <= 0.2 and constrained vocab mapping.
- **Rationale:** Prevents LLM hallucinations, which are critical safety risks in medical and emergency contexts.
- **Alternatives Considered:** High-temperature open-ended generative prompting (unacceptable hallucination rate).

## Risks / Trade-offs

- **[Risk] Scarcity of Austrian Sign Language (ÖGS) datasets** → *Mitigation:* Two-stage approach. Stage 1 validates pipeline on large public ASL/DGS datasets. Stage 2 records a focused vocabulary of 30–50 core survival terms (5 members x 50 words x 10 takes = 2,500 clips), expanded via augmentation to > 10,000 samples.
- **[Risk] Browser hardware acceleration inconsistencies** → *Mitigation:* Web-First PWA with strict fallback "Kill-List" (reducing vocab to 20–30 core words or offloading sentence synthesis to lightweight cloud AI like Gemini Flash).
