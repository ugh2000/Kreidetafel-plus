/**
 * MODUL: voice.js
 * Ermöglicht Vorlesen von Text mittels Web Speech API.
 * Bietet UI für Sprachwahl (DE, EN, FR, IT) und Steuerung.
 * REPARIERT: Erstellt UI nun auch verzögert (On-Demand).
 */
const VoiceModul = {
    editor: null,
    synth: window.speechSynthesis,
    voices: [],
    currentUtterance: null,
    
    dom: {
        container: null,
        select: null,
        btnPlay: null,
        btnStop: null,
        btnClose: null
    },

    init: function(editorInstance) {
        console.log("VoiceModul wird initialisiert...");
        this.editor = editorInstance;
        
        // UI nur vorbereiten, wenn der Editor-Box-Container schon da ist
        this.createUI();

        this.loadVoices();
        // Event-Listener für asynchrones Laden der Stimmen (wichtig für Chrome Online)
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => this.loadVoices();
        }
    },

    createUI: function() {
        if (this.dom.container) return; // Schon erstellt

        let container = document.getElementById('voice-ui-container');
        const editorBox = document.getElementById('editor-box');
        
        if (!container && editorBox && editorBox.parentNode) {
            container = document.createElement('div');
            container.id = 'voice-ui-container';
            container.className = 'hidden bg-slate-100 border-b border-gray-300 p-2 flex items-center justify-between transition-all';
            editorBox.parentNode.insertBefore(container, editorBox);
        }

        if (!container) return; // Immer noch nicht möglich? Abbruch.

        container.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="flex items-center text-slate-600 space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    <span class="font-bold text-sm">Vorlesen</span>
                </div>
                
                <select id="voice-select" class="text-sm border border-gray-300 rounded px-2 py-1 min-w-[200px] bg-white text-gray-700 focus:outline-none focus:border-blue-500">
                    <option value="">Lade Stimmen...</option>
                </select>

                <div class="flex space-x-2">
                    <button id="voice-btn-play" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Play
                    </button>
                    <button id="voice-btn-stop" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm">
                        Stop
                    </button>
                </div>
            </div>
            
            <button id="voice-btn-close" class="text-gray-400 hover:text-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;

        this.dom.container = container;
        this.dom.select = container.querySelector('#voice-select');
        this.dom.btnPlay = container.querySelector('#voice-btn-play');
        this.dom.btnStop = container.querySelector('#voice-btn-stop');
        this.dom.btnClose = container.querySelector('#voice-btn-close');

        this.bindEvents();
        this.loadVoices(); // Stimmen sofort füllen
    },

    bindEvents: function() {
        if (!this.dom.btnPlay) return;
        this.dom.btnPlay.onclick = () => this.speak();
        this.dom.btnStop.onclick = () => { if (this.synth.speaking) this.synth.cancel(); };
        this.dom.btnClose.onclick = () => this.toggle(false);
    },

    loadVoices: function() {
        if (!this.dom.select) return;
        
        let allVoices = this.synth.getVoices();
        if (allVoices.length === 0) return;

        const allowedLangs = ['de', 'en', 'fr', 'it'];
        this.voices = allVoices.filter(v => allowedLangs.includes(v.lang.split('-')[0].toLowerCase()));

        // Sortierung: Deutsch zuerst
        this.voices.sort((a, b) => {
            const isADe = a.lang.startsWith('de');
            const isBDe = b.lang.startsWith('de');
            if (isADe && !isBDe) return -1;
            if (!isADe && isBDe) return 1;
            return a.name.localeCompare(b.name);
        });

        this.dom.select.innerHTML = '';
        this.voices.forEach(voice => {
            const option = document.createElement('option');
            option.value = voice.name;
            let flag = voice.lang.startsWith('de') ? '🇩🇪' : (voice.lang.startsWith('en') ? '🇬🇧' : '🌍');
            option.textContent = `${flag} ${voice.name} (${voice.lang})`;
            if (voice.lang.startsWith('de-DE')) option.selected = true;
            this.dom.select.appendChild(option);
        });
    },

    speak: function() {
        if (this.synth.speaking) this.synth.cancel();

        let text = "";
        if (this.editor) {
            text = this.editor.selection.getContent({format: 'text'}) || this.editor.getContent({format: 'text'});
        }

        if (!text || text.trim() === '') {
            console.warn("Kein Text zum Vorlesen gefunden.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = this.voices.find(v => v.name === this.dom.select.value);
        if (voice) utterance.voice = voice;
        utterance.rate = 0.9;
        this.synth.speak(utterance);
    },

    toggle: function(show) {
        // Falls die UI noch nicht existiert (z.B. Online-Verzögerung), jetzt erstellen
        if (!this.dom.container) this.createUI();
        if (!this.dom.container) return; 

        const isCurrentlyHidden = this.dom.container.classList.contains('hidden');
        const shouldShow = show === undefined ? isCurrentlyHidden : show;

        if (shouldShow) {
            this.dom.container.classList.remove('hidden');
        } else {
            this.dom.container.classList.add('hidden');
            if (this.synth.speaking) this.synth.cancel();
        }
    }
};