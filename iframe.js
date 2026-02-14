/**
 * MODUL: iframe.js
 * Erstellt ein schwebendes Fenster für externe Werkzeuge.
 * Synchronisiert ToolListeGeneral und ToolListeIndividual mit visueller Trennung.
 * OPTIMIERT: Farbanpassung für individuelle Links (Smaragdgrün für bessere Lesbarkeit).
 */
const IFrameModul = {
    isActive: false,
    isMinimized: false,
    
    // Zentrales Speicherobjekt für alle Tools (für die Funktionslogik)
    tools: {},

    dom: {
        window: null,
        header: null,
        iframe: null,
        select: null,
        bodyArea: null,
        shareOverlay: null
    },

    init: function() {
        console.log("IFrameModul wird initialisiert...");
        this.mergeTools();
        this.createUI();
    },

    /**
     * Führt die verschiedenen Tool-Quellen zusammen.
     * Nutzt Object.assign für eine flache Kopie der Konfigurationen.
     */
    mergeTools: function() {
        const general = (typeof ToolListeGeneral !== 'undefined') ? ToolListeGeneral : {};
        const individual = (typeof ToolListeIndividual !== 'undefined') ? ToolListeIndividual : {};
        
        // Kombination der Objekte für den schnellen Zugriff via Key
        this.tools = Object.assign({}, general, individual);
    },

    /**
     * Erstellt die Benutzeroberfläche inklusive der kategorisierten Tool-Liste.
     */
    createUI: function() {
        if (document.getElementById('iframe-floating-window')) return;

        const win = document.createElement('div');
        win.id = 'iframe-floating-window';
        win.className = 'hidden fixed flex-col bg-white rounded-lg shadow-2xl border border-gray-300 z-[110] overflow-hidden';
        win.style.width = '850px';
        win.style.height = '70vh';
        win.style.left = 'calc(50vw - 425px)';
        win.style.top = '100px';
        win.style.minWidth = '400px';
        win.style.minHeight = '300px';
        win.style.resize = 'both';

        // --- Generierung der Dropdown-Optionen mit Trennlinie ---
        const general = (typeof ToolListeGeneral !== 'undefined') ? ToolListeGeneral : {};
        const individual = (typeof ToolListeIndividual !== 'undefined') ? ToolListeIndividual : {};
        
        let optionsHtml = '';
        
        // 1. Allgemeine Tools (General)
        Object.keys(general).forEach(key => {
            optionsHtml += `<option value="${key}">${general[key].name}</option>`;
        });

        // 2. Visueller Trenner (nur wenn beide Listen gefüllt sind)
        if (Object.keys(general).length > 0 && Object.keys(individual).length > 0) {
            optionsHtml += `<option disabled class="text-gray-400">──────────────</option>`;
        }

        // 3. Individuelle Tools (Individual)
        // FARBE GEÄNDERT: text-emerald-400 sorgt für hohen Kontrast auf dunklem Schiefergrau
        Object.keys(individual).forEach(key => {
            optionsHtml += `<option value="${key}" class="font-semibold text-emerald-400 bg-slate-800">${individual[key].name} (lokal)</option>`;
        });

        const header = document.createElement('div');
        header.className = 'cursor-move bg-slate-800 text-white px-3 py-2 flex justify-between items-center select-none flex-shrink-0';
        
        header.innerHTML = `
            <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <select id="iframe-tool-select" class="bg-slate-700 text-white text-xs rounded border border-slate-600 px-2 py-0.5 focus:outline-none focus:border-blue-400 max-w-[200px]">
                    ${optionsHtml}
                    <option disabled>──────────────</option>
                    <option value="custom">-- Eigene URL --</option>
                </select>
                
                <label class="flex items-center gap-1.5 text-xs cursor-pointer hover:text-blue-200 transition-colors ml-2 bg-slate-900/30 px-2 py-0.5 rounded border border-slate-600">
                    <input type="checkbox" id="iframe-share-cb" class="accent-blue-500 w-3.5 h-3.5 cursor-pointer">
                    Teilen
                </label>
            </div>

            <div class="flex items-center gap-2">
                <button id="btn-iframe-minimize" class="hover:text-gray-300 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 12H4" /></svg>
                </button>
                <button id="btn-iframe-close" class="hover:text-red-400 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        `;

        const bodyArea = document.createElement('div');
        bodyArea.className = 'flex-1 bg-white relative overflow-hidden';
        
        const iframe = document.createElement('iframe');
        iframe.id = 'iframe-display';
        iframe.className = 'w-full h-full border-none';
        iframe.setAttribute('allow', 'camera; microphone; clipboard-read; clipboard-write; geolocation; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
        
        const shareOverlay = document.createElement('div');
        shareOverlay.id = 'iframe-share-overlay';
        shareOverlay.className = 'absolute inset-0 bg-white/95 z-50 hidden flex-col items-center justify-center text-center p-8 backdrop-blur-sm transition-opacity duration-300';
        shareOverlay.innerHTML = `
            <h3 class="text-2xl font-bold text-[#004f62] mb-6 font-serif">Inhalt teilen</h3>
            <div class="bg-white p-4 rounded-xl shadow-lg border border-gray-200 mb-6">
                <div id="iframe-qr-code"></div>
            </div>
            <div class="bg-gray-100 p-3 rounded border border-gray-300 max-w-full overflow-hidden">
                <a id="iframe-share-link" href="#" target="_blank" class="text-blue-600 hover:underline font-mono text-sm break-all"></a>
            </div>
            <button id="iframe-share-close-btn" class="mt-8 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold transition-all">Schließen</button>
        `;

        bodyArea.appendChild(iframe);
        bodyArea.appendChild(shareOverlay);
        win.appendChild(header);
        win.appendChild(bodyArea);
        document.body.appendChild(win);

        this.dom.window = win;
        this.dom.header = header;
        this.dom.iframe = iframe;
        this.dom.bodyArea = bodyArea;
        this.dom.select = win.querySelector('#iframe-tool-select');
        this.dom.shareOverlay = shareOverlay;

        this.bindEvents();
        
        // Erstes verfügbares Tool laden (Präferenz auf General)
        const firstKey = Object.keys(this.tools)[0];
        if(firstKey) this.loadTool(firstKey);
    },

    bindEvents: function() {
        this.dom.select.addEventListener('change', (e) => {
            const val = e.target.value;
            this.toggleShare(false);
            
            if (val === 'custom') {
                const url = prompt("URL inkl. https://:", "https://");
                if (url && url.startsWith('http')) this.dom.iframe.src = url;
            } 
            else if (val === 'youtube') {
                const input = prompt("YouTube Link:");
                if (input) {
                    const match = input.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
                    const videoId = (match && match[2].length === 11) ? match[2] : null;
                    if (videoId) this.dom.iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
                }
            }
            else {
                this.loadTool(val);
            }
        });

        this.dom.window.querySelector('#btn-iframe-close').onclick = () => this.toggle(false);
        this.dom.window.querySelector('#btn-iframe-minimize').onclick = () => this.toggleMinimize();

        const shareCb = this.dom.window.querySelector('#iframe-share-cb');
        shareCb.addEventListener('change', (e) => this.toggleShare(e.target.checked));

        const closeOverlayBtn = this.dom.window.querySelector('#iframe-share-close-btn');
        closeOverlayBtn.addEventListener('click', () => this.toggleShare(false));

        this.setupDragging();
    },

    toggleShare: function(show) {
        const cb = this.dom.window.querySelector('#iframe-share-cb');
        if (show) {
            if(cb) cb.checked = true;
            this.dom.shareOverlay.classList.remove('hidden');
            this.dom.shareOverlay.classList.add('flex');
            
            const currentUrl = this.dom.iframe.src;
            const qrContainer = this.dom.window.querySelector('#iframe-qr-code');
            const linkEl = this.dom.window.querySelector('#iframe-share-link');
            
            if (linkEl) { linkEl.textContent = currentUrl; linkEl.href = currentUrl; }

            if (qrContainer && typeof QRCode !== 'undefined') {
                qrContainer.innerHTML = '';
                new QRCode(qrContainer, { text: currentUrl, width: 200, height: 200, colorDark : "#004f62", colorLight : "#ffffff" });
            }
        } else {
            if(cb) cb.checked = false;
            this.dom.shareOverlay.classList.add('hidden');
            this.dom.shareOverlay.classList.remove('flex');
        }
    },

    setupDragging: function() {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;
        this.dom.header.onmousedown = (e) => {
            if (['SELECT', 'INPUT', 'LABEL'].includes(e.target.tagName) || e.target.closest('button')) return;
            isDragging = true;
            startX = e.clientX; startY = e.clientY;
            initialLeft = this.dom.window.offsetLeft; initialTop = this.dom.window.offsetTop;
            document.body.style.userSelect = 'none';
        };
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            this.dom.window.style.left = `${initialLeft + (e.clientX - startX)}px`;
            this.dom.window.style.top = `${initialTop + (e.clientY - startY)}px`;
        });
        document.addEventListener('mouseup', () => { isDragging = false; document.body.style.userSelect = ''; });
    },

    loadTool: function(key) {
        const tool = this.tools[key];
        if (tool && tool.url) {
            this.dom.iframe.src = tool.url;
        }
    },

    toggle: function(show) {
        if (!this.dom.window) this.createUI();
        this.isActive = (show === undefined) ? !this.isActive : show;
        if (this.isActive) {
            this.dom.window.classList.remove('hidden');
            this.dom.window.classList.add('flex');
        } else {
            this.dom.window.classList.add('hidden');
            this.dom.window.classList.remove('flex');
            this.toggleShare(false);
        }
    },

    toggleMinimize: function() {
        this.isMinimized = !this.isMinimized;
        if (this.isMinimized) {
            this.dom.bodyArea.style.display = 'none';
            this.dom.window.dataset.oldHeight = this.dom.window.style.height;
            this.dom.window.style.height = 'auto';
            this.dom.window.style.minHeight = '0';
            this.dom.window.style.resize = 'none';
        } else {
            this.dom.bodyArea.style.display = 'block';
            this.dom.window.style.height = this.dom.window.dataset.oldHeight || '70vh';
            this.dom.window.style.minHeight = '300px';
            this.dom.window.style.resize = 'both';
        }
    }
};

// Automatische Initialisierung
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => IFrameModul.init());
} else {
    IFrameModul.init();
}