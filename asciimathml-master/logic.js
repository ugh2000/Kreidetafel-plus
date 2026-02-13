/*
    ABI-ONLINE LOGIC MODUL
    Enthält TinyMCE Init, MathJax Config, CSV Parser und Event Handler.
    Skizzen-Logik liegt in sketch.js.
    Export-Logik liegt in export.js.
    Fallback-Daten liegen in fallback.js.
*/

// --- Konfiguration & Globale Variablen ---
const STORAGE_KEY = `abi_online_v4_content`;
let isDarkMode = false;
let renderTimer;
let voices = []; // Für Audio Stimmen
let wordLimit = 0; // Globales Wortlimit
window.taskTitle = 'Aufgabe'; // Global verfügbar gemacht für export.js
let lastNotificationStep = -1; // Für die Wortlimit-Sprachausgabe

// Tailwind Config
tailwind.config = {
    darkMode: 'class',
    theme: { extend: { colors: { slate: { 850: '#1e293b', 900: '#0f172a' } } } }
};

// MathJax Konfiguration
window.MathJax = {
    loader: { load: ['input/asciimath', 'input/tex', 'output/chtml'] },
    asciimath: { delimiters: [['`', '`'], ['§§', '§§']], displaystyle: true },
    tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$']] },
    options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'] },
    startup: {
        pageReady: () => {
            return MathJax.startup.defaultPageReady().then(() => {
                // Initialer Render
            });
        }
    }
};

// --- Hilfsfunktionen UI ---

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark');
    if(tinymce.activeEditor) {
        // TinyMCE Skin muss neu geladen werden oder via CSS gesteuert
        // Hier vereinfacht: Wir verlassen uns auf CSS-Variablen im Editor-Body, falls konfiguriert
    }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if(!t) return;
    t.innerText = msg;
    t.classList.remove('opacity-0');
    setTimeout(() => t.classList.add('opacity-0'), 3000);
}

// Sicheres Einfügen in TinyMCE
function safeInsertContent(html) {
    if (tinymce.activeEditor) {
        tinymce.activeEditor.insertContent(html);
        // Trigger save für LocalStorage
        tinymce.activeEditor.fire('Change'); 
    }
}

// Befehle sicher ausführen (für Buttons außerhalb des Editors)
function safeExecCommand(cmd, ui, val) {
    if (tinymce.activeEditor) {
        tinymce.activeEditor.execCommand(cmd, ui, val);
    }
}

// --- Toggle Sektionen ---
// Diese steuern nur die Sichtbarkeit der Panels. Die Logik dahinter ist teils ausgelagert.

function toggleTaskHeader(show) {
    const el = document.getElementById('taskHeaderSection');
    if(el) el.style.display = show ? 'block' : 'none';
}

function togglePreview(show) {
    const el = document.getElementById('previewPane');
    if(!el) return;
    el.style.display = show ? 'flex' : 'none';
    
    const cb = document.getElementById('showPreviewCheckbox');
    if(cb) cb.checked = show;

    if (show) updatePreview();
}

function toggleCorrectionMode(active) {
    const toolbar = document.getElementById('correctionToolbar');
    if (toolbar) toolbar.style.display = active ? 'flex' : 'none';
    
    if (active) {
        showToast('Korrekturmodus: Klicke auf Rot/Blau');
    }
}

function applyCorrectionStrike() {
    if (tinymce.activeEditor) {
        const selection = tinymce.activeEditor.selection.getContent();
        if (selection) {
            tinymce.activeEditor.insertContent(`<span style="text-decoration:line-through; color:red;">${selection}</span>`);
        }
    }
}

function toggleExportSection(show) {
    const el = document.getElementById('exportSection');
    if(el) el.style.display = show ? 'block' : 'none';
}

function toggleAudioSection(show) {
    const el = document.getElementById('audioSection');
    if(el) el.style.display = show ? 'block' : 'none';
    if(show && voices.length === 0) loadVoices();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
}

// --- Resizer Logik ---
function initResize(e) {
    e.preventDefault();
    document.addEventListener('mousemove', resizeDrag);
    document.addEventListener('mouseup', stopResize);
}

function resizeDrag(e) {
    const containerWidth = document.body.offsetWidth;
    const newWidth = (e.clientX / containerWidth) * 100;
    if (newWidth > 15 && newWidth < 85) {
        changeWidth(newWidth);
    }
}

function stopResize() {
    document.removeEventListener('mousemove', resizeDrag);
    document.removeEventListener('mouseup', stopResize);
}

function changeWidth(percent) {
    const taskPane = document.getElementById('taskPane');
    if(taskPane) taskPane.style.width = percent + '%';
}

// --- TinyMCE Init ---
function initEditor() {
    tinymce.init({
        selector: '#editor',
        height: '100%',
        menubar: false,
        statusbar: false,
        plugins: 'table lists link image charmap code',
        toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | table | subscript superscript | removeformat',
        content_style: `
            body { font-family: 'Inter', sans-serif; font-size: 11pt; line-height: 1.5; padding: 1rem; }
            p { margin-bottom: 0.8em; }
            table { border-collapse: collapse; width: 100%; }
            td, th { border: 1px solid #ccc; padding: 0.4rem; }
            .mjx-chtml { font-size: 110% !important; }
        `,
        setup: (editor) => {
            editor.on('init', () => {
                const saved = localStorage.getItem(STORAGE_KEY);
                if(saved) editor.setContent(saved);
                updateWordCount();
                
                // Namen laden
                const savedName = localStorage.getItem('abi_online_name');
                const savedClass = localStorage.getItem('abi_online_class');
                if(savedName && document.getElementById('studentName')) document.getElementById('studentName').value = savedName;
                if(savedClass && document.getElementById('studentClass')) document.getElementById('studentClass').value = savedClass;
            });
            editor.on('keyup change', () => {
                localStorage.setItem(STORAGE_KEY, editor.getContent());
                document.getElementById('autoSaveStatus').innerText = 'Gespeichert';
                updateWordCount();
                
                // Live Update Preview wenn offen
                const previewPane = document.getElementById('previewPane');
                if (previewPane && previewPane.style.display !== 'none') {
                    clearTimeout(renderTimer);
                    renderTimer = setTimeout(updatePreview, 800);
                }
            });
        }
    });
}

// --- Weitere Logik (CSV, Audio, etc.) ---

function updatePreview() {
    const content = tinymce.activeEditor ? tinymce.activeEditor.getContent() : '';
    const preview = document.getElementById('htmlPreview');
    if(preview) {
        preview.innerHTML = content;
        if(window.MathJax) {
             window.MathJax.typesetPromise([preview]);
        }
    }
}

function updateWordCount() {
    if(!tinymce.activeEditor) return;
    const txt = tinymce.activeEditor.getContent({format: 'text'});
    const count = txt.trim().split(/\s+/).filter(w => w.length > 0).length;
    const disp = document.getElementById('wordCountDisplay');
    if(disp) disp.innerText = count + " Wörter";
    
    // Einfache Wortlimit Logik (Beispiel)
    if(wordLimit > 0 && count > wordLimit) {
        disp.style.color = 'red';
    } else {
        disp.style.color = 'inherit';
    }
}

function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    const select = document.getElementById('voiceSelect');
    if(select && voices.length > 0) {
        select.innerHTML = '';
        voices.forEach((v, i) => {
            const opt = document.createElement('option');
            opt.value = i;
            opt.text = `${v.name} (${v.lang})`;
            if(v.lang.includes('de')) opt.selected = true;
            select.appendChild(opt);
        });
    }
}

function readText() {
    if(!tinymce.activeEditor) return;
    const txt = tinymce.activeEditor.getContent({format: 'text'});
    const utt = new SpeechSynthesisUtterance(txt);
    const select = document.getElementById('voiceSelect');
    if(select) {
        utt.voice = voices[select.value];
    }
    window.speechSynthesis.speak(utt);
}

function loadFile(url, callback) {
    fetch(url).then(r => r.text()).then(d => callback(d)).catch(e => console.error(e));
}

// Snippets (CSV) parsen und Buttons bauen
function buildSnippetButtons() {
    // Falls keine CSV, nimm Fallback
    const csvData = window.FALLBACK_FORMELN_CSV; // oder fetch
    if(!csvData) return;
    
    const lines = csvData.trim().split('\n');
    const container = document.getElementById('snippetsContainer');
    if(!container) return;
    
    // Einfacher Parser für Demo (Kategorie;Titel;Inhalt)
    // In echter App komplexer, hier basierend auf Fallback Struktur
    // Überspringe Header
    for(let i=1; i<lines.length; i++) {
        const parts = lines[i].split(';');
        if(parts.length < 3) continue;
        const cat = parts[0];
        const title = parts[1];
        const code = parts[2];
        
        const btn = document.createElement('button');
        btn.className = "w-full text-left px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-sm mb-1";
        btn.innerText = `${cat}: ${title}`;
        btn.onclick = () => safeInsertContent(code);
        container.appendChild(btn);
    }
}

// --- Init beim Laden ---
document.addEventListener('DOMContentLoaded', () => {
    // Checkbox Listener setzen
    const applyToggle = (id, checkId, fn) => {
        const el = document.getElementById(checkId);
        if(el) el.addEventListener('change', (e) => fn(e.target.checked));
    };

    applyToggle('taskHeaderSection', 'showTaskHeaderCheckbox', toggleTaskHeader);
    applyToggle('previewPane', 'showPreviewCheckbox', togglePreview);
    applyToggle('correctionToolbar', 'correctionModeCheckbox', toggleCorrectionMode);
    applyToggle('audioSection', 'showAudioCheckbox', toggleAudioSection);
    applyToggle('exportSection', 'showExportCheckbox', toggleExportSection);

    // Init Rest
    buildSnippetButtons();
    const resizer = document.getElementById('resizer');
    if(resizer) resizer.addEventListener('mousedown', initResize);
    initEditor();
    
    // Titel Input Listener
    const titleInput = document.getElementById('taskTitleInput');
    if(titleInput) {
        titleInput.addEventListener('input', (e) => {
            window.taskTitle = e.target.value || 'Aufgabe';
        });
    }
});

// Exports für HTML onclicks (sofern nicht im Module)
window.safeInsertContent = safeInsertContent;
window.safeExecCommand = safeExecCommand;
window.togglePreview = togglePreview;
window.toggleCorrectionMode = toggleCorrectionMode; 
window.toggleAudioSection = toggleAudioSection;
window.toggleExportSection = toggleExportSection; // Nur Toggle, nicht Funktion
window.toggleTaskHeader = toggleTaskHeader;
window.toggleDarkMode = toggleDarkMode;
window.changeWidth = changeWidth;
window.toggleFullscreen = toggleFullscreen;
window.readText = readText;
window.applyCorrectionStrike = applyCorrectionStrike;
window.loadFile = loadFile;

// HINWEIS: generateHTML, generatePDF, printPage, saveIdentity sind nun in export.js