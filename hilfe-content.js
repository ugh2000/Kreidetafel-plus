/**
 * DATENMODUL: hilfe-content.js
 * Enthält alle Texte und Strukturen für das Hilfe-Fenster.
 * Stand: v3.0 (Korrektur-Update)
 */
const HilfeContent = [
    {
        id: 'general',
        title: 'Allgemein',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        content: `
            <h3 class="font-bold text-[#004f62] text-lg mb-3">Allgemein & Speichern</h3>
            <div class="prose text-gray-600 text-sm space-y-3">
                <p><strong>Automatische Speicherung:</strong> Deine Arbeit wird alle 30s lokal im Browser gespeichert. Beim nächsten Aufruf ist alles wieder da.</p>
                <p><strong>Alles löschen:</strong> Der Button <span class="bg-gray-200 px-1 rounded text-xs border border-gray-400">🗑️ / ❌</span> leert die Tafel und den Speicher.</p>
                <p><strong>Dateien laden:</strong> Ein direktes Öffnen von Festplatten-Dateien ist technisch nicht möglich. Nutze <b>Copy-Paste</b>, um Inhalte aus Word oder LibreOffice zu übertragen.</p>
                <p><strong>Export:</strong> Lade dein Tafelbild als fertige HTML-Datei herunter oder nutze die Druckfunktion (PDF).</p>
            </div>
        `
    },
    {
        id: 'shortcuts',
        title: 'Textkürzel',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>',
        content: `
            <h3 class="font-bold text-[#004f62] text-lg mb-3">Schnellzugriff per Tastatur</h3>
            <div class="prose text-gray-600 text-sm space-y-3">
                <p>Tippe ein Kürzel und drücke <strong>Leertaste</strong> oder <strong>Enter</strong> für blitzschnelles Einfügen.</p>
                <div id="shortcut-list-container" class="mt-4 border border-gray-200 rounded-lg overflow-hidden italic text-gray-400 p-4">Lade Kürzel...</div>
            </div>
        `
    },
    {
        id: 'correction',
        title: 'Korrektur & Lehrer',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>',
        content: `
            <h3 class="font-bold text-[#004f62] text-lg mb-3">Korrektur-Werkzeuge (v3.0)</h3>
            <p class="text-sm text-gray-600 mb-3">Markiere Text und nutze das <b>Kontextmenü (Rechtsklick)</b> oder die <b>Schnellleiste</b>:</p>
            <ul class="text-sm text-gray-600 list-disc pl-5 space-y-2">
                <li><strong class="text-red-600">🛑 Streichen:</strong> Text rot durchstreichen (jetzt auch direkt in der Schnellleiste).</li>
                <li><strong class="text-green-600">✅ Neu:</strong> Korrekturtext in Grün und Fett einfügen.</li>
                <li><strong style="color:#991b1b; background:#fee2e2; padding:0 2px;">🖍️ Mark:</strong> Hellrote Hervorhebung (statt Gelb).</li>
                <li><strong>➕ Feedback-Symbole:</strong> Klicke auf ✅, ❌, 🙂 oder Daumen. Diese werden <b>hinter</b> den markierten Text angefügt, ohne ihn zu löschen.</li>
            </ul>
        `
    },
    {
        id: 'groups',
        title: 'Gruppen bilden',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
        content: `
            <h3 class="font-bold text-[#004f62] text-lg mb-3">Gruppen-Generator</h3>
            <p class="text-sm text-gray-600 mb-2">Zufällige Einteilung mit Rollenvergabe:</p>
            <ul class="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li><strong>Mischen:</strong> Namenliste wird zufällig gewürfelt.</li>
                <li><strong>Rollen:</strong> Automatische Zuteilung (Vortrag, Zeit etc.).</li>
                <li><strong>#Syntax:</strong> Manuelle Steuerung über <code>Name #1</code> möglich.</li>
            </ul>
        `
    },
    {
        id: 'sketch',
        title: 'Skizze & Bilder',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
        content: `
            <h3 class="font-bold text-[#004f62] text-lg mb-3">Zeichnen & Clipboard</h3>
            <ul class="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li><strong>Formen:</strong> Präzise Linien, Rechtecke und Kreise.</li>
                <li><strong>Stempel:</strong> Emojis direkt in die Zeichnung setzen.</li>
                <li><strong>Strg+V:</strong> Bilder aus der Zwischenablage direkt einfügen.</li>
            </ul>
        `
    },
    {
        id: 'modules',
        title: 'Interaktive Bausteine',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>',
        content: `
            <h3 class="font-bold text-[#004f62] text-lg mb-3">Snippets & Interaktion</h3>
            <ul class="text-sm text-gray-600 list-disc pl-5 space-y-2">
                <li><strong>🔔 Glocke:</strong> Klick für akustisches Signal.</li>
                <li><strong>🎲 Würfel / 🚦 Ampel:</strong> Direkt klickbar im Editor.</li>
                <li><strong>⏱️ Timer:</strong> Echtzeit-Countdowns direkt im Text.</li>
            </ul>
        `
    },
    {
        id: 'changelog',
        title: 'Versionsverlauf',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
        content: `
            <h3 class="font-bold text-[#004f62] text-lg mb-3">Versionslogbuch</h3>
            <div id="changelog-container" class="space-y-4 text-sm text-gray-600 italic">Lade Historie...</div>
        `
    },
    {
        id: 'legal',
        title: 'Rechtliches',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
        content: `
            <h3 class="font-bold text-[#004f62] text-lg mb-3">Open Source & Lizenzen</h3>
            <div class="prose text-gray-600 text-xs space-y-2">
                <p>Dieses Projekt ist freie Software für den Bildungseinsatz.</p>
                <p>Lizenzen: TinyMCE (LGPL), MathJax (Apache), Tailwind (MIT).</p>
                <p class="mt-4 pt-4 border-t italic">Code auf GitHub verfügbar.</p>
            </div>
        `
    }
];