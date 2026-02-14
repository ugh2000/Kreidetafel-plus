/**
 * MODUL: changelog.js
 * Verwaltet die Versionshistorie des Projekts Kreidetafel+.
 */
const ChangelogModul = {
    // Die Liste der Versionen (Neueste zuerst)
    history: [
        {
            version: 'v3.1',
            title: 'Individualisierungs-Update',
            date: 'Februar 2026',
            notes: [
                'Architektur: Trennung der Werkzeuglisten in tools.js (global) und setup-individual/tools-individual.js (lokal).',
                'UI-Design: Visuelle Abhebung lokaler Links durch smaragdgrüne Färbung und "(lokal)"-Markierung.',
                'Medien: Neue eigenständige analoge Schuluhr (uhr-analog.html) zur Einbettung via iFrame.',
                'Dokumentation: Interaktiver Setup-Guide für Lehrkräfte im Unterordner iframe-tools erstellt.',
                'UX: Direkte Verlinkung der technischen Dokumentation aus dem Hilfe-Fenster heraus.'
            ]
        },
        {
            version: 'v3.0',
            title: 'Korrektur- & Workflow-Update',
            date: 'Februar 2026',
            notes: [
                'Korrektur-Modul: Neue additive Logik (Feedback-Symbole werden hinter den markierten Text angefügt).',
                'Korrektur-Modul: Farbschema auf ein professionelles Hellrot (#fee2e2) für Hervorhebungen optimiert.',
                'UI-Optimierung: "Durchgestrichen" nun Bestandteil der Schnellleiste (Bubble-Toolbar).',
                'Interaktion: Registrierung neuer Feedback-Buttons (Smiley, Daumen hoch/runter).',
                'Stabilität: Initialisierungs-Sequenz optimiert (Lade-Hänger in TinyMCE behoben).',
                'Zentraler Hinweis: Dokumentation der Copy-Paste-Notwendigkeit für externe Textverarbeitungen.'
            ]
        },
        {
            version: 'v2.9',
            title: 'Stabilitäts-Update',
            date: 'Februar 2026',
            notes: [
                'Performance: Bereinigte Skriptaufrufe und Entfernung redundanter Registrierungsschleifen.',
                'Struktur: Menü-Registrierung zentralisiert in editorUI.js zur Vermeidung von ID-Kollisionen.'
            ]
        },
        {
            version: 'v2.8',
            title: 'Datenschutz & Performance',
            date: 'Februar 2026',
            notes: [
                'DSGVO: Vollständige Entfernung externer Google-Fonts-Abfragen.',
                'UI: Umstellung auf einen performanten System-Font-Stack (Inter-Fallback).'
            ]
        },
        {
            version: 'v2.6',
            title: 'Modulare Architektur',
            date: 'Februar 2026',
            notes: [
                'Logbuch-Modul: Historie in eigene Datei changelog.js ausgelagert.',
                'Code-Hygiene: Reduzierung der Abhängigkeiten in der Hauptlogik.'
            ]
        },
        {
            version: 'v2.5',
            title: 'Shortcuts & GitHub Release',
            date: 'Januar 2026',
            notes: [
                'GitHub Release: Projekt ist nun offiziell Open Source verfügbar.',
                'Textkürzel (Shortcuts): Schnelles Einfügen von Snippets via ##befehl.'
            ]
        },
        {
            version: 'v2.4',
            title: 'Interaktive Werkzeuge',
            date: 'Dezember 2025',
            notes: [
                'Skizzen-Update: Einführung von Formen (Kreis, Rechteck, Linie) und Emoji-Stempeln.',
                'High-DPI Support: Schärfere Zeichnungen auf modernen Displays.'
            ]
        },
        {
            version: 'v2.0',
            title: 'Modularisierung',
            date: 'Oktober 2025',
            notes: [
                'Vollständiger Rewrite: Umstellung auf ein modulares System (JS-Module).',
                'Einführung der schwebenden Fenster für Gruppen und iFrames.'
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