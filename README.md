Kreidetafel+

Ein browserbasierter, modularer Tafel-Editor für den Schuleinsatz. Entwickelt für die Nutzung an digitalen Tafeln (Smartboards), Tablets und Desktop-Rechnern.

Das Projekt ist vollständig client-seitig (läuft im Browser ohne Server-Installation) und offline-fähig.

✨ Funktionen

Der Editor basiert auf TinyMCE und wurde um zahlreiche pädagogische Module erweitert:

📝 Editor: Formatierung, Listen, Tabellen und Schriftarten (angepasst an das Corporate Design).

🔢 Mathematik: Integrierte Vorschau für LaTeX ($$...$$) und AsciiMath (§§...§§) via MathJax.

🎨 Skizzen: Integriertes Zeichen-Tool mit Formen (Kreis, Rechteck), Text-Eingabe und Emoji-Stempel. Unterstützt High-DPI Displays.

👥 Gruppen-Generator: Schwebendes Fenster zum automatischen Einteilen von Schülergruppen inkl. Rollenverteilung (Zeitwächter, Präsentator etc.).

⏱️ Interaktion:

Timer & Stoppuhren (laufen live im Editor).

Lärmampel, Würfel und Punktezähler.

Spoiler-Tags zum Verdecken von Lösungen.

Glocke: Akustisches Signal für Phasenwechsel.

📢 Vorlesen: Text-to-Speech Funktion für Barrierefreiheit (Deutsch, Englisch, Französisch, Italienisch).

🛠️ Externe Tools: Einbettung von GeoGebra, ZUM-Pad oder Wikipedia in einem schwebenden Fenster.

📱 QR-Code: Generierung von QR-Codes, damit Schüler Aufgaben direkt auf ihr Gerät übernehmen können.

🚀 Installation & Nutzung

Online Nutzung

Das Projekt ist unter folgendem Link verfügbar:

https://github.com/ugh2000/Kreidetafel-plus

Lokale Nutzung (USB-Stick / Offline)

Lade das Repository als ZIP-Datei herunter (Code -> Download ZIP).

Entpacke den Ordner.

Öffne die Datei index.html in einem modernen Browser (Chrome, Firefox, Edge, Safari).

Hinweis: Zur lokalen Nutzung der Audio-Funktionen muss der Ordner sound vorhanden sein.

📂 Dateistruktur

index.html: Hauptdatei und Benutzeroberfläche.

logik.js: Zentrale Steuerung und Event-Management.

editorUI.js: Aufbau der Menüleisten und Buttons.

snippets.js: Datenbank der Textbausteine und Formeln.

math.js, voice.js, skizze.js: Spezialisierte Module.

gruppen.js: Logik für den Gruppengenerator.

iframe.js: Verwaltung der externen Tools.

tinymce/: Lokale Installation des Editors.

sound/: Enthält Audiodateien (z. B. für die Glocke).

asciimathml-master/: Lokale Skripte zur Darstellung mathematischer Formeln (AsciiMath).

🛠️ Entwicklung:

Konzept & Realisierung: UGH2000

Co-Coding & Support: Dieses Projekt entstand im kreativen Dialog mit Gemini. Die KI fungierte als geduldiger Co-Coder bei der Strukturierung, Fehlersuche und Umsetzung der didaktischen Ideen.

⚖️ Lizenzen & Credits

Dieses Projekt verwendet Open-Source-Komponenten:

TinyMCE: GNU LGPL 2.1

MathJax: Apache License 2.0

Tailwind CSS: MIT License

QRCode.js: MIT License

Sounds: CC0 (Public Domain) via Freesound/Pixabay.

Das Projekt selbst steht unter der MIT Lizenz – es darf frei verwendet, verändert und im Unterricht eingesetzt werden.

Erstellt für den digitalen Unterricht.
