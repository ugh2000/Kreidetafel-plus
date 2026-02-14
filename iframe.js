/**
 * MODUL: iframe.js
 * Erstellt ein schwebendes Fenster für externe Werkzeuge.
 * Synchronisiert ToolListeGeneral und ToolListeIndividual mit visueller Trennung.
 * NEU: Intelligente URL-Auflösung für QR-Codes (unterstützt relative Pfade online).
 */
const IFrameModul = {
    isActive: false,
    isMinimized: false,
    isFullscreen: false,
    
    // Zentrales Speicherobjekt für alle Tools
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

    mergeTools: function() {
        const general = (typeof ToolListeGeneral !== 'undefined') ? ToolListeGeneral : {};
        const individual = (typeof ToolListeIndividual !== 'undefined') ? ToolListeIndividual : {};
        this.tools = Object.assign({}, general, individual);
    },

    createUI: function() {
        if (document.getElementById('iframe-floating-window')) return;

        const win = document.createElement('div');
        win.id = 'iframe-floating-window';
        win.className = 'hidden fixed flex-col bg-white rounded-lg shadow-2xl border border-gray-300 z-[110] overflow-hidden transition-all duration-200';
        win.style.width = '850px';
        win.style.height = '70vh';
        win.style.left = 'calc(50vw - 425px)';
        win.style.top = '100px';
        win.style.minWidth = '400px';
        win.style.minHeight = '300px';
        win.style.resize = 'both';

        const general = (typeof ToolListeGeneral !== 'undefined') ? ToolListeGeneral : {};
        const individual = (typeof ToolListeIndividual !== 'undefined') ? ToolListeIndividual : {};
        
        let optionsHtml = '';
        Object.keys(general).forEach(key => {
            optionsHtml += `<option value="${key}">${general[key].name}</option>`;
        });
        if (Object.keys(general).length > 0 && Object.keys(individual).length > 0) {
            optionsHtml += `<option disabled class="text-gray-400">──────────────</option>`;
        }
        Object.keys(individual).forEach(key => {
            optionsHtml += `<option value="${key}" class="font-semibold text-emerald-400 bg-slate-800">${individual[key].name} (lokal)</option>`;
        });

        const header = document.createElement('div');
        header.className = 'cursor-move bg-slate-800 text-white px-3 py-2 flex justify-between items-center select-none flex-shrink-0';
        
        header.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-1.5 opacity-80">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <span class="text-[10px] uppercase font-bold tracking-wider text-slate-400">Tool-Auswahl:</span>
                </div>
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

            <div class="flex items-center gap-1">
                <button id="btn-iframe-fullscreen" class="hover:text-blue-300 p-1" title="Vollbild">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                </button>
                <button id="btn-iframe-minimize" class="hover:text-gray-300 p-1" title="Minimieren">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 12H4" /></svg>
                </button>
                <button id="btn-iframe-close" class="hover:text-red-400 p-1" title="Schließen">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        `;

        const bodyArea = document.createElement('div');
        bodyArea.className = 'flex-1 bg-white relative overflow-hidden';
        
        const iframe = document.getElementById('iframe-display') || document.createElement('iframe');
        iframe.id = 'iframe-display';
        iframe.className = 'w-full h-full border-none';
        iframe.setAttribute('allow', 'camera; microphone; clipboard-read; clipboard-write; geolocation; accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
        
        const shareOverlay = document.createElement('div');
        shareOverlay.id = 'iframe-share-overlay';
        shareOverlay.className = 'absolute inset-0 bg-white/95 z-50 hidden flex-col items-center justify-center text-center p-8 backdrop-blur-sm transition-opacity duration-300';
        shareOverlay.innerHTML = `
            <div id="share-content-active" class="flex flex-col items-center w-full">
                <h3 class="text-2xl font-bold text-[#004f62] mb-6 font-serif">Inhalt teilen</h3>
                <div class="bg-white p-4 rounded-xl shadow-lg border border-gray-200 mb-6">
                    <div id="iframe-qr-code"></div>
                </div>
                <div class="bg-gray-100 p-3 rounded border border-gray-300 max-w-full overflow-hidden mb-6">
                    <a id="iframe-share-link" href="#" target="_blank" class="text-blue-600 hover:underline font-mono text-sm break-all"></a>
                </div>
            </div>
            <div id="share-content-local-error" class="hidden flex-col items-center p-6 bg-red-50 border border-red-100 rounded-xl max-w-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <h3 class="text-lg font-bold text-red-800 mb-2">Teilen lokal nicht möglich</h3>
                <p class="text-sm text-red-600">Du nutzt die App gerade <b>offline</b> von deiner Festplatte. Lokale Dateien können nicht per QR-Code an andere Geräte gesendet werden.</p>
            </div>
            <button id="iframe-share-close-btn" class="mt-4 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full font-bold transition-all">Schließen</button>
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
            } else if (val === 'youtube') {
                const input = prompt("YouTube Link:");
                if (input) {
                    const match = input.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
                    const videoId = (match && match[2].length === 11) ? match[2] : null;
                    if (videoId) this.dom.iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
                }
            } else {
                this.loadTool(val);
            }
        });

        this.dom.window.querySelector('#btn-iframe-close').onclick = () => this.toggle(false);
        this.dom.window.querySelector('#btn-iframe-minimize').onclick = () => this.toggleMinimize();
        this.dom.window.querySelector('#btn-iframe-fullscreen').onclick = () => this.toggleFullscreen();

        const shareCb = this.dom.window.querySelector('#iframe-share-cb');
        shareCb.addEventListener('change', (e) => this.toggleShare(e.target.checked));
        this.dom.window.querySelector('#iframe-share-close-btn').onclick = () => this.toggleShare(false);

        this.setupDragging();
    },

    toggleFullscreen: function() {
        this.isFullscreen = !this.isFullscreen;
        const win = this.dom.window;
        if (this.isFullscreen) {
            win.dataset.preFullWidth = win.style.width;
            win.dataset.preFullHeight = win.style.height;
            win.dataset.preFullTop = win.style.top;
            win.dataset.preFullLeft = win.style.left;
            win.style.width = '100vw';
            win.style.height = '100vh';
            win.style.top = '0';
            win.style.left = '0';
            win.style.borderRadius = '0';
            win.style.resize = 'none';
        } else {
            win.style.width = win.dataset.preFullWidth || '850px';
            win.style.height = win.dataset.preFullHeight || '70vh';
            win.style.top = win.dataset.preFullTop || '100px';
            win.style.left = win.dataset.preFullLeft || 'calc(50vw - 425px)';
            win.style.borderRadius = '0.5rem';
            win.style.resize = 'both';
        }
    },

    toggleShare: function(show) {
        const cb = this.dom.window.querySelector('#iframe-share-cb');
        const activeArea = this.dom.shareOverlay.querySelector('#share-content-active');
        const localErrorArea = this.dom.shareOverlay.querySelector('#share-content-local-error');
        
        if (show) {
            if(cb) cb.checked = true;
            this.dom.shareOverlay.classList.remove('hidden');
            this.dom.shareOverlay.classList.add('flex');
            
            // Absolute URL ermitteln (WICHTIG für relative Pfade!)
            const rawUrl = this.dom.iframe.src;
            let shareUrl = rawUrl;

            // Logik zur Auflösung relativer Pfade
            try {
                // Erzeugt eine absolute URL basierend auf der aktuellen Seite
                shareUrl = new URL(rawUrl, window.location.href).href;
            } catch(e) { shareUrl = rawUrl; }

            // Ist es ein file-Protokoll? (Sharing unmöglich)
            const isFileSystem = shareUrl.startsWith('file:');

            if (isFileSystem) {
                activeArea.classList.add('hidden');
                localErrorArea.classList.remove('hidden');
                localErrorArea.classList.add('flex');
            } else {
                activeArea.classList.remove('hidden');
                localErrorArea.classList.add('hidden');
                
                const qrContainer = this.dom.window.querySelector('#iframe-qr-code');
                const linkEl = this.dom.window.querySelector('#iframe-share-link');
                
                if (linkEl) { linkEl.textContent = shareUrl; linkEl.href = shareUrl; }
                if (qrContainer && typeof QRCode !== 'undefined') {
                    qrContainer.innerHTML = '';
                    new QRCode(qrContainer, { text: shareUrl, width: 200, height: 200, colorDark : "#004f62", colorLight : "#ffffff" });
                }
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
            if (this.isFullscreen) return;
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => IFrameModul.init());
} else {
    IFrameModul.init();
}