/**
 * MODUL: hilfe.js
 * Verwaltet den Inhalt und die Anzeige der Hilfeseite.
 * Enthält Dokumentation zu allen Funktionen inkl. Korrektur, Interaktion & Gruppen.
 */
const HilfeModul = {
    domElements: {
        modal: null,
        closeBtn: null,
        wrapper: null,
        menuArea: null,
        detailArea: null
    },

    // Die Inhalte der Hilfeseiten als Datenstruktur
    pages: [
        {
            id: 'general',
            title: 'Allgemein',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
            content: `
                <h3 class="font-bold text-[#004f62] text-lg mb-3">Allgemein & Speichern</h3>
                <div class="prose text-gray-600 text-sm space-y-3">
                    <p>
                        <strong>Automatische Speicherung:</strong><br>
                        Deine Arbeit wird <strong>automatisch alle 30 Sekunden</strong> lokal im Browser gespeichert. 
                        Beim nächsten Aufruf der Seite ist der Text sofort wieder da.
                    </p>
                    <p>
                        <strong>Alles löschen:</strong><br>
                        Nutze den Button <span class="inline-flex items-center px-1 bg-gray-200 rounded text-xs border border-gray-400">🗑️ / ❌</span> in der Werkzeugleiste ("Alles löschen"), um die Tafel komplett zu leeren. <br>
                        <em>Achtung:</em> Dies löscht auch den automatischen Speicher!
                    </p>
                    <p>
                        <strong>Export:</strong><br>
                        Über den Button <span class="bg-gray-100 border border-gray-300 px-1 rounded">💾 / Export</span> kannst du dein Tafelbild als HTML-Datei inklusive Layout und Stilen herunterladen.
                    </p>
                    <p>
                        <strong>Ansicht:</strong><br>
                        Oben rechts findest du den <strong>Wortzähler</strong> und den Button für den <strong>Vollbildmodus</strong>.
                    </p>
                </div>
            `
        },
        {
            id: 'correction',
            title: 'Korrektur & Lehrer',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>',
            content: `
                <h3 class="font-bold text-[#004f62] text-lg mb-3">Korrekturmodus & Werkzeuge</h3>
                <div class="prose text-gray-600 text-sm space-y-3">
                    <p>
                        Markiere Text im Editor, um das <strong>Schnellmenü</strong> aufzurufen, oder nutze die Leiste oben:
                    </p>
                    <ul class="list-disc pl-5 space-y-2">
                        <li>
                            <strong class="text-red-600">🛑 Weg:</strong> Streicht den markierten Text rot durch (Fehler).
                        </li>
                        <li>
                            <strong class="text-green-600">✅ Neu:</strong> Formatiert Text grün und fett (Verbesserung/Ergänzung).
                        </li>
                        <li>
                            <strong class="text-yellow-600">🖍️ Mark:</strong> Hinterlegt den Text gelb (Hervorhebung).
                        </li>
                        <li>
                            <strong>💬 Kommentar:</strong> Fügt eine blaue Kommentar-Box für ausführliches Feedback ein.
                        </li>
                        <li>
                            <strong>📂 Akkordeon:</strong> Fügt einen aufklappbaren Bereich ein.
                        </li>
                    </ul>
                    <p class="text-xs text-gray-500 mt-2">
                        <em>Tipp:</em> Im Kontextmenü (Rechtsklick) findest du zusätzlich Symbole wie Haken (✅) und Kreuz (❌).
                    </p>
                </div>
            `
        },
        {
            id: 'groups',
            title: 'Gruppen bilden',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
            content: `
                <h3 class="font-bold text-[#004f62] text-lg mb-3">Gruppen-Generator</h3>
                <div class="prose text-gray-600 text-sm space-y-3">
                    <p>
                        Über den Button <strong>Gruppen</strong> öffnest du das schwebende Fenster zur Einteilung.
                    </p>
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>Mischen:</strong> Zufällige Zuteilung basierend auf der Namensliste.</li>
                        <li><strong>Rollen:</strong> Automatische Vergabe von Aufgaben (Vortrag, Zeit, Joker etc.).</li>
                        <li><strong>#Syntax:</strong> Manuelle Steuerung über das Textfeld (z.B. <code>Name #1</code>).</li>
                        <li><strong>Export:</strong> Gruppen direkt als formatierte Karten in die Tafel einfügen.</li>
                    </ul>
                </div>
            `
        },
        {
            id: 'sketch',
            title: 'Skizze & Bilder',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
            content: `
                <h3 class="font-bold text-[#004f62] text-lg mb-3">Zeichnen & Clipboard</h3>
                <div class="prose text-gray-600 text-sm space-y-3">
                    <p>
                        Das Skizzenmodul (Stift-Button) bietet erweitertes Zeichnen.
                    </p>
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>Formen:</strong> Nutze Linie, Rechteck und Kreis für präzise Skizzen.</li>
                        <li><strong>Text:</strong> Wähle das "A"-Werkzeug und klicke ins Bild, um zu schreiben.</li>
                        <li><strong>Emoji:</strong> Stemple Symbole direkt in die Zeichnung.</li>
                        <li><strong>Clipboard:</strong> Du kannst Bilder direkt per <code>Strg+V</code> in die Skizze einfügen.</li>
                    </ul>
                </div>
            `
        },
        {
            id: 'modules',
            title: 'Interaktive Bausteine',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>',
            content: `
                <h3 class="font-bold text-[#004f62] text-lg mb-3">Snippets & Interaktion</h3>
                <div class="prose text-gray-600 text-sm space-y-3">
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>🔔 Glocke:</strong> Klicke auf den Button, um einen Signalton abzuspielen.</li>
                        <li><strong>🎲 Würfel & 🚦 Ampel:</strong> Klickbar zum Würfeln oder Umschalten.</li>
                        <li><strong>🕵️ Spoiler:</strong> Klick zum Aufdecken/Verdecken. <em>Shift (Umschalt) + Klick</em> zum Ändern des Textes.</li>
                        <li><strong>📂 Akkordeon:</strong> Klick auf das Icon (👇) öffnet/schließt. Klick auf den Text zum Editieren.</li>
                        <li><strong>⏱️ Timer:</strong> Start/Stop/Reset und +/- Zeit direkt im Editor.</li>
                    </ul>
                </div>
            `
        },
        {
            id: 'tools',
            title: 'Tools & iFrames',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>',
            content: `
                <h3 class="font-bold text-[#004f62] text-lg mb-3">Externe Werkzeuge</h3>
                <div class="prose text-gray-600 text-sm space-y-3">
                    <p>Über den Button <strong>Tools</strong> öffnest du ein schwebendes Fenster.</p>
                    <ul class="list-disc pl-5 space-y-2">
                        <li><strong>Inhalte:</strong> GeoGebra, ZumPad, Wikipedia u.a. über die Auswahlliste.</li>
                        <li><strong>Teilen:</strong> Aktiviere die Checkbox "Teilen", um einen QR-Code für die aktuell angezeigte Seite zu generieren. So können Schüler die Seite auf ihren eigenen Geräten öffnen.</li>
                        <li><strong>Flexibel:</strong> Fenster ist verschiebbar und skalierbar.</li>
                    </ul>
                </div>
            `
        },
        {
            id: 'creator',
            title: 'Aufgaben erstellen',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>',
            content: `
                <h3 class="font-bold text-[#004f62] text-lg mb-3">Aufgabengestalter & QR-Codes</h3>
                <div class="prose text-gray-600 text-sm space-y-3">
                    <p>
                        Der Button <strong>Aufgabe</strong> führt zum Generator für Schüler-Links.
                    </p>
                    <ul class="list-disc pl-5 space-y-1">
                        <li><strong>QR-Code:</strong> Generiert Links oder Text-Codes.</li>
                        <li><strong>Tafel-Ansicht:</strong> Präsentationsmodus für den Beamer mit großem Text und Timer.</li>
                    </ul>
                </div>
            `
        },
        {
            id: 'changelog',
            title: 'Versionsverlauf',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
            content: `
                <h3 class="font-bold text-[#004f62] text-lg mb-3">Versionslogbuch</h3>
                <div class="space-y-4">
                    <div class="border-l-4 border-[#1f93b4] pl-4">
                        <h4 class="font-bold text-[#004f62]">v2.7 (Aktuell)</h4>
                        <p class="text-xs text-gray-500">iFrame Teilen & Links</p>
                        <ul class="text-xs text-gray-600 list-disc pl-5">
                            <li><strong>Tools-Modul:</strong> "Teilen"-Checkbox für QR-Code der aktuellen URL.</li>
                            <li><strong>Konfiguration:</strong> Externe <code>tools.js</code> für einfachere Link-Verwaltung.</li>
                        </ul>
                    </div>
                    <div class="border-l-4 border-gray-400 pl-4">
                        <h4 class="font-bold text-gray-600">v2.4</h4>
                        <p class="text-xs text-gray-500">Formen & Lehrer-Tools</p>
                        <ul class="text-xs text-gray-500 list-disc pl-5">
                            <li><strong>Skizze:</strong> Erweiterung um Formen (Rechteck, Kreis, Linie), Text-Werkzeug und Emoji-Stempel.</li>
                            <li><strong>Korrektur:</strong> Integration der Akkordeon-Funktion (Klapptext).</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            id: 'legal',
            title: 'Rechtliches & Lizenzen',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
            content: `
                <h3 class="font-bold text-[#004f62] text-lg mb-3">Open Source Lizenzen</h3>
                <div class="prose text-gray-600 text-xs space-y-4">
                    <p>Dieses Projekt nutzt freie Software-Komponenten. Vielen Dank an die Entwickler-Community.</p>
                    
                    <div>
                        <strong class="text-gray-800">TinyMCE Editor</strong><br>
                        Copyright © Tiny Technologies, Inc. <br>
                        Lizenz: GNU LGPL 2.1 (Open Source Community Edition).
                    </div>

                    <div>
                        <strong class="text-gray-800">MathJax / AsciiMath</strong><br>
                        Copyright © The MathJax Consortium. <br>
                        Lizenz: Apache License 2.0.
                    </div>

                    <div>
                        <strong class="text-gray-800">Tailwind CSS</strong><br>
                        Copyright © Tailwind Labs Inc. <br>
                        Lizenz: MIT License.
                    </div>

                    <div>
                        <strong class="text-gray-800">QRCode.js</strong><br>
                        Copyright © davidshimjs. <br>
                        Lizenz: MIT License.
                    </div>

                    <div>
                        <strong class="text-gray-800">Heroicons / Lucide Icons</strong><br>
                        Copyright © Tailwind Labs / Lucide Contributors. <br>
                        Lizenz: MIT / ISC License.
                    </div>

                    <p class="mt-4 pt-4 border-t border-gray-100 italic">
                        Die E-Tafel ist ein modulares Werkzeug für den Unterrichtseinsatz. Die private und schulische Nutzung ist ausdrücklich gestattet.
                    </p>
                </div>
            `
        }
    ],

    activePageId: 'general',

    init: function() {
        this.cacheDom();
        if(this.domElements.wrapper) {
            this.renderLayout();
            this.renderMenu();
            this.showPage(this.activePageId);
        }
        this.bindEvents();
    },

    cacheDom: function() {
        this.domElements.modal = document.getElementById('help-modal');
        this.domElements.closeBtn = document.getElementById('btn-close-help');
        this.domElements.wrapper = document.getElementById('help-content');
    },

    renderLayout: function() {
        this.domElements.wrapper.innerHTML = '';
        this.domElements.wrapper.className = "flex h-[450px] border border-gray-200 rounded-md overflow-hidden";
        this.domElements.menuArea = document.createElement('div');
        this.domElements.menuArea.className = "w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto";
        this.domElements.detailArea = document.createElement('div');
        this.domElements.detailArea.className = "w-2/3 bg-white p-6 overflow-y-auto";
        this.domElements.wrapper.appendChild(this.domElements.menuArea);
        this.domElements.wrapper.appendChild(this.domElements.detailArea);
    },

    renderMenu: function() {
        this.domElements.menuArea.innerHTML = '';
        const list = document.createElement('ul');
        list.className = "divide-y divide-gray-100";
        this.pages.forEach(page => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            const activeClasses = page.id === this.activePageId 
                ? 'bg-white text-[#1f93b4] border-l-4 border-[#1f93b4]' 
                : 'text-gray-600 border-l-4 border-transparent hover:bg-gray-100';
            btn.className = `w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-3 transition-colors focus:outline-none ${activeClasses}`;
            btn.innerHTML = `${page.icon} <span>${page.title}</span>`;
            btn.addEventListener('click', () => {
                this.activePageId = page.id;
                this.showPage(page.id);
                this.renderMenu();
            });
            li.appendChild(btn);
            list.appendChild(li);
        });
        this.domElements.menuArea.appendChild(list);
    },

    showPage: function(id) {
        const page = this.pages.find(p => p.id === id);
        if (page) {
            this.domElements.detailArea.innerHTML = page.content;
            this.domElements.detailArea.scrollTop = 0;
        }
    },

    bindEvents: function() {
        if (this.domElements.closeBtn) this.domElements.closeBtn.onclick = () => this.schliessen();
        if (this.domElements.modal) {
            this.domElements.modal.onclick = (e) => { if (e.target === this.domElements.modal) this.schliessen(); };
        }
    },

    oeffnen: function() { if (this.domElements.modal) this.domElements.modal.classList.remove('hidden'); },
    schliessen: function() { if (this.domElements.modal) this.domElements.modal.classList.add('hidden'); }
};