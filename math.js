/**
 * MODUL: math.js
 * Verwaltet die Darstellung von AsciiMathML Formeln mittels MathJax.
 * Baut eine verstellbare Vorschau-Box (Split-View) unter den Editor.
 */
const MathModul = {
    editor: null,
    isActive: false,
    
    // DOM-Elemente
    dom: {
        container: null,    // Der Vorschau-Container
        contentArea: null,  // Der Textbereich darin
        resizer: null       // Der Anfasser
    },
    
    renderTimer: null,

    init: function(editorInstance) {
        console.log("MathModul wird initialisiert...");
        this.editor = editorInstance;
        
        this.createUI();
        this.loadMathJax();
        this.bindEvents();
    },

    createUI: function() {
        const editorBox = document.getElementById('editor-box');
        if (!editorBox || !editorBox.parentNode) return;

        // 1. Resizer erstellen
        const resizer = document.createElement('div');
        resizer.className = 'resizer'; // CSS Klasse ist in index.html definiert
        resizer.title = "Ziehen zum Ändern der Größe";
        
        // 2. Container für die Vorschau erstellen
        const container = document.createElement('div');
        container.id = 'math-preview-container';
        container.className = 'hidden bg-white rounded-lg shadow-sm border border-gray-300 p-4 overflow-auto flex-shrink-0';
        // Start-Höhe für die Vorschau (ca. 30% des Bildschirms)
        container.style.height = "250px"; 
        
        // Header
        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-2 border-b border-gray-100 pb-2 sticky top-0 bg-white z-10';
        header.innerHTML = `
            <h3 class="text-sm font-bold text-gray-700 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Mathe-Vorschau
            </h3>
            <span class="text-xs text-gray-400">Wird live aktualisiert</span>
        `;
        
        // Inhaltsbereich
        const content = document.createElement('div');
        content.id = 'math-preview-content';
        content.className = 'prose prose-sm max-w-none text-gray-800';
        content.innerHTML = '<p class="text-gray-400 italic">Vorschau lädt...</p>';

        container.appendChild(header);
        container.appendChild(content);

        // Ins DOM einfügen: Erst Resizer, dann Container (nach Editor)
        editorBox.parentNode.insertBefore(resizer, editorBox.nextSibling);
        editorBox.parentNode.insertBefore(container, resizer.nextSibling);

        this.dom.container = container;
        this.dom.contentArea = content;
        this.dom.resizer = resizer;

        // --- RESIZER LOGIK ---
        // Wir nutzen Arrow Functions, um 'this' Kontext zu behalten
        const startResize = (e) => {
            e.preventDefault();
            this.dom.resizer.classList.add('active');
            
            // Startposition der Maus und Start-Höhe der Vorschau merken
            const startY = e.clientY;
            const startHeight = parseInt(window.getComputedStyle(this.dom.container).height, 10);
            
            const doDrag = (moveEvent) => {
                // Berechne Differenz: Ziehen nach UNTEN (+) verkleinert Vorschau (da sie unten ist)
                // Ziehen nach OBEN (-) vergrößert Vorschau.
                // Formel: Neue Höhe = Alte Höhe + (Start Maus Y - Aktuelle Maus Y)
                const dy = startY - moveEvent.clientY;
                const newHeight = startHeight + dy;
                
                // Limits setzen (min 100px, max 800px)
                if (newHeight > 100 && newHeight < (window.innerHeight - 150)) {
                    this.dom.container.style.height = `${newHeight}px`;
                }
            };

            const stopDrag = () => {
                this.dom.resizer.classList.remove('active');
                document.documentElement.removeEventListener('mousemove', doDrag);
                document.documentElement.removeEventListener('mouseup', stopDrag);
            };

            document.documentElement.addEventListener('mousemove', doDrag);
            document.documentElement.addEventListener('mouseup', stopDrag);
        };

        resizer.addEventListener('mousedown', startResize);
    },

    loadMathJax: function() {
        if (window.MathJax) return; 

        window.MathJax = {
            loader: { load: ['input/asciimath', 'input/tex', 'output/chtml'] },
            asciimath: {
                delimiters: [['`', '`'], ['§§', '§§']], 
                displaystyle: true
            },
            tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
                processEscapes: true
            },
            options: {
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
                ignoreHtmlClass: 'tex2jax_ignore',
                processHtmlClass: 'tex2jax_process'
            },
            startup: {
                pageReady: () => {
                    return MathJax.startup.defaultPageReady().then(() => {
                        console.log('MathJax bereit (via MathModul)');
                        if (this.isActive) this.render();
                    });
                }
            }
        };

        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/startup.js";
        script.async = true;
        document.head.appendChild(script);
    },

    bindEvents: function() {
        this.editor.on('input keyup change', () => {
            if (this.isActive) {
                this.debouncedPreview();
            }
        });
    },

    debouncedPreview: function() {
        clearTimeout(this.renderTimer);
        this.renderTimer = setTimeout(() => {
            this.render();
        }, 500);
    },

    /**
     * Schaltet die Vorschau an/aus
     * @param {boolean} [show] - Optional: Explizit an/aus setzen
     */
    toggle: function(show) {
        if (show === undefined) {
            this.isActive = !this.isActive;
        } else {
            this.isActive = show;
        }
        
        console.log("Mathe Vorschau:", this.isActive ? "AN" : "AUS");

        if (this.dom.container && this.dom.resizer) {
            if (this.isActive) {
                this.dom.container.classList.remove('hidden');
                // Resizer als Flexbox anzeigen
                this.dom.resizer.style.display = 'flex';
                this.render(); 
            } else {
                this.dom.container.classList.add('hidden');
                this.dom.resizer.style.display = 'none';
            }
        }
    },

    render: function() {
        if (!this.editor || !this.dom.contentArea) return;

        const content = this.editor.getContent();
        this.dom.contentArea.innerHTML = content || '<p class="text-gray-400 italic">Vorschau leer...</p>';

        if (window.MathJax && window.MathJax.typesetPromise) {
            MathJax.typesetClear([this.dom.contentArea]);
            MathJax.typesetPromise([this.dom.contentArea]).catch(err => console.log(err));
        }
    }
};