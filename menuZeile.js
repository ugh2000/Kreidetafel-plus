/**
 * MODUL: menuZeile.js
 * Steuert die Buttons und Anzeigen in der obersten Leiste.
 * Enthält Export-Logik, Wortzählung mit Limit-Warnung und Auflösungssteuerung.
 */
const MenuZeileModul = {
    domElements: {
        dimsDisplay: null,
        wordCountDisplay: null,
        helpBtn: null,
        resSelect: null,
        fullscreenBtn: null,
        voiceBtn: null,
        mathBtn: null,
        taskCreatorBtn: null,
        exportBtn: null,
        sketchBtn: null,
        groupsBtn: null,
        editorBox: null
    },

    currentWordLimit: 0, 

    init: function() {
        console.log("MenuZeileModul wird initialisiert...");
        this.cacheDom();
        this.bindEvents();
        this.updateDimensions();
        // Initiale Anzeige des Wortzählers
        this.updateWordCountDisplay(0);
    },

    cacheDom: function() {
        this.domElements.dimsDisplay = document.getElementById('window-dims');
        this.domElements.wordCountDisplay = document.getElementById('word-count');
        this.domElements.helpBtn = document.getElementById('btn-help');
        this.domElements.resSelect = document.getElementById('res-select');
        this.domElements.fullscreenBtn = document.getElementById('btn-fullscreen');
        this.domElements.voiceBtn = document.getElementById('btn-voice');
        this.domElements.mathBtn = document.getElementById('btn-math');
        this.domElements.taskCreatorBtn = document.getElementById('btn-task-creator');
        this.domElements.exportBtn = document.getElementById('btn-export-html');
        this.domElements.sketchBtn = document.getElementById('btn-sketch');
        this.domElements.groupsBtn = document.getElementById('btn-groups');
        this.domElements.editorBox = document.getElementById('editor-box');
    },

    bindEvents: function() {
        window.addEventListener('resize', () => this.updateDimensions());

        // HILFE
        if(this.domElements.helpBtn) {
            this.domElements.helpBtn.addEventListener('click', () => {
                if (typeof HilfeModul !== 'undefined') HilfeModul.oeffnen();
            });
        }

        // AUFGABENGESTALTER
        if(this.domElements.taskCreatorBtn) {
            this.domElements.taskCreatorBtn.addEventListener('click', () => {
                window.location.href = 'aufgabengestalter.html';
            });
        }

        // VORLESEN
        if(this.domElements.voiceBtn) {
            this.domElements.voiceBtn.addEventListener('click', () => {
                if (typeof VoiceModul !== 'undefined') {
                    VoiceModul.toggle();
                    this.domElements.voiceBtn.classList.toggle('bg-opacity-50'); 
                }
            });
        }

        // MATHE VORSCHAU
        if(this.domElements.mathBtn) {
            this.domElements.mathBtn.addEventListener('click', () => {
                if (typeof MathModul !== 'undefined') {
                    MathModul.toggle();
                    this.domElements.mathBtn.classList.toggle('bg-opacity-50');
                }
            });
        }

        // SKIZZE
        if(this.domElements.sketchBtn) {
            this.domElements.sketchBtn.addEventListener('click', () => {
                if (typeof SkizzeModul !== 'undefined') SkizzeModul.open();
            });
        }

        // GRUPPEN
        if(this.domElements.groupsBtn) {
            this.domElements.groupsBtn.addEventListener('click', () => {
                if (typeof GruppenModul !== 'undefined') {
                    GruppenModul.toggle();
                    this.domElements.groupsBtn.classList.toggle('bg-opacity-50');
                }
            });
        }
        
        // NEU: iFrame Tools Button
        const btnIframe = document.getElementById('btn-iframe');
        if (btnIframe) {
            btnIframe.addEventListener('click', () => {
                if (typeof IFrameModul !== 'undefined') {
                    IFrameModul.toggle();
                }
            });
        }

        // EXPORT (Ausführliche Version)
        if(this.domElements.exportBtn) {
            this.domElements.exportBtn.addEventListener('click', () => this.exportToHtml());
        }

        // VOLLBILD
        if(this.domElements.fullscreenBtn) {
            this.domElements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // RESOLUTION
        if(this.domElements.resSelect) {
            this.domElements.resSelect.addEventListener('change', (e) => {
                this.changeResolution(e.target.value);
            });
        }
    },

    // --- HILFSFUNKTIONEN ---

    /**
     * Erzeugt eine eigenständige HTML-Datei des Tafelbildes inkl. Corporate Design
     */
    exportToHtml: function() {
        if (typeof tinymce === 'undefined' || !tinymce.activeEditor) {
            console.error("Export fehlgeschlagen: Editor nicht bereit.");
            return;
        }

        const content = tinymce.activeEditor.getContent();
        const dateStr = new Date().toLocaleDateString('de-DE');
        const timeStr = new Date().toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'}).replace(':','-');
        
        const html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Tafel Export - ${dateStr}</title>
    <style>
        body { 
            font-family: 'Calibri', 'Candara', 'Segoe', 'Segoe UI', 'Optima', 'Arial', sans-serif; 
            max-width: 900px; 
            margin: 0 auto; 
            padding: 40px; 
            color: #222;
            line-height: 1.6;
            background-color: #fff;
        }
        h1 { color: #004f62; border-bottom: 2px solid #1f93b4; padding-bottom: 8px; font-weight: 700; margin-top: 25px; margin-bottom: 15px; font-size: 2.2em; }
        h2 { color: #1f93b4; font-size: 1.8em; margin-top: 20px; margin-bottom: 12px; font-weight: 600; }
        h3 { color: #444; font-size: 1.3em; border-left: 5px solid #004f62; padding: 5px 10px; background: #f1f5f9; margin-top: 18px; margin-bottom: 10px; font-weight: 600; }
        h4 { color: #1f93b4; font-size: 1.1em; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 15px; margin-bottom: 8px; font-weight: bold; }
        a { color: #1f93b4; text-decoration: none; border-bottom: 1px dotted #1f93b4; }
        ul { list-style-type: disc; padding-left: 20px; }
        ul li::marker { color: #004f62; }
        img { max-width: 100%; height: auto; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .live-clock, .live-timer, .live-counter, .live-dice, .live-traffic-light { 
            border: 1px solid #ccc; padding: 10px; border-radius: 8px; display: inline-block; background: #f8fafc; margin: 10px 0; 
        }
    </style>
</head>
<body>
    <header>
        <p style="font-size: 0.8em; color: #666;">Exportiert am ${dateStr} um ${timeStr.replace('-',' : ')} Uhr</p>
        <h1>Tafelbild</h1>
    </header>
    <main>
        ${content}
    </main>
    <footer style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 10px; font-size: 0.75em; color: #999; text-align: center;">
        Erstellt mit dem E-Tafel Editor Modular v2.2
    </footer>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Tafelbild_${dateStr.replace(/\./g, '-')}_${timeStr}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    setWordLimit: function(limit) {
        this.currentWordLimit = parseInt(limit) || 0;
        // Anzeige sofort aktualisieren, falls schon Text da ist
        if (tinymce.activeEditor) {
            const count = tinymce.activeEditor.plugins.wordcount.body.getWordCount();
            this.updateWordCountDisplay(count);
        }
    },

    /**
     * Aktualisiert die Anzeige und färbt sie bei Überschreitung rot ein.
     */
    updateWordCountDisplay: function(count) {
        if (!this.domElements.wordCountDisplay) return;

        let text = `${count} Wörter`;
        let isOverLimit = false;

        if (this.currentWordLimit > 0) {
            text += ` / ${this.currentWordLimit}`;
            if (count > this.currentWordLimit) {
                isOverLimit = true;
            }
        }

        this.domElements.wordCountDisplay.textContent = text;

        if (isOverLimit) {
            this.domElements.wordCountDisplay.classList.remove('bg-[#1f93b4]', 'bg-opacity-30');
            this.domElements.wordCountDisplay.classList.add('bg-red-600', 'font-bold', 'animate-pulse');
        } else {
            this.domElements.wordCountDisplay.classList.add('bg-[#1f93b4]', 'bg-opacity-30');
            this.domElements.wordCountDisplay.classList.remove('bg-red-600', 'font-bold', 'animate-pulse');
        }
    },

    updateDimensions: function() {
        if (this.domElements.dimsDisplay) {
            // Wir messen hier die tatsächliche Editor-Box (für präzises Layout-Feedback)
            const w = this.domElements.editorBox ? this.domElements.editorBox.offsetWidth : window.innerWidth;
            const h = this.domElements.editorBox ? this.domElements.editorBox.offsetHeight : window.innerHeight;
            this.domElements.dimsDisplay.textContent = `${w} x ${h}`;
        }
    },

    toggleFullscreen: function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Vollbild-Fehler: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    },

    changeResolution: function(value) {
        if (!this.domElements.editorBox) return;

        if (value === 'auto') {
            this.domElements.editorBox.style.width = '100%';
            this.domElements.editorBox.style.height = '100%';
            this.domElements.editorBox.style.aspectRatio = 'auto';
        } else {
            const [width, height] = value.split('x');
            this.domElements.editorBox.style.width = width + 'px';
            // Wir setzen die Höhe relativ zur Breite, um das Seitenverhältnis zu wahren
            this.domElements.editorBox.style.aspectRatio = `${width}/${height}`;
            
            // Versuch das Browserfenster anzupassen (wird oft blockiert, daher try-catch)
            try {
                window.resizeTo(parseInt(width), parseInt(height));
            } catch (e) {
                console.log("Browser verhinderte window.resizeTo.");
            }
        }
        this.updateDimensions();
    }
};