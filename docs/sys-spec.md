# Signy — Gebärdensprach-Übersetzer in Echtzeit
Version 0.1.0, Datum: 2026-10-13

## Inhaltsverzeichnis
- 1. Pflichtenheft
  - 1.1. Ausgangssituation
  - 1.2. Istzustand
  - 1.3. Problemstellung
  - 1.4. Aufgabenstellung
    - 1.4.1. Funktionale Anforderungen
    - 1.4.2. Nichtfunktionale Anforderungen (NFA)
  - 1.5. Ziele [Wirkung]
  - 1.6. Rahmenbedingungen
- 2. Entwurf ("Wie mache ich es")
  - 2.1. Systemarchitektur
  - 2.2. Datenmodell & Schnittstellendesign
- 3. Projekthandbuch ("Organisatorische Rahmenbedingungen")
  - 3.1. Zeitplan & GANTT-Diagramm
  - 3.2. Projektorganisation & Tools

---

## 1. Pflichtenheft

### 1.1. Ausgangssituation
* **Kontext:**
  * Gehörlose Menschen stoßen im täglichen Leben (Arztbesuche, Ämter, Handel, Schulen und öffentlicher Raum) auf erhebliche Barrieren bei der Verständigung mit Hörenden.
  * Die Österreichische Gebärdensprache (ÖGS) ist eine eigenständige, vollwertige Sprache und die Muttersprache gehörloser Menschen in Österreich. Sie besitzt eine eigene Grammatik und unterscheidet sich maßgeblich von der deutschen Schriftsprache sowie von anderen Gebärdensprachen wie ASL oder DGS.
  * Menschliche Dolmetscher sind kostenintensiv und für spontane, alltägliche Gesprächssituationen in der Regel nicht kurzfristig verfügbar.
* **Marktdaten / Fakten:**
  * In Österreich leben schätzungsweise 10.000 bis 15.000 gehörlose Menschen (Quelle: kinderhaende.at / ÖGS-Erhebungen).
  * Demgegenüber stehen nur rund 10.000 hörende Personen, die ÖGS beherrschen.
  * Kommunikationsgeschwindigkeit im Vergleich: Das Tippen in Smartphone-Notizen-Apps erreicht durchschnittlich ca. 35 Wörter pro Minute, während natürliche Laut- und Gebärdensprache eine Sprechgeschwindigkeit von 120 bis 150 Wörtern pro Minute erzielt.

### 1.2. Istzustand
* **Aktueller Prozess:**
  * Kommunikation erfolgt im Alltag meist improvisiert über Notizen-Apps auf dem Smartphone, handschriftliche Zettel oder das Lippenablesen (welches fehleranfällig ist und nur Bruchteile der Information transportiert).
  * Bestehende digitale Übersetzungswerkzeuge beschränken sich vorwiegend auf starre Einzelgebärden oder das Buchstabieren mit Fingeralphabet, ohne syntaktischen Zusammenhang oder Fließtextbildung.
* **Schwachstellen:**
  * Deutsch ist für viele gehörlose Personen eine Fremdsprache; das Formulieren und Tippen von deutschem Schriftsatz ist kognitiv anstrengend und langsam.
  * Mangel an Ausdruck und Emotion: Getippter Text transportiert keine Dringlichkeit, Ironie oder emotionale Tonalität.
  * Non-manuelle Marker (Kopfhaltung, Mimik, Augenbrauenstellung) werden in bestehenden Software-Lösungen ignoriert, wodurch grammatikalische Satzarten wie Fragen oder Verneinungen verloren gehen.
  * Es existiert keine barrierefreie Zwei-Wege-Kommunikation in Echtzeit.

### 1.3. Problemstellung
* **Kernproblem:**
  * Fehlen eines integrierten Gesamtsystems, das Gebärdensprache in Echtzeit über Standard-Hardware in grammatikalisch vollständige deutsche Sätze übersetzt und dabei die Mimik als grammatikalischen Bedeutungsträger auswertet.
  * Eine reine Handgestenerkennung ist unvollständig, da in Gebärdensprachen die Hände das Vokabular transportieren, aber das Gesicht die Grammatik und Tonalität bestimmt.
* **Lösungsansatz:**
  * **Multimodale Pipeline:** Simultaner Tracking-Ansatz für Hände (Vokabular) und Gesichts-Blendshapes (Grammatik: Aussage, Frage, Verneinung).
  * **Gesten-Aktivitätserkennung (GAD):** Automatische Satzsegmentierung bei Handruhe (~0,8 Sekunden Pause).
  * **Halluzinationsfreie Satzsynthese:** Kompaktes NLP-Sprachmodell wandelt Gloss-Sequenzen unter strengen Decoding-Grenzen (Temperatur <= 0.2) in korrekte deutsche Sätze um.
  * **Ergonomie:** Theken-Modus (stationär mit Halterung) und Partner-Modus (Kameraführung durch hörenden Partner), damit stets beide Hände zum Gebärden frei bleiben.
  * **Zwei-Wege-Kommunikation:** Text-to-Speech (TTS) für die Übersetzung von Gebärde zu Sprache; Speech-to-Text (STT) für die Transkription gesprochener Antworten in Text.

### 1.4. Aufgabenstellung

#### 1.4.1. Funktionale Anforderungen
* **FA-01 Video-Erfassung & Landmark-Tracking:** Kontinuierliche Kamera-Erfassung über WebRTC (640x480 @ 30 FPS) und GPU-beschleunigte Extraktion von Hand-, Posen- und Gesichts-Landmarks mit MediaPipe Tasks.
* **FA-02 Mimik- & Emotionsanalyse (Non-Manual Markers):** Extraktion von 52 Gesichts-Blendshape-Parametern und Kopfbewegungen zur Erkennung grammatikalischer Merkmale (Aussagesatz, Entscheidungsfrage, Verneinung, Betonung).
* **FA-03 Gesten-Aktivitätserkennung & Segmentierung (GAD):** Zeitliche Pufferung fließender Gebärden-Tokens und Erkennung des Satzabschlusses anhand einer Ruhepause (~0,8 s Schwellenwert).
* **FA-04 Satzsynthese mit Halluzinationsschutz:** Übersetzung der gepufferten Token-Sequenz in grammatikalisch korrekte deutsche Sätze mittels kompaktem Sprachmodell mit deterministischer Dekodierung (Temperatur <= 0.2).
* **FA-05 Bidirektionale Dialogschnittstelle:**
  * *Gehörlos -> Hörend:* Visuelle Textanzeige des erzeugten Satzes und automatisierte Sprachausgabe (TTS via Web Speech API).
  * *Hörend -> Gehörlos:* Aufnahme gesprochener Sprache über Mikrofon, automatische Spracherkennung (STT via Web Speech API) und Anzeige als Text auf dem Bildschirm.
* **FA-06 Ergonomie-Modi:** Umschaltbare Benutzeroberfläche für Theken-Modus (stationärer Schreibtisch-/Kiosk-Betrieb) und Partner-Modus (Mobilbetrieb).
* **FA-07 ÖGS-Kernvokabular:** Implementierung und Training eines Grundwortschatzes von 30 bis 50 lebenswichtigen Begriffen (Bereiche Notfall, Medizin, Orientierung und Höflichkeit).

#### 1.4.2. Nichtfunktionale Anforderungen (NFA)
* **Usability & Barrierefreiheit:** Barrierefreies UI (hohe Kontraste, klare Schriftgrößen, taktile bzw. visuelle Rückmeldungen); freihändige Interaktion für die gebärdende Person.
* **Performance & Echtzeitfähigkeit:** Stabile Bildwiederholrate von 30 FPS. Verarbeitungsbudget pro Einzelbild <= 33 ms (Zielzeit: ~26 ms: Bildannahme ~2 ms, Tracking ~13 ms, Datenfilterung ~1 ms, Inferenz ~4 ms, UI-Aktualisierung ~6 ms). Latenz der Satzsynthese nach Satzende < 500 ms.
* **Ressourceneffizienz (Daten-Diät / Pruning):** Gezielte Reduktion der Landmark-Punkte um ca. 87 % (42 Handpunkte, 12 Körperhaltungspunkte, 52 Gesichts-Blendshapes) zur Vermeidung von Geräteüberhitzung und Drosselung.
* **Verlässlichkeit & Fallback-Strategie:** Robuste Web-First Progressive Web App (PWA) zur Umgehung nativer App-Store- und Zertifikats-Hürden; klare "Kill-List" im Krisenfall (Reduktion auf 20–30 Kernbegriffe bzw. Anbindung leichtgewichtiger Cloud-Inferenz wie Gemini Flash).
* **Datenschutz & DSGVO:** Vollständige clientseitige Bildverarbeitung im Browser; keine dauerhafte Aufzeichnung oder Speicherung privater Videoaufnahmen ohne explizites Einverständnis.

### 1.5. Ziele [Wirkung]
* **Effizienzsteigerung:** Steigerung der Übertragungsgeschwindigkeit vom mühsamen Tippen (~35 Wörter/Min.) auf natürliches Sprechtempo (~120–150 Wörter/Min.).
* **Abbau von Barrieren:** Erleichterung von Behördengängen, Arztbesuchen und Einkäufen ohne vorherige Terminierung eines Dolmetschers.
* **Höhere Verständigungspräzision:** Zuverlässige Erkennung von Fragen und Negationen durch Mimik-Erfassung verhindert Missverständnisse.
* **Inklusive Teilhabe:** Vollwertige Zwei-Wege-Kommunikation statt Einweg-Assistenz.
* **Nachhaltigkeit & Transfer:** Bereitstellung einer erweiterbaren Basis für die Gebärdensprachforschung und Nutzung als interaktiver Gebärdentrainer.

### 1.6. Rahmenbedingungen
* **Schnittstellen & APIs:** WebRTC (MediaDevices API), MediaPipe Tasks Vision API, Web Speech API (`SpeechSynthesis`, `webkitSpeechRecognition`).
* **Technologische Vorgaben:** TypeScript/JavaScript, React (PWA), Python (Datensatz-Pipelines, Augmentation, Training), Git-Flow Branching-Modell.
* **Zeitliche Vorgaben:** 1,5 Jahre Projektlaufzeit (SYP4 Diplomarbeit an der HTL Leonding, September 2026 bis Frühjahr 2028).
* **Budgetäre & Organisatorische Vorgaben:** 5-Personen-Team; Erstellung eines eigenen ÖGS-Datensatzes durch strukturierte Videoaufnahmen im Team (5 Personen x 50 Begriffe x 10 Takes = 2.500 Rohvideos, per Augmentation erweitert auf > 10.000 Trainingsdaten).

---

## 2. Entwurf ("Wie mache ich es")

### 2.1. Systemarchitektur
* **Architekturmodell:** Client-zentrierte Progressive Web App (Edge-First Architektur) mit lokaler Inferenz im Webbrowser und optionalem Cloud-Fallback für NLP-Satzbau.
* **Komponentendiagramm:**

```
+-----------------------------------------------------------------------------------+
|                                  SIGNY SYSTEM                                     |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Kamera (WebRTC, 30 FPS) ]                                                      |
|             |                                                                     |
|             v                                                                     |
|  [ MediaPipe Tasks GPU ] ------------------------------------+                    |
|             | (Pruning: 87% Reduktion)                       |                    |
|             v                                                v                    |
|  [ Hand Landmark Stream (42 Pkt) ]              [ Facial Blendshapes (52 Werte) ] |
|             |                                                |                    |
|             +-----------------------+------------------------+                    |
|                                     |                                             |
|                                     v                                             |
|                   [ Gesture Activity Detection (GAD) ]                            |
|                        (Pause ~0.8s = Satzende)                                   |
|                                     |                                             |
|                                     v                                             |
|                   [ Sentence Synthesis Engine (NLP) ]                             |
|                        (Grammatik & Satzordnung)                                  |
|                                     |                                             |
|                                     v                                             |
|                   [ React UI & Web Speech TTS Ausgabe ]                           |
|                                                                                   |
|  [ Mikrofon (Hörender) ] ---> [ Web Speech STT ] ---> [ Textanzeige für Gehörlose]|
+-----------------------------------------------------------------------------------+
```

* **Technologie-Stack:**
  * **Frontend:** React, TypeScript, Vite, Tailwind CSS / modern CSS (PWA)
  * **Computer Vision / ML-Inferenz:** MediaPipe Tasks Vision, WebRTC, Transformer Sequence Model, Blendshape-MLP
  * **Sprachverarbeitung & Audio:** Web Speech API (SpeechRecognition, SpeechSynthesis)
  * **Data-Pipeline & Training (Offline):** Python, PyTorch / TensorFlow, OpenCV
  * **Backend / Services (Optional/Fallback):** Node.js / FastAPI, Cloud AI API (z. B. Gemini Flash)

### 2.2. Datenmodell & Schnittstellendesign
* **Datenstrukturen (In-Memory / State-Management):**
  * `LandmarkFrame`: `{ timestamp: number, handPoints: float[42][3], posePoints: float[12][3], blendshapes: float[52] }`
  * `SignToken`: `{ glossId: string, confidence: number, startTimestamp: number, endTimestamp: number }`
  * `GrammarContext`: `{ sentenceType: 'statement' | 'question' | 'negation', sentiment: string, confidence: number }`
  * `SentenceResult`: `{ rawTokens: string[], grammar: GrammarContext, germanText: string, ttsStatus: string }`
  * `HearingSpeechInput`: `{ transcript: string, isFinal: boolean, timestamp: number }`
* **Schnittstellendesign:**
  * Kamera-Stream: `navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, frameRate: 30 } })`
  * Text-to-Speech: `window.speechSynthesis.speak(new SpeechSynthesisUtterance(germanText))`
  * Speech-to-Text: `webkitSpeechRecognition` Event-Listener (`onresult`, `onerror`, `onend`)
  * Interne Event-Trigger: `onGestureBufferUpdate`, `onSentencePauseDetected`, `onSentenceSynthesized`

---

## 3. Projekthandbuch ("Organisatorische Rahmenbedingungen")

### 3.1. Zeitplan & GANTT-Diagramm
* **Meilenstein 1 (M1, Monat 1–6):** Kamera & Landmark-Tracking im Browser stabil bei 30 FPS lauffähig (Landmark-Pruning integriert).
* **Meilenstein 2 (M2, Monat 6–10):** Gesichtserkennung und Mimik-Klassifikation implementiert (Klassifikation von Aussage vs. Frage vs. Verneinung).
* **Meilenstein 3 (M3, Monat 10–12):** Stabile Erkennung der ersten 30 Test-Gebärden (ASL/DGS) und Integration der GAD-Pausenerkennung (~0,8 s).
* **Meilenstein 4 (M4, Monat 12–14):** Eigene ÖGS-Videoaufnahmen (50 Begriffe, 2.500 Rohclips, Augmentation auf > 10.000 Samples) und Satzgenerator fertiggestellt.
* **Meilenstein 5 (M5, Monat 15–18):** System- und Feldtests, Feedback von Gehörlosenorganisationen, Fehlerbehebung und Präsentationsvorbereitung.
* **Sprint-Planung & User Stories:** GitHub Projects Board ("To Do", "In Progress", "Done", "Reviewed") mit standardisierten User-Story-Templates (Rolle, Ziel, Akzeptanzkriterien, Effort 1–5, Priority 1–5).

### 3.2. Projektorganisation & Tools
* **Projektteam & Rollenaufteilung (5 Personen, SYP4 / HTL Leonding):**
  * *Person 1 & Person 2 (Vision & Data (ÖGS)):* MediaPipe Kamera-Pipeline, Daten-Diät (Pruning), Performance-Optimierung, ÖGS-Videoaufnahmen und Daten-Augmentation.
  * *Person 3 & Person 4 (KI & Gesten / NLP & Mimik):* Neuronales Netz für Handbewegungen, GAD Pause-Erkennung, Gesichtsmuskel-Auswertung, Satzbau-Modell, Spracheingabe für Hörende.
  * *Person 5 (Frontend & App):* React PWA Benutzeroberfläche, UI/UX, Audio-Ausgabe (TTS), Gesamtintegration und Testing.
* **Tooling:**
  * **Projektmanagement:** GitHub Projects & GitHub Issues
  * **Versionsverwaltung:** GitHub (Git-Flow: `main`, `dev`, Feature-Branches)
  * **Dokumentation:** Markdown (`docs/`, OpenSpec)
  * **Präsentation:** Reveal.js (`pitch/pitch.html`)

---
*Zuletzt aktualisiert: 2026-10-13 08:40:00 UTC*
