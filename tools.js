/**
 * KONFIGURATION: tools.js
 * Hier werden die allgemeinen Links für das iFrame-Fenster definiert.
 * Diese Tools sind für alle Nutzer der E-Tafel relevant.
 */
const ToolListeGeneral = {
    // --- Mathematik ---
    'geogebra': {
        name: 'GeoGebra Rechner',
        url: 'https://www.geogebra.org/calculator',
        desc: 'Grafikrechner & Geometrie'
    },
    
    // --- Kollaboration ---
    'zumpad_new': {
        name: 'ZUM-Pad (Neu)',
        url: 'https://zumpad.zum.de/',
        desc: 'Neues Pad erstellen'
    },

    // --- Externe Inhalte ---
    'serlo': {
        name: 'Serlo (Mathe/Bio)',
        url: 'https://de.serlo.org/',
        desc: 'Freie Lerninhalte'
    },
    'wikipedia': {
        name: 'Wikipedia',
        url: 'https://de.m.wikipedia.org/',
        desc: 'Mobile Ansicht (besser lesbar)'
    },

    // --- Spezialfunktionen ---
    'youtube': {
        name: '▶️ YouTube Video...',
        url: '', // Wird per Prompt abgefragt
        desc: 'Video datenschutzkonform abspielen'
    },
};