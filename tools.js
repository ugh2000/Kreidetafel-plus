/**
 * KONFIGURATION: tools.js
 * Hier werden die Links für das iFrame-Fenster definiert.
 * Schlüsselwörter wie 'youtube' oder 'custom' lösen Spezialfunktionen aus.
 */
const ToolListe = {
    // --- Mathematik ---
    'geogebra': {
        name: 'GeoGebra Rechner',
        url: 'https://www.geogebra.org/calculator',
        desc: 'Grafikrechner & Geometrie'
    },
    
    // --- Kollaboration ---
    'zumpad_wbk': {
        name: 'ZUM-Pad (wbk-koeln)',
        url: 'https://zumpad.zum.de/p/wbk-koeln.de?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false',
        desc: 'Gemeinsames Schul-Pad'
    },
    'zumpad_new': {
        name: 'ZUM-Pad (Neu)',
        url: 'https://zumpad.zum.de/',
        desc: 'Neues Pad erstellen'
    },

    // --- AG Köln Tools ---
    'ag_cloud': {
        name: 'WBK Cloud',
        url: 'https://agkoeln.de/wbkcloud/',
        desc: 'Dateispeicher'
    },
    'ag_uhr': {
        name: 'Schuluhr (AG)',
        url: 'https://agkoeln.de/uhr',
        desc: 'Große Uhranzeige'
    },
    'ag_timer': {
        name: 'Timer (AG)',
        url: 'https://agkoeln.de/timer/',
        desc: 'Countdown'
    },
    'ag_foto': {
        name: 'Foto-Optimierer',
        url: 'https://agkoeln.de/Fotooptimierer.html',
        desc: 'Bilder verkleinern'
    },
    'ag_qr': {
        name: 'QR-Code Generator',
        url: 'https://agkoeln.de/qr',
        desc: 'Interne QR-Tools'
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
    
    // --- Test / Problematisch ---
    /* Logineo und OneNote blockieren iFrames meistens. 
       Du kannst sie hier aktivieren, aber vermutlich bleiben sie weiß. */
    // 'logineo': { name: 'Logineo (Test)', url: 'https://idp.logineo.schulon.org/' },
};