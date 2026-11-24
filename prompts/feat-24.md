/opsx:explore

# Issue #24 - Hand Tracking

## Overview

We made an user story (issue #24) that explains how this feature should work. For this session the goal is to implement the tracking of the hands and display the coordinates in the webapp.

## Your Task

First, explain to me how you will achieve that and what preexisting features you will use, how you'll make sure that if other body parts will be tracked, your implementation won't break that and what technologies you'll use. 


Here is the user story and acceptance criteria (both in german):

User Story

Als Entwickler der Gebärdensprach-App möchte ich, dass die Hauptpunkte beider Hände aus dem MediaPipe-Tracking als Live-Koordinaten unterhalb der Kamera angezeigt werden, weil ich visuell prüfen will, dass das Handtracking korrekt funktioniert und meinen Bewegungen folgt.
Acceptance Criteria

    Unterhalb des Live-Kamerabilds werden die x- und y-Koordinaten je eines Hauptpunkts der linken und der rechten Hand (z. B. Handgelenk) in Echtzeit angezeigt und laufend aktualisiert
    Die Anzeige ist klar nach linke Hand und rechte Hand beschriftet
    Wird eine Hand nach oben bewegt, steigt ihr y-Wert. Wird sie nach unten bewegt, sinkt er. (y wird als "oben = höher" dargestellt, da die rohe MediaPipe-y-Achse invertiert ist)
    Ist eine Hand nicht sichtbar, zeigt die Anzeige für diese Hand "Nicht erkannt" statt veralteter oder ungültiger Werte
    Das Tracking läuft im Browser, ohne Videoframes an einen externen Server zu senden
