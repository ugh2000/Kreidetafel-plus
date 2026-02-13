/**
 * MODUL: changelog.js
 * Verwaltet die Versionshistorie des Projekts.
 */
const ChangelogModul = {
    // Die Liste der Versionen (Neueste zuerst)
    history: [
                {
            version: 'v3.0',
            title: 'Korrektur- & Workflow-Update',
            date: 'Februar 2026',
            notes: [
                'Korrektur-Modul: Neue additive Logik (Feedback-Symbole werden hinter den markierten Text angefügt).',
                'Korrektur-Modul: Farbschema auf ein professionelles Hellrot (#fee2e2) für Hervorhebungen optimiert.',
                'UI-Optimierung: "Durchgestrichen" ist nun Bestandteil der Schnellleiste (Bubble-Toolbar).',
                'Interaktion: Registrierung neuer Feedback-Buttons (Smiley, Daumen hoch/runter).',
                'Stabilität: Initialisierungs-Sequenz optimiert, um Ladefehler (Hängenbleiben bei TinyMCE) zu verhindern.',
                'Willkommenstext: Integration technischer Hinweise zum Copy-Paste-Workflow für externe Sicherungen.'
            ]
        },
        {
            version: 'v2.9',
            title: 'Stabilitäts-Update',
            date: 'Februar 2026',
            notes: [
                'Performance: Bereinigte Skriptaufrufe und Entfernung redundanter Registrierungsschleifen.',
                'Struktur: Menü-Registrierung zentralisiert in editorUI.js zur Vermeidung von ID-Kollisionen.',
                'Fehlerbehandlung: Erweiterte Try-Catch-Blöcke für die Modul-Initialisierung.'
            ]
        },
        {
            version: 'v2.8',
            title: 'Datenschutz & Performance',
            date: 'Februar 2026',
            notes: [
                'DSGVO: Vollständige Entfernung externer Google-Fonts-Abfragen.',
                'UI: Umstellung auf einen performanten, datenschutzkonformen System-Font-Stack (Inter-Fallback).',
                'Code-Hygiene: Reduzierung der Abhängigkeiten zwischen Kern-Logik und Feature-Modulen.'
            ]
        },
        {
            version: 'v2.6',
            title: 'Modulare Architektur',
            date: 'Februar 2026',
            notes: [
                'Logbuch-Modul: Historie in eigene Datei shortcuts.js ausgelagert.',
                'Code-Hygiene: Reduzierung der Abhängigkeiten in der Hauptlogik.',
                'Verbesserte Fehlerbehandlung beim Laden externer Module.'
            ]
        },
        {
            version: 'v2.5',
            title: 'Shortcuts & GitHub Release',
            date: 'Januar 2026',
            notes: [
                'GitHub Release: Projekt ist nun offiziell Open Source verfügbar.',
                'Textkürzel (Shortcuts): Schnelles Einfügen von Snippets via ##befehl.',
                'Automatischer Timer-Start bei Aufgabenlinks verbessert.',
                'Interaktive Hilfe für Shortcuts hinzugefügt.'
            ]
        },
        {
            version: 'v2.4',
            title: 'Interaktive Werkzeuge',
            date: 'Dezember 2025',
            notes: [
                'Skizzen-Update: Einführung von Formen (Kreis, Rechteck, Linie) und Emoji-Stempeln.',
                'High-DPI Support: Schärfere Zeichnungen auf modernen Displays.',
                'Korrektur-Modul: Integration von Akkordeons (Klapptexten) zur Strukturierung.',
                'Verbesserter Export: Tafelbilder werden inkl. interaktiver Elemente gespeichert.'
            ]
        },
        {
            version: 'v2.0',
            title: 'Modularisierung',
            date: 'Oktober 2025',
            notes: [
                'Vollständiger Rewrite: Umstellung auf ein modulares System (JS-Module).',
                'Einführung der schwebenden Fenster für Gruppen und iFrames.',
                'Integration von Web Speech API für die Vorlesefunktion.'
            ]
        }
    ],

    /**
     * Gibt alle Einträge zurück
     */
    getAll: function() {
        return this.history;
    }
};