/**
 * MODUL: gruppen.js
 * Generiert zufällige Arbeitsgruppen aus einer Namensliste.
 * Teilt auf Wunsch automatisch Rollen zu.
 * Bidirektionale Synchronisation mit dem Textfeld (#Gruppe und (Rollen) Parser).
 */
const GruppenModul = {
    editor: null,
    isActive: false,
    isMinimized: false,
    currentGroups: [], 
    
    dom: {
        window: null,
        header: null,
        bodyArea: null,
        btnMinimize: null,
        btnClose: null,
        textarea: null,
        sizeSelect: null,
        
        rolePresent: null,
        roleTime: null,
        roleMaterial: null,
        roleJoker: null,
        roleCustom1Cb: null,
        roleCustom1Text: null,
        roleCustom2Cb: null,
        roleCustom2Text: null,
        roleCustom3Cb: null,
        roleCustom3Text: null,
        
        outputArea: null,
        btnReshuffleRoles: null,
        btnInsertEditor: null
    },

    sampleNames: [
        "Anja", "Berta", "Claus", "Detlef", "Elias", "Fiona", 
        "Gustav", "Hanna", "Ingo", "Julia", "Karl", "Lena", 
        "Max", "Nora", "Oskar", "Pia", "Quirin", "Rosa", 
        "Simon", "Tina"
    ],

    colors: [
        'bg-blue-50 border-blue-300 text-blue-900',
        'bg-green-50 border-green-300 text-green-900',
        'bg-yellow-50 border-yellow-400 text-yellow-900',
        'bg-red-50 border-red-300 text-red-900',
        'bg-purple-50 border-purple-300 text-purple-900',
        'bg-teal-50 border-teal-300 text-teal-900',
        'bg-orange-50 border-orange-300 text-orange-900',
        'bg-pink-50 border-pink-300 text-pink-900'
    ],

    exportColors: [
        { bg: '#eff6ff', border: '#93c5fd', text: '#1e3a8a' },
        { bg: '#f0fdf4', border: '#86efac', text: '#14532d' },
        { bg: '#fefce8', border: '#fde047', text: '#713f12' },
        { bg: '#fef2f2', border: '#fca5a5', text: '#7f1d1d' },
        { bg: '#faf5ff', border: '#d8b4fe', text: '#581c87' },
        { bg: '#f0fdfa', border: '#5eead4', text: '#134e4a' },
        { bg: '#fff7ed', border: '#fdba74', text: '#7c2d12' },
        { bg: '#fdf2f8', border: '#f9a8d4', text: '#831843' }
    ],

    init: function(editorInstance) {
        console.log("GruppenModul wird initialisiert...");
        this.editor = editorInstance;
        this.createUI();
    },

    createUI: function() {
        if (document.getElementById('groups-floating-window')) return;

        const win = document.createElement('div');
        win.id = 'groups-floating-window';
        win.className = 'hidden fixed flex-col bg-white rounded-lg shadow-2xl border border-gray-300 z-[100] overflow-hidden';
        win.style.width = '900px';
        
        // HIER: Start-Höhe sehr großzügig definiert (85% der Bildschirmhöhe)
        win.style.height = '85vh';
        win.style.left = 'calc(50vw - 450px)';
        win.style.top = '50px';
        
        win.style.minWidth = '550px';
        win.style.minHeight = '400px';
        win.style.maxHeight = 'none'; 
        win.style.maxWidth = 'none';
        win.style.resize = 'both';

        const header = document.createElement('div');
        header.className = 'cursor-move bg-[#004f62] text-white px-4 py-2 flex justify-between items-center select-none flex-shrink-0';
        header.innerHTML = `
            <h3 class="text-sm font-bold flex items-center gap-2 m-0 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Gruppen-Generator
            </h3>
            <div class="flex items-center gap-2">
                <!-- NEU: Hilfe-Button -->
                <button id="btn-group-help" class="text-white hover:text-blue-200 p-1 rounded transition-colors" title="Anleitung öffnen">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <button id="btn-group-minimize" class="text-white hover:text-gray-300 p-1 rounded transition-colors" title="Minimieren">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                </button>
                <button id="btn-group-close" class="text-white hover:text-red-400 p-1 rounded transition-colors" title="Schließen">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        `;
        this.dom.header = header;

        const body = document.createElement('div');
        body.className = 'flex flex-1 gap-4 p-4 overflow-hidden bg-gray-50'; 
        this.dom.bodyArea = body;

        const sidebar = document.createElement('div');
        sidebar.className = 'w-1/3 xl:w-1/4 flex flex-col gap-3 border-r border-gray-200 pr-4 overflow-y-auto';

        const textarea = document.createElement('textarea');
        textarea.className = 'flex-1 p-2 border border-gray-300 rounded text-sm min-h-[120px] resize-none focus:outline-none focus:border-[#1f93b4] shadow-sm font-mono';
        textarea.placeholder = "Namen eingeben\n\nBeispiel für manuelle Zuweisung:\nAnja #1 (🗣️ Vortrag)\nBerta #1\nClaus #2";
        this.dom.textarea = textarea;

        // Container für "Beispielnamen" und "Kopieren" Button
        const textActionsRow = document.createElement('div');
        textActionsRow.className = 'flex justify-between items-center py-1';

        const btnSample = document.createElement('button');
        btnSample.className = 'text-xs text-[#1f93b4] hover:underline text-left font-semibold';
        btnSample.textContent = "+ 20 Namen laden";
        btnSample.onclick = () => {
            textarea.value = this.sampleNames.join('\n');
        };

        const btnCopy = document.createElement('button');
        btnCopy.className = 'text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 font-semibold transition-colors';
        btnCopy.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Kopieren`;
        btnCopy.title = "Textfeld in die Zwischenablage kopieren";
        btnCopy.onclick = () => {
            if (!textarea.value) return;
            // Robuste Kopiermethode auch für iFrames
            textarea.select();
            textarea.setSelectionRange(0, 99999);
            document.execCommand("copy");
            window.getSelection().removeAllRanges();
            
            const origHTML = btnCopy.innerHTML;
            btnCopy.innerHTML = `<span class="text-green-600">Kopiert!</span>`;
            setTimeout(() => btnCopy.innerHTML = origHTML, 2000);
        };

        textActionsRow.appendChild(btnSample);
        textActionsRow.appendChild(btnCopy);

        // Sync Buttons (Übertragen / Einlesen)
        const syncRow = document.createElement('div');
        syncRow.className = 'flex gap-2 mb-2';

        const btnToText = document.createElement('button');
        btnToText.className = 'flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1.5 px-2 rounded shadow-sm transition-colors text-xs flex items-center justify-center gap-1';
        btnToText.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg> Ins Textfeld`;
        btnToText.title = "Aktuelle Gruppen & Rollen ins Textfeld schreiben, um sie manuell zu ändern.";
        btnToText.onclick = () => this.transferToTextarea();

        const btnFromText = document.createElement('button');
        btnFromText.className = 'flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1.5 px-2 rounded shadow-sm transition-colors text-xs flex items-center justify-center gap-1';
        btnFromText.innerHTML = `Übernehmen <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>`;
        btnFromText.title = "Gruppen (#Zahl) und Rollen aus dem Textfeld anwenden.";
        btnFromText.onclick = () => this.applyFromTextarea();
        
        syncRow.appendChild(btnToText);
        syncRow.appendChild(btnFromText);

        const sizeLabel = document.createElement('label');
        sizeLabel.className = 'text-sm font-bold text-gray-700 mt-1';
        sizeLabel.textContent = "Gruppengröße:";
        
        const sizeSelect = document.createElement('select');
        sizeSelect.className = 'w-full p-2 border border-gray-300 rounded text-sm bg-white shadow-sm';
        sizeSelect.innerHTML = `
            <option value="2">Partnerarbeit (2er)</option>
            <option value="3">3er-Gruppen</option>
            <option value="4" selected>4er-Gruppen</option>
            <option value="5">5er-Gruppen</option>
            <option value="6">6er-Gruppen</option>
        `;
        this.dom.sizeSelect = sizeSelect;

        const rolesLabel = document.createElement('label');
        rolesLabel.className = 'text-sm font-bold text-gray-700 mt-1';
        rolesLabel.textContent = "Rollen zuteilen:";

        const rolesContainer = document.createElement('div');
        rolesContainer.className = 'flex flex-col gap-1 text-sm text-gray-600 bg-white p-2 border border-gray-200 rounded shadow-sm';
        rolesContainer.innerHTML = `
            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="role-present" class="accent-[#1f93b4] w-4 h-4"> 🗣️ Trägt vor</label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="role-time" class="accent-[#1f93b4] w-4 h-4"> ⏱️ Zeit & Fortschritt</label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="role-material" class="accent-[#1f93b4] w-4 h-4"> 📦 Materialwart</label>
            <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" id="role-joker" class="accent-[#1f93b4] w-4 h-4"> 🃏 Joker</label>
            
            <div class="border-t border-gray-100 my-1 pt-1"></div>
            
            <div class="flex items-center gap-2">
                <input type="checkbox" id="role-c1-cb" class="accent-[#1f93b4] w-4 h-4 flex-shrink-0">
                <input type="text" id="role-c1-text" value="Rolle 1" class="flex-1 w-full border-b border-gray-200 focus:border-[#1f93b4] outline-none text-xs px-1 text-gray-600 bg-transparent">
            </div>
            <div class="flex items-center gap-2">
                <input type="checkbox" id="role-c2-cb" class="accent-[#1f93b4] w-4 h-4 flex-shrink-0">
                <input type="text" id="role-c2-text" value="Rolle 2" class="flex-1 w-full border-b border-gray-200 focus:border-[#1f93b4] outline-none text-xs px-1 text-gray-600 bg-transparent">
            </div>
            <div class="flex items-center gap-2">
                <input type="checkbox" id="role-c3-cb" class="accent-[#1f93b4] w-4 h-4 flex-shrink-0">
                <input type="text" id="role-c3-text" value="Rolle 3" class="flex-1 w-full border-b border-gray-200 focus:border-[#1f93b4] outline-none text-xs px-1 text-gray-600 bg-transparent">
            </div>
        `;

        const btnRow = document.createElement('div');
        btnRow.className = 'flex gap-2 mt-2';

        const btnGenerate = document.createElement('button');
        btnGenerate.className = 'flex-1 bg-[#1f93b4] hover:bg-[#004f62] text-white font-bold py-2 rounded shadow transition-colors text-xs xl:text-sm';
        btnGenerate.textContent = "Neu verteilen";
        btnGenerate.title = "Mischt die Personen komplett neu";
        btnGenerate.onclick = () => this.generateGroups();

        const btnRoles = document.createElement('button');
        btnRoles.className = 'flex-1 bg-white border border-[#1f93b4] text-[#1f93b4] hover:bg-blue-50 font-bold py-2 rounded shadow-sm transition-colors text-xs xl:text-sm disabled:opacity-50 disabled:cursor-not-allowed';
        btnRoles.textContent = "Rollen mischen";
        btnRoles.title = "Behält die Gruppen bei, tauscht aber die Rollen";
        btnRoles.disabled = true;
        btnRoles.onclick = () => this.reshuffleRoles();
        this.dom.btnReshuffleRoles = btnRoles;

        btnRow.appendChild(btnGenerate);
        btnRow.appendChild(btnRoles);

        const btnInsert = document.createElement('button');
        btnInsert.className = 'mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded shadow transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
        btnInsert.disabled = true;
        btnInsert.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            In Tafel einfügen
        `;
        btnInsert.onclick = () => this.insertIntoEditor();
        this.dom.btnInsertEditor = btnInsert;

        sidebar.appendChild(textarea);
        sidebar.appendChild(textActionsRow); // Die neue Reihe mit Sample & Copy!
        sidebar.appendChild(syncRow);
        sidebar.appendChild(sizeLabel);
        sidebar.appendChild(sizeSelect);
        sidebar.appendChild(rolesLabel);
        sidebar.appendChild(rolesContainer);
        sidebar.appendChild(btnRow);
        sidebar.appendChild(btnInsert);

        const outputArea = document.createElement('div');
        outputArea.className = 'w-2/3 xl:w-3/4 overflow-y-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 content-start p-2';
        outputArea.innerHTML = `
            <div class="text-gray-400 italic text-sm col-span-full flex flex-col items-center justify-center h-full mt-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Gib links Namen ein und klicke auf "Neu verteilen".<br>
                Oder bearbeite das Textfeld und klicke auf "Übernehmen".
            </div>`;
        this.dom.outputArea = outputArea;

        body.appendChild(sidebar);
        body.appendChild(outputArea);

        win.appendChild(header);
        win.appendChild(body);

        document.body.appendChild(win);

        this.dom.window = win;
        this.dom.btnMinimize = win.querySelector('#btn-group-minimize');
        this.dom.btnClose = win.querySelector('#btn-group-close');
        this.dom.btnHelp = win.querySelector('#btn-group-help'); // NEU: Referenz auf Hilfe-Button speichern
        
        this.dom.rolePresent = win.querySelector('#role-present');
        this.dom.roleTime = win.querySelector('#role-time');
        this.dom.roleMaterial = win.querySelector('#role-material');
        this.dom.roleJoker = win.querySelector('#role-joker');
        
        this.dom.roleCustom1Cb = win.querySelector('#role-c1-cb');
        this.dom.roleCustom1Text = win.querySelector('#role-c1-text');
        this.dom.roleCustom2Cb = win.querySelector('#role-c2-cb');
        this.dom.roleCustom2Text = win.querySelector('#role-c2-text');
        this.dom.roleCustom3Cb = win.querySelector('#role-c3-cb');
        this.dom.roleCustom3Text = win.querySelector('#role-c3-text');

        this.bindEvents();
        this.setupDragging();
    },

    bindEvents: function() {
        this.dom.btnClose.addEventListener('click', () => {
            this.toggle(false);
            const btnGroups = document.getElementById('btn-groups');
            if (btnGroups) btnGroups.classList.remove('bg-opacity-50');
        });

        this.dom.btnMinimize.addEventListener('click', () => {
            this.toggleMinimize();
        });

        // NEU: Klick-Event für den Hilfe-Button
        if (this.dom.btnHelp) {
            this.dom.btnHelp.addEventListener('click', () => {
                if (typeof HilfeGruppeModul !== 'undefined') {
                    HilfeGruppeModul.oeffnen();
                } else {
                    console.warn("HilfeGruppeModul ist nicht geladen.");
                }
            });
        }
    },

    setupDragging: function() {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        const header = this.dom.header;
        const win = this.dom.window;

        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = win.offsetLeft;
            initialTop = win.offsetTop;
            document.body.style.userSelect = 'none'; 
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            win.style.left = `${initialLeft + dx}px`;
            win.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
            }
        });
    },

    toggleMinimize: function() {
        this.isMinimized = !this.isMinimized;
        if (this.isMinimized) {
            this.dom.bodyArea.style.display = 'none';
            this.dom.window.style.resize = 'none';
            // Wir sichern beide Werte, um das graue Rechteck-Problem zu lösen
            this.dom.window.dataset.oldHeight = this.dom.window.style.height;
            this.dom.window.dataset.oldMinHeight = this.dom.window.style.minHeight;
            
            this.dom.window.style.minHeight = '0'; // Erlaubt das vollständige Zusammenklappen
            this.dom.window.style.height = 'auto'; // Passt sich nur noch dem Header an
            
            this.dom.btnMinimize.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" /></svg>';
            this.dom.btnMinimize.title = "Maximieren";
        } else {
            this.dom.bodyArea.style.display = 'flex';
            this.dom.window.style.resize = 'both';
            
            // Wiederherstellen der alten Werte oder Standardwerte
            this.dom.window.style.minHeight = this.dom.window.dataset.oldMinHeight || '400px';
            this.dom.window.style.height = this.dom.window.dataset.oldHeight || '85vh';
            
            this.dom.btnMinimize.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>';
            this.dom.btnMinimize.title = "Minimieren";
        }
    },

    toggle: function(show) {
        if (!this.dom.window) this.createUI();

        if (show === undefined) {
            this.isActive = !this.isActive;
        } else {
            this.isActive = show;
        }

        if (this.dom.window) {
            if (this.isActive) {
                this.dom.window.classList.remove('hidden');
                this.dom.window.classList.add('flex');
            } else {
                this.dom.window.classList.add('hidden');
                this.dom.window.classList.remove('flex');
            }
        }
    },

    cleanName: function(rawName) {
        return rawName.replace(/\([^)]+\)/g, '').replace(/#\d+/g, '').trim();
    },

    generateGroups: function() {
        const namesText = this.dom.textarea.value;
        let names = namesText.split('\n').map(n => this.cleanName(n)).filter(n => n.length > 0);
        
        if (names.length === 0) {
            this.dom.outputArea.innerHTML = '<div class="text-red-500 font-bold col-span-full">Bitte trage zuerst Namen ein!</div>';
            return;
        }

        for (let i = names.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [names[i], names[j]] = [names[j], names[i]];
        }

        const size = parseInt(this.dom.sizeSelect.value, 10);
        const numGroups = Math.ceil(names.length / size);
        
        let groups = Array.from({length: numGroups}, () => []);
        
        names.forEach((name, index) => {
            groups[index % numGroups].push({ name: name, roles: [] });
        });

        this.currentGroups = groups; 
        
        this.applyRoles(); 
        this.renderGroups();

        this.dom.btnReshuffleRoles.disabled = false;
        this.dom.btnInsertEditor.disabled = false;
    },

    reshuffleRoles: function() {
        if (!this.currentGroups || this.currentGroups.length === 0) return;

        this.currentGroups.forEach(group => {
            group.forEach(member => {
                member.roles = [];
            });
        });

        this.applyRoles();
        this.renderGroups();
    },

    transferToTextarea: function() {
        if (!this.currentGroups || this.currentGroups.length === 0) return;
        
        let outputLines = [];
        
        this.currentGroups.forEach((group, index) => {
            const groupNum = index + 1;
            group.forEach(member => {
                let line = `${member.name} #${groupNum}`;
                if (member.roles && member.roles.length > 0) {
                    line += ` (${member.roles.join(', ')})`;
                }
                outputLines.push(line);
            });
            outputLines.push(""); 
        });

        this.dom.textarea.value = outputLines.join('\n').trim();
    },

    applyFromTextarea: function() {
        const text = this.dom.textarea.value;
        let lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        if (lines.length === 0) return;

        let maxGroupNum = 0;
        let unassigned = [];
        let parsedMembers = [];

        lines.forEach(line => {
            let name = line;
            let groupNum = -1;
            let roles = [];

            const roleMatch = line.match(/\(([^)]+)\)/);
            if (roleMatch) {
                roles = roleMatch[1].split(',').map(r => r.trim()).filter(r => r.length > 0);
                name = name.replace(roleMatch[0], ''); 
            }

            const groupMatch = name.match(/#(\d+)/);
            if (groupMatch) {
                groupNum = parseInt(groupMatch[1], 10);
                if (groupNum > maxGroupNum) maxGroupNum = groupNum;
                name = name.replace(groupMatch[0], ''); 
            }

            name = name.trim();
            const memberObj = { name: name, roles: roles, assignedGroup: groupNum };

            if (groupNum > 0) {
                parsedMembers.push(memberObj);
            } else {
                unassigned.push(memberObj);
            }
        });

        let newGroups = Array.from({length: maxGroupNum}, () => []);

        parsedMembers.forEach(m => {
            newGroups[m.assignedGroup - 1].push({ name: m.name, roles: m.roles });
        });

        if (newGroups.length === 0 && unassigned.length > 0) {
            newGroups.push([]); 
        }

        unassigned.forEach(u => {
            let minSize = Infinity;
            let targetIdx = 0;
            newGroups.forEach((g, idx) => {
                if (g.length < minSize) {
                    minSize = g.length;
                    targetIdx = idx;
                }
            });
            newGroups[targetIdx].push({ name: u.name, roles: u.roles });
        });

        newGroups = newGroups.filter(g => g.length > 0);

        this.currentGroups = newGroups;
        this.renderGroups();

        this.dom.btnReshuffleRoles.disabled = false;
        this.dom.btnInsertEditor.disabled = false;
    },

    applyRoles: function() {
        const activeRoles = [];
        if (this.dom.rolePresent.checked) activeRoles.push("🗣️ Vortrag");
        if (this.dom.roleTime.checked) activeRoles.push("⏱️ Zeit");
        if (this.dom.roleMaterial.checked) activeRoles.push("📦 Material");
        if (this.dom.roleJoker.checked) activeRoles.push("🃏 Joker");
        
        if (this.dom.roleCustom1Cb.checked) {
            activeRoles.push(this.dom.roleCustom1Text.value.trim() || "Rolle 1");
        }
        if (this.dom.roleCustom2Cb.checked) {
            activeRoles.push(this.dom.roleCustom2Text.value.trim() || "Rolle 2");
        }
        if (this.dom.roleCustom3Cb.checked) {
            activeRoles.push(this.dom.roleCustom3Text.value.trim() || "Rolle 3");
        }

        if (activeRoles.length === 0) return; 

        this.currentGroups.forEach(group => {
            let shuffledRoles = [...activeRoles];
            for (let i = shuffledRoles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledRoles[i], shuffledRoles[j]] = [shuffledRoles[j], shuffledRoles[i]];
            }
            
            let startIndex = Math.floor(Math.random() * group.length);

            shuffledRoles.forEach((role, idx) => {
                if(group.length > 0) {
                    let memberIndex = (startIndex + idx) % group.length;
                    group[memberIndex].roles.push(role);
                }
            });
        });
    },

    renderGroups: function() {
        this.dom.outputArea.innerHTML = '';

        this.currentGroups.forEach((group, index) => {
            const colorClass = this.colors[index % this.colors.length];

            const card = document.createElement('div');
            card.className = `border-2 rounded-lg p-3 shadow-sm ${colorClass} flex flex-col`;

            const title = document.createElement('h4');
            title.className = 'font-bold text-lg border-b border-current pb-1 mb-2 opacity-80 flex items-center justify-between';
            title.innerHTML = `<span>Gruppe ${index + 1}</span> <span class="text-xs font-normal opacity-75">${group.length} Pers.</span>`;
            card.appendChild(title);

            const ul = document.createElement('ul');
            ul.className = 'flex flex-col gap-2 flex-1 m-0 p-0 list-none';

            group.forEach(member => {
                const li = document.createElement('li');
                li.className = 'flex flex-row items-center justify-between bg-white/70 px-2 py-1.5 rounded shadow-sm gap-2';
                
                const nameSpan = document.createElement('span');
                nameSpan.className = 'font-bold text-base truncate flex-1 outline-none focus:bg-white focus:ring-1 focus:ring-[#1f93b4] rounded px-1 cursor-text transition-colors';
                nameSpan.textContent = member.name;
                nameSpan.contentEditable = "true";
                nameSpan.title = "Klicken, um den Namen zu ändern";
                
                nameSpan.addEventListener('blur', (e) => {
                    member.name = e.target.textContent.trim();
                });

                nameSpan.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.target.blur();
                    }
                });

                li.appendChild(nameSpan);

                if (member.roles.length > 0) {
                    const roleContainer = document.createElement('div');
                    roleContainer.className = 'flex flex-wrap justify-end gap-1 shrink-0 select-none';
                    member.roles.forEach(role => {
                        const badge = document.createElement('span');
                        badge.className = 'text-[11px] bg-white border border-current px-1.5 py-0.5 rounded-md opacity-90 whitespace-nowrap font-medium';
                        badge.textContent = role;
                        roleContainer.appendChild(badge);
                    });
                    li.appendChild(roleContainer);
                }
                
                ul.appendChild(li);
            });

            card.appendChild(ul);
            this.dom.outputArea.appendChild(card);
        });
    },

    insertIntoEditor: function() {
        if (!this.editor || this.currentGroups.length === 0) return;

        let html = '<div contenteditable="false" style="display:flex; flex-wrap:wrap; gap:15px; margin: 15px 0;">';
        
        this.currentGroups.forEach((group, index) => {
            const c = this.exportColors[index % this.exportColors.length];
            
            html += `<div style="flex: 1 1 220px; min-width: 220px; background-color: ${c.bg}; border: 2px solid ${c.border}; border-radius: 8px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); font-family: 'Calibri', sans-serif;">`;
            html += `<h4 style="margin: 0 0 10px 0; font-size: 1.1em; color: ${c.text}; border-bottom: 1px solid ${c.border}; padding-bottom: 4px;">Gruppe ${index + 1}</h4>`;
            html += `<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">`;
            
            group.forEach(member => {
                html += `<li style="background-color: rgba(255,255,255,0.7); padding: 6px 8px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(0,0,0,0.05);">`;
                html += `<strong style="color: #333; font-size: 1em;">${member.name}</strong>`;
                
                if (member.roles.length > 0) {
                    html += `<div style="display: flex; gap: 4px; flex-wrap: wrap; justify-content: flex-end;">`;
                    member.roles.forEach(role => {
                        html += `<span style="font-size: 0.75em; background-color: #fff; border: 1px solid ${c.border}; padding: 2px 4px; border-radius: 4px; color: ${c.text}; white-space: nowrap; font-weight: bold;">${role}</span>`;
                    });
                    html += `</div>`;
                }
                html += `</li>`;
            });
            
            html += `</ul></div>`;
        });
        
        html += '</div><p>&nbsp;</p>';
        
        this.editor.insertContent(html);
        
        if (!this.isMinimized) {
            this.toggleMinimize();
        }
    }
};