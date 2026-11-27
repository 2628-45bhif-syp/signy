# Backlog

Our product backlog is structured in a 3-tier hierarchy (**Epic → User Story → Task**) using GitHub's native Sub-issues feature:

- **Epic (`[EPIC]`, `epic` label):** High-level capability domain grouping related User Stories.
- **User Story (`[USER STORY]`, `user-story` label):** Deliverable vertical slice of user or developer value with Acceptance Criteria, Effort Estimation (`1`–`5`), and Priority (`1`–`5`).
- **Task (`[TASK]`, `task` label):** Concrete technical implementation item mapped to a branch prefix (`<type>/<issue-number>-<short-description>`) with a technical Definition of Done.

---

## Completed Foundation: Multimodal Camera & Landmark Pipeline (Closed)

*Historical Sprint 1 & foundation issues completed prior to the 3-tier Epic templates.*

### [USER STORY] #1 Camera pipeline *(Closed)*
**User Story**  
As a deaf user I want the app to capture my signing via camera at a smooth frame rate because laggy tracking would make real-time conversation impossible.

**Acceptance Criteria**
- [x] Camera stream runs in the browser via WebRTC (640×480)
- [x] MediaPipe tracks hands, pose and face
- [x] Processing time per frame is below 33 ms (30 FPS)
- [x] Unneeded landmarks are pruned (42 hand, 12 pose, 52 blendshape values)

**Effort Estimation:** 4 - High | **Priority:** 5 - Critical

**Tasks**
- [x] **#13** Camera stream runs in the browser via WebRTC (640×480) *(Closed)*
- [x] **#14** Unneeded landmarks are pruned (42 hand, 12 pose, 52 blendshape values) *(Closed)*
- [x] **#15** MediaPipe tracks hands, pose and face *(Closed)*
- [x] **#16** Processing time tests *(Closed)*
- [x] **#20** Design the web app *(Closed)*

### [USER STORY] #24 Hand tracking *(Closed)*
**User Story**  
As a developer of the sign language app I want the primary points of both hands from MediaPipe tracking to be displayed as live coordinates below the camera because I want to visually verify that hand tracking works accurately and follows my movements.

**Acceptance Criteria**
- [x] Live `x` and `y` wrist coordinates for left and right hand are displayed and updated below the live camera view
- [x] Readout is clearly labeled for left hand and right hand
- [x] Upward hand movement increases `y`, downward movement decreases `y` (`1 - rawY`)
- [x] Displays `"Not detected"` when a hand is not visible
- [x] Tracking runs entirely in the browser without external server requests

**Effort Estimation:** 2 - Low | **Priority:** 3 - Medium

### [USER STORY] #25 Head tracking *(Closed)*
**User Story**  
As a developer of the sign language app I want the primary head point from MediaPipe tracking to be displayed as live coordinates below the camera because I want to visually verify that face tracking works accurately and follows my head movements.

**Acceptance Criteria**
- [x] Live `x` and `y` coordinates of the primary head point (nose tip) are displayed and updated below the live camera view
- [x] Readout is clearly labeled as `Head`
- [x] Upward head movement increases `y`, downward movement decreases `y` (`1 - rawY`)
- [x] Displays `"Not detected"` when no face is visible
- [x] Tracking runs entirely in the browser without external server requests

**Effort Estimation:** 2 - Low | **Priority:** 3 - Medium

---

## 1. [EPIC] #27 Facial Expression & Non-Manual Grammar

**Epic Goal**  
Analyze non-manual facial expressions, emotions, and head movements from MediaPipe blendshapes and face landmarks in real time to display live visual feedback below the camera and supply grammatical modifiers (questions, negations, statements) to German sentence synthesis.

**Acceptance Criteria / Outcome**
- [ ] Signer's facial expressions, emotions, and head movements are classified in real time within the `< 33 ms` frame budget
- [ ] Detected facial expression / emotional state is displayed in a live readout panel below the camera view
- [ ] Grammatical non-manual markers (raised eyebrows = question, head shake = negation, neutral = statement) modify translated sentences

### 1.1 [USER STORY] #26 Facial expression and emotion panel
**User Story**  
As a user I want the app to analyze facial expressions and emotions from the camera feed and display them in a live panel below the camera because I want immediate visual feedback on the detected emotional and non-manual state of the person signing.

**Acceptance Criteria**
- [ ] At least 3 core facial/emotional states (e.g., question / raised eyebrows, negation / head shake, neutral / statement) are interpreted from MediaPipe face blendshapes and landmarks
- [ ] A readout panel below the live camera view displays the currently detected facial expression / emotion in real time
- [ ] Displays `"Not detected"` when no face is visible in the camera frame

**Effort Estimation:** 3 - Medium | **Priority:** 4 - High

**Tasks**
- [ ] **#32** `[TASK] Classify 3 core facial states from MediaPipe blendshapes` (`feat/32-...`)
- [ ] **#33** `[TASK] Add live facial expression and emotion panel below camera` (`feat/33-...`)

### 1.2 [USER STORY] #4 Facial expression as grammar
**User Story**  
As a deaf user I want my facial expressions to change the meaning of the translation because in sign language the face carries questions and negation.

**Acceptance Criteria**
- [ ] Raised eyebrows tag the active sentence grammar context as a question (“Kommst du mit?”)
- [ ] Head shaking tags the active sentence grammar context as a negation (“Du kommst nicht mit.”)
- [ ] Neutral expression tags the active sentence grammar context as a statement
- [ ] Grammatical marker extraction runs in parallel to hand tracking without exceeding the 33 ms frame budget

**Effort Estimation:** 3 - Medium | **Priority:** 4 - High

**Tasks**
- [ ] **#34** `[TASK] Emit GrammarContext modifiers from facial expressions within 33 ms budget` (`feat/34-...`)
- [ ] **#35** `[TASK] Integrate facial GrammarContext markers with sentence translation buffer` (`feat/35-...`)

---

## 2. [EPIC] #28 ÖGS Dataset & Sign Recognition Pipeline

**Epic Goal**  
Record and augment an Austrian Sign Language (ÖGS) video dataset, train a sequence classifier for 30–50 core and emergency signs, buffer recognized sign tokens in real time, and segment completed thoughts automatically via gesture activity detection (GAD).

**Acceptance Criteria / Outcome**
- [ ] Recorded and augmented ÖGS dataset (`> 10,000` samples across 50 signs) is structured and documented
- [ ] 30–50 core and emergency ÖGS signs are recognized reliably with documented per-sign accuracy
- [ ] Recognized sign glosses are buffered in signing order and shown as live text in the UI
- [ ] Gesture Activity Detection (GAD) triggers sentence completion after a configurable `~0.8 s` resting pause

### 2.1 [USER STORY] #11 ÖGS dataset
**User Story**  
As a developer I want a recorded and augmented ÖGS dataset because there is hardly any ready-made Austrian sign language data.

**Acceptance Criteria**
- [ ] 5 team members × 50 signs × 10 repetitions = 2,500 clips recorded
- [ ] Augmentation (mirroring, zoom, tempo) yields over 10,000 samples
- [ ] Dataset structure and labels are documented

**Effort Estimation:** 4 - High | **Priority:** 4 - High

### 2.2 [USER STORY] #10 Core and emergency vocabulary recognition
**User Story**  
As a deaf patient I want vital signs like “Hilfe”, “Schmerz”, “Arzt” and “Allergie” to be recognized reliably because a misunderstanding in a medical situation can be dangerous.

**Acceptance Criteria**
- [ ] 30–50 core ÖGS signs are defined and trained (medicine, emergency, orientation, everyday basics)
- [ ] At least 30 core ÖGS signs are recognized reliably from live and recorded landmark sequences
- [ ] Recognition accuracy per sign is measured and documented

**Effort Estimation:** 5 - Fucking Huge | **Priority:** 5 - Critical

**Tasks**
- [ ] **#23** `[TASK] Train and evaluate recognition model on 30-50 core ÖGS signs` (`feat/23-...`)

### 2.3 [USER STORY] #2 Real-time sign translation
**User Story**  
As a deaf user I want to see my signs translated into German text in real time because I want to communicate without typing.

**Acceptance Criteria**
- [ ] A recognized sign is added to a temporal sign buffer in signing order
- [ ] Recognized sign glosses are displayed as live text in the UI within a short delay
- [ ] Integrates with the 30–50 core ÖGS sign recognition model (#10) and sentence end detection (#3)

**Effort Estimation:** 3 - Medium | **Priority:** 5 - Critical

**Tasks**
- [ ] **#22** `[TASK] Buffer recognized sign tokens in signing order` (`feat/22-...`)
- [ ] **#21** `[TASK] Display recognized sign glosses as live text` (`feat/21-...`)

### 2.4 [USER STORY] #3 Sentence end detection
**User Story**  
As a deaf user I want the app to detect when I have finished a thought because I don’t want to press a button after every sentence.

**Acceptance Criteria**
- [ ] A pause of about 0.8 s with resting hands triggers translation
- [ ] Short movement breaks within a sentence do not trigger it falsely
- [ ] The pause threshold is configurable

**Effort Estimation:** 3 - Medium | **Priority:** 4 - High

---

## 3. [EPIC] #29 German Sentence Synthesis & Two-Way Communication

**Epic Goal**  
Enable full bidirectional conversations between deaf signers and hearing partners by synthesizing buffered sign glosses and facial grammar markers into hallucination-free German sentences, speaking translations aloud via Text-to-Speech (TTS), and transcribing spoken partner responses via Speech-to-Text (STT).

**Acceptance Criteria / Outcome**
- [ ] Constrained language model (`temperature <= 0.2`) synthesizes grammatically correct German sentences from sign glosses and facial markers without hallucinating un-signed words
- [ ] Translated sentences are spoken aloud via Web Speech TTS with a mute toggle
- [ ] Hearing partner speech is transcribed via Web Speech STT and shown in a two-way conversation view

### 3.1 [USER STORY] #5 Correct German sentences
**User Story**  
As a hearing person I want to receive grammatically correct German sentences because raw sign glosses (without articles) are hard to understand.

**Acceptance Criteria**
- [ ] The language model builds a German sentence from glosses plus facial markers
- [ ] The model never adds words that were not signed (temperature ≤ 0.2, strict prompt)
- [ ] A test set of example gloss sequences produces correct sentences

**Effort Estimation:** 3 - Medium | **Priority:** 4 - High

### 3.2 [USER STORY] #6 Speech output
**User Story**  
As a hearing person I want the translation to be spoken aloud because I may not be looking at the screen during the conversation.

**Acceptance Criteria**
- [ ] Translated sentences are played via text-to-speech
- [ ] Audio output can be muted
- [ ] Text and audio appear at the same time

**Effort Estimation:** 2 - Low | **Priority:** 3 - Medium

### 3.3 [USER STORY] #7 Two-way communication
**User Story**  
As a deaf user I want to see what the hearing person says as text because I need to understand their answers.

**Acceptance Criteria**
- [ ] Microphone input is converted to German text via speech recognition
- [ ] Text is displayed in a readable chat-style view
- [ ] The conversation history of both sides is visible

**Effort Estimation:** 3 - Medium | **Priority:** 4 - High

---

## 4. [EPIC] #30 Ergonomic Modes & Form Factors

**Epic Goal**  
Support hands-free signing across stationary desk/counter stands and mobile handheld partner scenarios through dedicated responsive PWA layouts, framing guidance, and camera switching.

**Acceptance Criteria / Outcome**
- [ ] Counter mode provides a landscape stand-optimized PWA layout with on-screen hand and face framing guidance
- [ ] Partner mode supports front/rear camera switching and readable display orientation while held by a conversation partner

### 4.1 [USER STORY] #8 Counter mode
**User Story**  
As a deaf user at a counter (doctor, office, checkout) I want to use the device in a stand so that both of my hands stay free for signing.

**Acceptance Criteria**
- [ ] UI is optimized for a fixed device (landscape/stand)
- [ ] Hands and face are fully visible in the camera frame, with on-screen framing guidance
- [ ] Works on a laptop and a smartphone browser (PWA)

**Effort Estimation:** 2 - Low | **Priority:** 4 - High

### 4.2 [USER STORY] #9 Partner mode
**User Story**  
As a hearing partner I want to hold the phone toward the deaf person like a camera because we are on the go and have no stand.

**Acceptance Criteria**
- [ ] Rear/front camera can be switched
- [ ] The display is readable for the hearing person while the camera faces the signer
- [ ] Tracking stays stable under slight hand-held movement

**Effort Estimation:** 3 - Medium | **Priority:** 2 - Low

---

## 5. [EPIC] #31 ÖGS Learning & Reference Tools

**Epic Goal**  
Provide hearing users, parents, and teachers with an integrated basic ÖGS sign video library and an interactive camera-based sign trainer to look up and practice Austrian Sign Language signs.

**Acceptance Criteria / Outcome**
- [ ] Basic ÖGS sign library loads a curated JSON manifest of sign videos, German translations, and attributions in the web app
- [ ] Interactive sign trainer prompts users with a target sign, evaluates their camera performance, and tracks learning progress

### 5.1 [USER STORY] #17 Basic ÖGS sign library *(replaces closed #19)*
**User Story**  
As a hearing user I want a browsable list of basic ÖGS signs with videos and German translations because I want to look up and learn essential signs to communicate with deaf people.

**Acceptance Criteria**
- [ ] Dynamically loaded JSON manifest containing video/poster URLs, categories, and attributions for basic ÖGS signs
- [ ] Browsable library view integrated in the web app showing each sign's German word and playable video
- [ ] Proper CC BY-SA 4.0 creator and source attribution displayed for each sign

**Effort Estimation:** 2 - Low | **Priority:** 3 - Medium

### 5.2 [USER STORY] #12 Sign trainer
**User Story**  
As a hearing parent or teacher I want to practice signs and get feedback because I want to learn to communicate with deaf people.

**Acceptance Criteria**
- [ ] The user sees a target sign and tries it in front of the camera
- [ ] The app tells whether the sign was recognized correctly
- [ ] Progress is shown for practiced signs

**Effort Estimation:** 3 - Medium | **Priority:** 1 - Very Low
