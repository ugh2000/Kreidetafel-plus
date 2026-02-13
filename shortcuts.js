/**
 * MODUL: shortcuts.js
 * Definiert Textkürzel (Shortcuts), die im Editor automatisch ersetzt werden.
 * Trigger ist Leertaste oder Enter.
 */
const ShortcutModul = {
    
    // Die Liste der Kürzel
    // key: Das zu tippende Wort
    // snippetTitle: Der exakte Titel aus der snippets.js (muss übereinstimmen!)
    // desc: Kurzbeschreibung für die Hilfe
    list: [
        { key: '##timer', snippetTitle: 'Timer (Interaktiv)', desc: 'Fügt einen 5-Minuten Timer ein' },
        { key: '##uhr', snippetTitle: 'Uhr (Standard)', desc: 'Fügt die aktuelle Uhrzeit ein' },
        { key: '##datum', snippetTitle: 'Datum (Text)', desc: 'Fügt das heutige Datum ein' },
        { key: '##skizze', snippetTitle: 'Skizze', desc: 'Platzhalter für eine Zeichnung' },
        
        { key: '##aufgabe', snippetTitle: 'Hausaufgabe', desc: 'Blaue Hausaufgaben-Box' },
        { key: '##ziel', snippetTitle: 'Lernziele', desc: 'Grüne Lernziel-Box' },
        { key: '##merke', snippetTitle: 'Merke', desc: 'Gelber Merke-Kasten' },
        { key: '##wichtig', snippetTitle: 'Wichtig', desc: 'Rote Warnbox' },
        
        { key: '##pro', snippetTitle: 'Pro-Kontra', desc: 'Tabelle für Argumente' },
        { key: '##check', snippetTitle: 'Checkliste', desc: 'Liste zum Abhaken' },
        
        { key: '##glocke', snippetTitle: 'Glocke (Sound)', desc: 'Button für Signalton' },
        { key: '##spoiler', snippetTitle: 'Spoiler (Verdeckt)', desc: 'Verdeckter Lösungstext' }
    ],

    /**
     * Sucht nach einem Eintrag für das gegebene Kürzel
     */
    getEntry: function(keyword) {
        return this.list.find(item => item.key === keyword);
    },

    /**
     * Gibt die gesamte Liste zurück (für die Hilfe)
     */
    getAll: function() {
        return this.list;
    }
};