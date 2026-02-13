/**
 * MODUL: skizze.js (V2.2 HD & Clipboard)
 * Optimiertes Zeichenmodul mit High-DPI Support, Kurvenglättung
 * und Clipboard-Import (Paste).
 */
const SkizzeModul = {
    editor: null,
    isDrawing: false,
    ctx: null,
    canvas: null,
    mode: 'pen', 
    activeInput: null,
    snapshot: null,
    activeEmoji: null,
    
    // Punkte für Kurvenglättung (Bézier-Interpolation)
    points: [],
    
    tools: ['pen', 'text', 'eraser', 'line', 'rect', 'circle'],

    dom: {
        modal: null,
        closeBtn: null,
        insertBtn: null,
        clearBtn: null,
        colorPicker: null,
        sizeSlider: null,
        paletteContainer: null,
        emojiContainer: null
    },

    init: function(editorInstance) {
        console.log("SkizzeModul HD wird initialisiert...");
        this.editor = editorInstance;
        this.cacheDom();
        this.bindEvents();
        this.buildPalette();
        this.buildEmojiBar();
        this.setMode('pen');
    },

    cacheDom: function() {
        this.dom.modal = document.getElementById('drawingModal');
        this.canvas = document.getElementById('sketchpad');
        this.dom.closeBtn = document.getElementById('btn-close-sketch');
        this.dom.insertBtn = document.getElementById('btn-insert-sketch');
        this.dom.clearBtn = document.getElementById('btn-clear-sketch');
        this.dom.colorPicker = document.getElementById('penColor');
        this.dom.sizeSlider = document.getElementById('penSize');
        this.dom.paletteContainer = document.getElementById('colorPalette');
        this.dom.emojiContainer = document.getElementById('emojiPalette');
        
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        }
    },

    /**
     * Passt die interne Canvas-Auflösung an die Pixeldichte des Bildschirms an (HD).
     * Verhindert Pixeligkeit auf modernen Displays.
     */
    resizeCanvasHD: function() {
        const ratio = window.devicePixelRatio || 1;
        const width = this.canvas.offsetWidth;
        const height = this.canvas.offsetHeight;

        // Nur resizen wenn Abweichung vorliegt (vermeidet unnötige Canvas-Resets)
        if (this.canvas.width !== width * ratio) {
            const tempImage = this.canvas.toDataURL(); // Inhalt puffern
            
            this.canvas.width = width * ratio;
            this.canvas.height = height * ratio;
            this.ctx.scale(ratio, ratio);
            
            // Bestehenden Inhalt wiederherstellen
            const img = new Image();
            img.onload = () => this.ctx.drawImage(img, 0, 0, width, height);
            img.src = tempImage;
        }

        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    },

    buildPalette: function() {
        if (!this.dom.paletteContainer) return;
        const colors = ['#000000', '#1f93b4', '#004f62', '#dc2626', '#16a34a', '#ca8a04', '#ffffff'];
        this.dom.paletteContainer.innerHTML = '';
        colors.forEach(color => {
            const btn = document.createElement('button');
            btn.className = 'w-6 h-6 rounded-full border border-gray-300 shadow-sm transition-transform hover:scale-110 flex-shrink-0';
            btn.style.backgroundColor = color;
            btn.onclick = () => {
                if(this.dom.colorPicker) this.dom.colorPicker.value = color;
                if (this.mode === 'eraser' && color !== '#ffffff') this.setMode('pen');
            };
            this.dom.paletteContainer.appendChild(btn);
        });
    },

    buildEmojiBar: function() {
        if (!this.dom.emojiContainer) return;
        const emojis = ['👍', '✅', '❌', '⚠️', '⭐', '➡️', '🙂'];
        this.dom.emojiContainer.innerHTML = '';
        emojis.forEach(char => {
            const btn = document.createElement('button');
            btn.textContent = char;
            btn.className = 'text-xl hover:bg-gray-200 rounded px-1 transition-colors';
            btn.onclick = () => { this.activeEmoji = char; this.setMode('emoji'); };
            this.dom.emojiContainer.appendChild(btn);
        });
    },

    bindEvents: function() {
        if (!this.canvas) return;

        this.canvas.addEventListener('mousedown', (e) => this.handleStart(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        this.canvas.addEventListener('mouseup', () => this.stopDraw());
        this.canvas.addEventListener('mouseout', () => this.stopDraw());

        // Touch Support
        this.canvas.addEventListener('touchstart', (e) => { 
            if (this.mode !== 'text') e.preventDefault(); 
            this.handleStart(e.touches[0]); 
        });
        this.canvas.addEventListener('touchmove', (e) => { 
            if (this.mode !== 'text') e.preventDefault(); 
            this.handleMove(e.touches[0]); 
        });
        this.canvas.addEventListener('touchend', () => this.stopDraw());

        // CLIPBOARD IMPORT (Strg+V)
        window.addEventListener('paste', (e) => {
            if (this.dom.modal.classList.contains('hidden')) return;
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (let index in items) {
                const item = items[index];
                if (item.kind === 'file') {
                    const blob = item.getAsFile();
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => this.drawPastedImage(img);
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(blob);
                }
            }
        });

        if (this.dom.closeBtn) this.dom.closeBtn.addEventListener('click', () => this.close());
        if (this.dom.insertBtn) this.dom.insertBtn.addEventListener('click', () => this.insert());
        if (this.dom.clearBtn) this.dom.clearBtn.addEventListener('click', () => this.clear());
        
        this.tools.forEach(t => {
            const btn = document.getElementById(`tool-${t}`);
            if (btn) btn.onclick = () => this.setMode(t);
        });
    },

    drawPastedImage: function(img) {
        const cw = this.canvas.offsetWidth;
        const ch = this.canvas.offsetHeight;
        // Proportionale Skalierung (max 80% der Canvas-Fläche)
        const scale = Math.min(cw * 0.8 / img.width, ch * 0.8 / img.height, 1);
        const nw = img.width * scale;
        const nh = img.height * scale;
        const x = (cw - nw) / 2;
        const y = (ch - nh) / 2;
        
        this.ctx.drawImage(img, x, y, nw, nh);
    },

    setMode: function(mode) {
        this.mode = mode;
        this.tools.forEach(t => {
            const btn = document.getElementById(`tool-${t}`);
            if (btn) {
                btn.classList.toggle('bg-blue-100', t === mode);
                btn.classList.toggle('border-blue-500', t === mode);
                btn.classList.toggle('text-blue-700', t === mode);
            }
        });
        this.canvas.style.cursor = mode === 'text' ? 'text' : 'crosshair';
    },

    getCoords: function(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    },

    handleStart: function(e) {
        const coords = this.getCoords(e);
        this.isDrawing = true;
        this.points = [coords]; // Punkte-Array für Glättung starten

        if (this.mode === 'text') {
            this.spawnFloatingInput(coords.x, coords.y);
            return;
        }

        if (this.mode === 'emoji') {
            this.drawEmoji(coords);
            this.isDrawing = false;
            return;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(coords.x, coords.y);
        this.ctx.strokeStyle = this.mode === 'eraser' ? '#ffffff' : this.dom.colorPicker.value;
        this.ctx.lineWidth = this.mode === 'eraser' ? this.dom.sizeSlider.value * 5 : this.dom.sizeSlider.value;
        
        if (['line', 'rect', 'circle'].includes(this.mode)) {
            this.startX = coords.x;
            this.startY = coords.y;
            this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        }
    },

    handleMove: function(e) {
        if (!this.isDrawing) return;
        const coords = this.getCoords(e);

        if (['pen', 'eraser'].includes(this.mode)) {
            this.points.push(coords);
            
            if (this.points.length > 2) {
                // Quadratische Bézier-Kurve für geschmeidigen Strich
                const lastTwoPoints = this.points.slice(-2);
                const controlPoint = lastTwoPoints[0];
                const endPoint = {
                    x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
                    y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2
                };
                this.ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
                this.ctx.stroke();
            }
        } else if (['line', 'rect', 'circle'].includes(this.mode)) {
            this.ctx.putImageData(this.snapshot, 0, 0);
            this.ctx.beginPath();
            if (this.mode === 'line') {
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(coords.x, coords.y);
            } else if (this.mode === 'rect') {
                this.ctx.rect(this.startX, this.startY, coords.x - this.startX, coords.y - this.startY);
            } else if (this.mode === 'circle') {
                const r = Math.sqrt(Math.pow(coords.x - this.startX, 2) + Math.pow(coords.y - this.startY, 2));
                this.ctx.arc(this.startX, this.startY, r, 0, 2 * Math.PI);
            }
            this.ctx.stroke();
        }
    },

    stopDraw: function() {
        this.isDrawing = false;
        this.ctx.closePath();
    },

    drawEmoji: function(c) {
        const size = parseInt(this.dom.sizeSlider.value) * 5 + 20;
        this.ctx.font = `${size}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.activeEmoji, c.x, c.y);
    },

    spawnFloatingInput: function(x, y) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'absolute bg-transparent border-0 outline-none p-0 m-0';
        input.style.left = x + 'px';
        input.style.top = (y - 10) + 'px'; 
        input.style.font = `bold ${this.dom.sizeSlider.value * 3 + 10}px sans-serif`;
        input.style.color = this.dom.colorPicker.value;
        this.canvas.parentNode.appendChild(input);
        setTimeout(() => input.focus(), 0);
        input.onblur = () => {
            if (input.value) {
                this.ctx.font = input.style.font;
                this.ctx.fillStyle = input.style.color;
                this.ctx.fillText(input.value, x, y);
            }
            input.remove();
        };
    },

    open: function() {
        this.dom.modal.classList.remove('hidden');
        this.dom.modal.classList.add('flex');
        // Wichtig: HD Korrektur bei jedem Öffnen prüfen
        setTimeout(() => this.resizeCanvasHD(), 50);
    },

    close: function() {
        this.dom.modal.classList.add('hidden');
        this.dom.modal.classList.remove('flex');
    },

    clear: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    insert: function() {
        if (!this.editor) return;
        const imgHtml = `<img src="${this.canvas.toDataURL()}" style="max-width:100%; border-radius:4px;"/><p>&nbsp;</p>`;
        this.editor.insertContent(imgHtml);
        this.close();
        this.clear();
    }
};