# Pflichtenheft (System Specification)

> [!NOTE]
> Die vollständige, maßgebliche und strukturierte System-Spezifikation (Pflichtenheft, Entwurf und Projekthandbuch) befindet sich in [sysspec.md](sysspec.md).

## Übersicht & Kernpunkte

* **Projekt:** Signy — Echtzeit-Gebärdensprach-Übersetzer für Österreichische Gebärdensprache (ÖGS).
* **Ausgangssituation:** Rund 10.000 bis 15.000 gehörlose Menschen in Österreich stehen nur ca. 10.000 Hörenden gegenüber, die ÖGS beherrschen ([Daten lt. kinderhände](https://kinderhaende.at/faqs-glossar/)).
* **Problemstellung:** Bestehende Systeme übersetzen meist nur statische Einzelwörter ohne Grammatik und Syntax. In Gebärdensprache tragen die Hände das Vokabular, aber das Gesicht bestimmt die Grammatik (Fragen, Verneinungen, Emotion).
* **Lösung:** Multimodale Erfassung (MediaPipe Tracking mit Landmark-Pruning + Gesichts-Blendshapes), Gestenaktivitätserkennung (GAD mit ~0.8s Pause) und halluzinationsfreie Satzsynthese in ganze deutsche Sätze bei Zwei-Wege-Kommunikation.

Für alle Detailanforderungen (Funktionale & Nichtfunktionale Anforderungen, Systemarchitektur, Datenmodelle, Zeitplan M1–M5 und Rollenverteilung), siehe [docs/sysspec.md](sysspec.md).
