/* ABI-ONLINE SKIZZEN MODUL
   Enthält die Logik UND das HTML-Interface für das Zeichenbrett.
   Komplett gekapselt: Erzeugt das Modal automatisch im DOM.
*/

let isDrawing = false;
let ctx;
let canvas;
let currentTool = 'pen';
let startX, startY;
let snapshot; // Für Form-Vorschau (temporär)

// Undo/Redo Historie
let history = [];
let historyStep = -1;

// --- 1. UI Definition (HTML im JS) ---
const MODAL_TEMPLATE = `
<div id="drawingModal" class="fixed inset-0 bg-black/50 hidden items-center justify-center z-[100]">
    <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl w-[95%] max-w-3xl">
        
        <!-- Header / Toolbar Oben -->
        <div class="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 dark:border-slate-700">
            <h3 class="text-lg font-bold dark:text-white mr-4">Skizze</h3>
            
            <div class="flex gap-2 w-full justify-between">
                <!-- Werkzeuge -->
                <div class="flex bg-slate-100 dark:bg-slate-700 rounded p-1 gap-1">
                    <button onclick="setTool('pen')" id="btn-pen" class="p-1.5 rounded bg-white dark:bg-slate-600 shadow-sm transition-colors" title="Stift">✏️</button>
                    <button onclick="setTool('text')" id="btn-text" class="p-1.5 rounded hover:bg-white dark:hover:bg-slate-600 transition-colors font-bold px-2.5" title="Text einfügen">T</button>
                    <div class="w-[1px] bg-slate-300 dark:bg-slate-500 mx-1"></div>
                    <button onclick="setTool('rect')" id="btn-rect" class="p-1.5 rounded hover:bg-white dark:hover:bg-slate-600 transition-colors" title="Rechteck">⬜</button>
                    <button onclick="setTool('circle')" id="btn-circle" class="p-1.5 rounded hover:bg-white dark:hover:bg-slate-600 transition-colors" title="Kreis">⭕</button>
                    <button onclick="setTool('line')" id="btn-line" class="p-1.5 rounded hover:bg-white dark:hover:bg-slate-600 transition-colors" title="Linie">📏</button>
                </div>

                <!-- History & Extra -->
                <div class="flex bg-slate-100 dark:bg-slate-700 rounded p-1 gap-1">
                    <button onclick="undo()" class="p-1.5 rounded hover:bg-white dark:hover:bg-slate-600 transition-colors" title="Rückgängig">↩️</button>
                    <button onclick="redo()" class="p-1.5 rounded hover:bg-white dark:hover:bg-slate-600 transition-colors" title="Wiederholen">↪️</button>
                    <div class="w-[1px] bg-slate-300 dark:bg-slate-500 mx-1"></div>
                    <button onclick="pasteImage()" class="p-1.5 rounded hover:bg-white dark:hover:bg-slate-600 transition-colors" title="Bild aus Zwischenablage einfügen">📋</button>
                </div>
            </div>
        </div>
        
        <!-- Canvas Wrapper (wichtig für Text-Input Positionierung) -->
        <div id="canvasWrapper" class="relative bg-white border border-slate-300 shadow-inner overflow-hidden">
            <canvas id="sketchpad" width="800" height="400" class="w-full cursor-crosshair touch-none block"></canvas>
            
            <!-- NEU: Hinweisbox für Text-Tool -->
            <div id="textToolHint" class="absolute bottom-2 right-2 text-xs bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 p-2 rounded border border-slate-200 dark:border-slate-600 shadow-sm pointer-events-none hidden select-none text-right">
                Klicke ins Bild zum Schreiben<br>
                <span class="font-bold text-slate-800 dark:text-white">Enter</span>: Fertig &bull; <span class="font-bold text-slate-800 dark:text-white">Shift+Enter</span>: Neue Zeile
            </div>
        </div>
        
        <!-- Footer / Controls Unten -->
        <div class="flex flex-wrap justify-between items-center mt-4 gap-4">
            
            <!-- Linke Seite: Farben & Stift -->
            <div class="flex flex-wrap gap-4 items-center">
                <!-- Farbpalette -->
                <div class="flex items-center gap-1">
                    <button onclick="setColor('#000000')" class="w-6 h-6 rounded-full bg-black border border-slate-300 focus:ring-2 ring-blue-500 hover:scale-110 transition-transform"></button>
                    <button onclick="setColor('#dc2626')" class="w-6 h-6 rounded-full bg-red-600 border border-slate-300 focus:ring-2 ring-blue-500 hover:scale-110 transition-transform"></button>
                    <button onclick="setColor('#16a34a')" class="w-6 h-6 rounded-full bg-green-600 border border-slate-300 focus:ring-2 ring-blue-500 hover:scale-110 transition-transform"></button>
                    <button onclick="setColor('#2563eb')" class="w-6 h-6 rounded-full bg-blue-600 border border-slate-300 focus:ring-2 ring-blue-500 hover:scale-110 transition-transform"></button>
                    <button onclick="setColor('#d97706')" class="w-6 h-6 rounded-full bg-amber-600 border border-slate-300 focus:ring-2 ring-blue-500 hover:scale-110 transition-transform"></button>
                    
                    <!-- Trenner für freie Wahl -->
                    <div class="w-[1px] h-6 bg-slate-300 mx-2"></div>
                    
                    <!-- Farbwähler -->
                    <div class="relative w-7 h-7 rounded-full overflow-hidden border-2 border-slate-200 hover:border-slate-400 transition-colors" title="Freie Farbe wählen">
                        <input type="color" id="penColor" value="#000000" class="absolute -top-2 -left-2 w-12 h-12 cursor-pointer p-0 border-0">
                    </div>
                </div>
                
                <!-- Stiftgröße -->
                <div class="flex items-center gap-2 border-l border-slate-300 pl-4 dark:border-slate-600">
                    <span class="text-xs text-slate-500 font-bold uppercase">Größe</span>
                    <input type="range" id="penSize" min="1" max="20" value="2" oninput="document.getElementById('sizeLabel').innerText = this.value + ' px'" class="w-24 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
                    <span id="sizeLabel" class="text-xs font-mono w-10 text-right">2 px</span>
                </div>
            </div>

            <!-- Rechte Seite: Aktionen -->
            <div class="flex gap-2">
                <button onclick="clearCanvasAction()" class="px-3 py-2 text-red-500 text-sm font-bold hover:bg-red-50 rounded transition-colors">Leeren</button>
                <div class="w-[1px] bg-slate-300 mx-1"></div>
                <button onclick="closeDrawingModal()" class="px-4 py-2 text-slate-500 hover:text-slate-700 transition-colors">Abbrechen</button>
                <button onclick="insertDrawing()" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-md transition-transform active:scale-95">Einfügen</button>
            </div>
        </div>
    </div>
</div>
`;

// --- 2. Initialisierung & Helper ---

function ensureModalExists() {
    if (!document.getElementById('drawingModal')) {
        document.body.insertAdjacentHTML('beforeend', MODAL_TEMPLATE);
    }
}

function initCanvas() {
    canvas = document.getElementById('sketchpad');
    if (!canvas) return; 
    
    // Kontext nur einmal holen
    if(!ctx) {
        ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Events binden
        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDraw);
        canvas.addEventListener('mouseout', stopDraw);
        
        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDraw(e.touches[0]); });
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e.touches[0]); });
        canvas.addEventListener('touchend', stopDraw);
    }
}

// --- 3. Undo / Redo Logik ---

function saveState() {
    // Wenn wir in der Vergangenheit sind und neu zeichnen, löschen wir die "Zukunft"
    if (historyStep < history.length - 1) {
        history = history.slice(0, historyStep + 1);
    }
    history.push(canvas.toDataURL());
    historyStep++;
    // Begrenzung Speicher (optional, z.B. 20 Schritte)
    if (history.length > 30) {
        history.shift();
        historyStep--;
    }
}

function undo() {
    if (historyStep > 0) {
        historyStep--;
        restoreState();
    }
}

function redo() {
    if (historyStep < history.length - 1) {
        historyStep++;
        restoreState();
    }
}

function restoreState() {
    const img = new Image();
    img.src = history[historyStep];
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}

// --- 4. Werkzeug & Farbe ---

function setTool(tool) {
    currentTool = tool;
    
    // UI Update: Buttons hervorheben
    ['pen', 'rect', 'circle', 'line', 'text'].forEach(t => {
        const btn = document.getElementById(`btn-${t}`);
        if(btn) {
            if(t === tool) {
                btn.classList.add('bg-blue-100', 'text-blue-700', 'ring-1', 'ring-blue-300');
                btn.classList.remove('bg-white', 'shadow-sm');
            } else {
                btn.classList.remove('bg-blue-100', 'text-blue-700', 'ring-1', 'ring-blue-300');
                btn.classList.add('bg-white', 'shadow-sm');
            }
        }
    });

    // Hinweis ein-/ausblenden
    const hint = document.getElementById('textToolHint');
    if(hint) {
        if(tool === 'text') hint.classList.remove('hidden');
        else hint.classList.add('hidden');
    }
}

function setColor(color) {
    const picker = document.getElementById('penColor');
    if (picker) picker.value = color;
}

// --- 5. Zeichenlogik ---

function startDraw(e) {
    if (!canvas) return;
    
    // Position
    const rect = canvas.getBoundingClientRect();
    startX = (e.clientX || e.pageX) - rect.left;
    startY = (e.clientY || e.pageY) - rect.top;

    // Einstellungen
    const colorEl = document.getElementById('penColor');
    const sizeEl = document.getElementById('penSize');
    ctx.strokeStyle = colorEl ? colorEl.value : '#000000';
    ctx.lineWidth = sizeEl ? sizeEl.value : 2;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = (parseInt(ctx.lineWidth) * 3 + 12) + "px sans-serif"; // Schriftgröße etwas angepasst

    // TEXT TOOL SONDERBEHANDLUNG (Direkte Eingabe)
    if (currentTool === 'text') {
        createFloatingInput(startX, startY);
        return; // Kein Zeichnen starten
    }

    isDrawing = true;
    
    // Beginne Pfad oder Snapshot für Formen
    ctx.beginPath();
    if (currentTool === 'pen') {
        ctx.moveTo(startX, startY);
    } else {
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
}

// Helper für das Textfeld über dem Canvas
function createFloatingInput(x, y) {
    // Falls schon eines da ist, entfernen (und speichern?)
    const existing = document.getElementById('floatingTextInput');
    if(existing) existing.remove();

    const input = document.createElement('textarea'); // WICHTIG: Textarea für Mehrzeiligkeit
    input.id = 'floatingTextInput';
    input.placeholder = 'Text hier tippen...';
    
    // Styling damit es sich nahtlos einfügt
    input.style.position = 'absolute';
    input.style.left = x + 'px';
    // Offset nach oben, damit der Text grob auf der Linie sitzt
    input.style.top = (y - 10) + 'px'; 
    input.style.font = ctx.font;
    input.style.color = ctx.fillStyle;
    input.style.background = 'transparent'; // 'rgba(255,255,255,0.8)';
    input.style.border = '1px dashed #ccc';
    input.style.outline = 'none';
    input.style.padding = '0';
    input.style.zIndex = '1000';
    input.style.minWidth = '150px';
    input.style.minHeight = '50px';
    input.style.overflow = 'hidden';
    input.style.resize = 'both'; // Erlaubt das Ziehen der Box

    // In den Wrapper einfügen (NICHT body, damit Position relativ zum Canvas stimmt)
    const wrapper = document.getElementById('canvasWrapper');
    wrapper.appendChild(input);
    
    // Fokus setzen
    setTimeout(() => input.focus(), 10);

    // Events zum Speichern
    const commitText = () => {
        if(input.value.trim() !== "") {
            saveState(); // Zustand vor dem Text
            
            // Mehrzeiligkeit verarbeiten
            const lines = input.value.split('\n');
            const fontSize = parseInt(ctx.font, 10) || 16;
            const lineHeight = fontSize * 1.2;

            lines.forEach((line, index) => {
                ctx.fillText(line, x, y + (index * lineHeight));
            });
            
            saveState(); // Zustand mit Text
        }
        input.remove();
    };

    // NEU: Enter speichert, Shift+Enter macht neue Zeile
    input.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Verhindere Standard (Neue Zeile)
            commitText();       // Speichern & Schließen
        }
        // Shift+Enter wird von Textarea automatisch als neue Zeile behandelt
    });
    
    input.addEventListener('blur', commitText);
}

function draw(e) {
    if (!isDrawing || !canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX || e.pageX) - rect.left;
    const mouseY = (e.clientY || e.pageY) - rect.top;
    
    if (currentTool === 'pen') {
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
    } else {
        // Formen Vorschau
        ctx.putImageData(snapshot, 0, 0);
        ctx.beginPath();
        
        if (currentTool === 'rect') {
            ctx.rect(startX, startY, mouseX - startX, mouseY - startY);
        } else if (currentTool === 'circle') {
            const radius = Math.sqrt(Math.pow(mouseX - startX, 2) + Math.pow(mouseY - startY, 2));
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        } else if (currentTool === 'line') {
            ctx.moveTo(startX, startY);
            ctx.lineTo(mouseX, mouseY);
        }
        ctx.stroke();
    }
}

function stopDraw() {
    if (isDrawing) {
        isDrawing = false;
        saveState(); // Zustand speichern nach dem Zeichnen
    }
}

// --- 6. Fenstersteuerung & Actions ---

function clearCanvasAction() {
    if (confirm('Wirklich alles löschen?')) {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveState();
    }
}

async function pasteImage() {
    try {
        const items = await navigator.clipboard.read();
        for (const item of items) {
            if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
                const blob = await item.getType(item.types.includes('image/png') ? 'image/png' : 'image/jpeg');
                const img = new Image();
                img.onload = () => {
                    // Bild mittig einpassen oder oben links
                    // Wir skalieren es, falls es riesig ist
                    let w = img.width;
                    let h = img.height;
                    if (w > canvas.width) {
                        const ratio = canvas.width / w;
                        w = canvas.width;
                        h = h * ratio;
                    }
                    if (h > canvas.height) {
                        const ratio = canvas.height / h;
                        h = canvas.height;
                        w = w * ratio;
                    }
                    ctx.drawImage(img, 0, 0, w, h);
                    saveState();
                };
                img.src = URL.createObjectURL(blob);
                return;
            }
        }
        alert('Kein Bild in der Zwischenablage gefunden.');
    } catch (err) {
        console.error(err);
        alert('Fehler beim Einfügen: Zugriff verweigert oder nicht unterstützt. (Browser-Sicherheit)');
    }
}

function openDrawingModal() {
    ensureModalExists();
    const modal = document.getElementById('drawingModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            initCanvas();
            // Canvas Größe anpassen
            if(canvas && canvas.width !== canvas.offsetWidth) {
               canvas.width = canvas.offsetWidth;
               // HIER wird die Höhe festgelegt (Standard 450px)
               canvas.height = 450; 
               ctx.lineCap = 'round';
               ctx.lineJoin = 'round';
               // Initialen State speichern (weißes Blatt)
               if(history.length === 0) saveState();
            }
            setTool(currentTool); 
        }, 10);
    }
}

function closeDrawingModal() {
    const modal = document.getElementById('drawingModal');
    if (modal) modal.style.display = 'none';
}

function insertDrawing() {
    if (!canvas) return;
    const dataURL = canvas.toDataURL('image/png');
    if (window.safeInsertContent) {
        window.safeInsertContent(`<img src="${dataURL}" alt="Skizze" style="max-width:100%;border:1px solid #ccc;display:block;margin:10px auto;"/>`);
    }
    closeDrawingModal();
    // Nicht löschen, falls man nochmal bearbeiten will? 
    // Üblicherweise löscht man nach dem Einfügen:
    clearCanvasAction(); // Oder manuell lassen
}

// Globale Exporte
window.openDrawingModal = openDrawingModal;
window.closeDrawingModal = closeDrawingModal;
window.insertDrawing = insertDrawing;
window.clearCanvasAction = clearCanvasAction;
window.setTool = setTool;
window.setColor = setColor;
window.undo = undo;
window.redo = redo;
window.pasteImage = pasteImage;