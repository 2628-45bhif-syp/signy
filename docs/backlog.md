# Backlog 

## 1. Camera pipeline

**User Story**  
As a deaf user I want the app to capture my signing via camera at a smooth frame rate because laggy tracking would make real-time conversation impossible.

**Acceptance Criteria**

- [ ] Camera stream runs in the browser via WebRTC (640×480)
- [ ] MediaPipe tracks hands, pose and face
- [ ] Processing time per frame is below 33 ms (30 FPS)
- [ ] Unneeded landmarks are pruned (42 hand, 12 pose, 52 blendshape values)

**Effort Estimation:** 4 | **Priority:** 5

## 2. Real-time sign translation

**User Story**  
As a deaf user I want to see my signs translated into German text in real time because I want to communicate without typing.

**Acceptance Criteria**

- [ ] Recognized signs are shown as text within a short delay
- [ ] At least 30 core ÖGS signs are recognized reliably
- [ ] A recognized sign is added to a buffer in signing order

**Effort Estimation:** 5 | **Priority:** 5

## 3. Sentence end detection

**User Story**  
As a deaf user I want the app to detect when I have finished a thought because I don’t want to press a button after every sentence.

**Acceptance Criteria**

- [ ] A pause of about 0.8 s with resting hands triggers translation
- [ ] Short movement breaks within a sentence do not trigger it falsely
- [ ] The pause threshold is configurable

**Effort Estimation:** 3 | **Priority:** 4

## 4. Facial expression as grammar

**User Story**  
As a deaf user I want my facial expressions to change the meaning of the translation because in sign language the face carries questions and negation.

**Acceptance Criteria**

- [ ] Raised eyebrows produce a question (“Kommst du mit?”)
- [ ] Head shaking produces a negation (“Du kommst nicht mit.”)
- [ ] Neutral expression produces a statement
- [ ] Classification runs in parallel to hand tracking without exceeding the frame budget

**Effort Estimation:** 5 | **Priority:** 4

## 5. Correct German sentences

**User Story**  
As a hearing person I want to receive grammatically correct German sentences because raw sign glosses (without articles) are hard to understand.

**Acceptance Criteria**

- [ ] The language model builds a German sentence from glosses plus facial markers
- [ ] The model never adds words that were not signed (temperature ≤ 0.2, strict prompt)
- [ ] A test set of example gloss sequences produces correct sentences

**Effort Estimation:** 3 | **Priority:** 4

## 6. Speech output

**User Story**  
As a hearing person I want the translation to be spoken aloud because I may not be looking at the screen during the conversation.

**Acceptance Criteria**

- [ ] Translated sentences are played via text-to-speech
- [ ] Audio output can be muted
- [ ] Text and audio appear at the same time

**Effort Estimation:** 2 | **Priority:** 3

## 7. Two-way communication

**User Story**  
As a deaf user I want to see what the hearing person says as text because I need to understand their answers.

**Acceptance Criteria**

- [ ] Microphone input is converted to German text via speech recognition
- [ ] Text is displayed in a readable chat-style view
- [ ] The conversation history of both sides is visible

**Effort Estimation:** 3 | **Priority:** 4

## 8. Counter mode

**User Story**  
As a deaf user at a counter (doctor, office, checkout) I want to use the device in a stand so that both of my hands stay free for signing.

**Acceptance Criteria**

- [ ] UI is optimized for a fixed device (landscape/stand)
- [ ] Hands and face are fully visible in the camera frame, with on-screen framing guidance
- [ ] Works on a laptop and a smartphone browser (PWA)

**Effort Estimation:** 2 | **Priority:** 4

## 9. Partner mode

**User Story**  
As a hearing partner I want to hold the phone toward the deaf person like a camera because we are on the go and have no stand.

**Acceptance Criteria**

- [ ] Rear/front camera can be switched
- [ ] The display is readable for the hearing person while the camera faces the signer
- [ ] Tracking stays stable under slight hand-held movement

**Effort Estimation:** 3 | **Priority:** 2

## 10. Emergency vocabulary

**User Story**  
As a deaf patient I want vital signs like “Hilfe”, “Schmerz”, “Arzt” and “Allergie” to be recognized reliably because a misunderstanding in a medical situation can be dangerous.

**Acceptance Criteria**

- [ ] 30–50 core ÖGS signs are defined (medicine, emergency, orientation)
- [ ] Each sign has at least 10 recordings per team member
- [ ] Recognition accuracy per sign is measured and documented

**Effort Estimation:** 5 | **Priority:** 5

## 11. ÖGS dataset

**User Story**  
As a developer I want a recorded and augmented ÖGS dataset because there is hardly any ready-made Austrian sign language data.

**Acceptance Criteria**

- [ ] 5 team members × 50 signs × 10 repetitions = 2,500 clips recorded
- [ ] Augmentation (mirroring, zoom, tempo) yields over 10,000 samples
- [ ] Dataset structure and labels are documented

**Effort Estimation:** 4 | **Priority:** 4

## 12. Sign trainer

**User Story**  
As a hearing parent or teacher I want to practice signs and get feedback because I want to learn to communicate with deaf people.

**Acceptance Criteria**

- [ ] The user sees a target sign and tries it in front of the camera
- [ ] The app tells whether the sign was recognized correctly
- [ ] Progress is shown for practiced signs

**Effort Estimation:** 3 | **Priority:** 1
