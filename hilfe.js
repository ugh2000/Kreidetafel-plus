/**
 * MODUL: hilfe.js
 * Verwaltet die Anzeige der Hilfeseite. 
 * Bezieht Inhalte aus 'hilfe-content.js'.
 */
const HilfeModul = {
    domElements: {
        modal: null,
        closeBtn: null,
        wrapper: null,
        menuArea: null,
        detailArea: null
    },

    activePageId: 'general',

    init: function() {
        console.log("HilfeModul wird initialisiert...");
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
        if (typeof HilfeContent === 'undefined') return;
        
        this.domElements.menuArea.innerHTML = '';
        const list = document.createElement('ul');
        list.className = "divide-y divide-gray-100";
        
        HilfeContent.forEach(page => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            const isActive = page.id === this.activePageId;
            
            btn.className = `w-full text-left px-4 py-3 text-sm font-medium flex items-center gap-3 transition-colors focus:outline-none 
                ${isActive ? 'bg-white text-[#1f93b4] border-l-4 border-[#1f93b4]' : 'text-gray-600 border-l-4 border-transparent hover:bg-gray-100'}`;
            
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
        if (typeof HilfeContent === 'undefined') return;
        
        const page = HilfeContent.find(p => p.id === id);
        if (page) {
            this.domElements.detailArea.innerHTML = page.content;
            this.domElements.detailArea.scrollTop = 0;
            
            // Spezielle dynamische Render-Aufrufe
            if (id === 'shortcuts') this.renderShortcutTable();
            if (id === 'changelog') this.renderChangelog();
        }
    },

    renderShortcutTable: function() {
        const container = document.getElementById('shortcut-list-container');
        if (!container) return;

        if (typeof ShortcutModul !== 'undefined') {
            const list = ShortcutModul.getAll();
            let html = '<table class="w-full text-xs text-left border-collapse"><tbody>';
            list.forEach(item => {
                html += `<tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td class="p-2 font-mono text-[#004f62] font-bold bg-gray-50/50">${item.key}</td>
                    <td class="p-2 text-gray-600">${item.desc}</td>
                </tr>`;
            });
            container.innerHTML = html + '</tbody></table>';
        } else {
            container.innerHTML = `<div class="p-4 text-red-500 text-xs">⚠ 'shortcuts.js' fehlt.</div>`;
        }
    },

    renderChangelog: function() {
        const container = document.getElementById('changelog-container');
        if (!container) return;

        if (typeof ChangelogModul !== 'undefined') {
            const history = ChangelogModul.getAll();
            let html = '';
            history.forEach(item => {
                html += `
                    <div class="border-l-4 border-[#1f93b4] pl-4 mb-6">
                        <h4 class="font-bold text-[#004f62] text-sm">${item.version} – ${item.title}</h4>
                        <p class="text-[10px] text-gray-400 uppercase tracking-wider mb-1">${item.date}</p>
                        <ul class="text-xs text-gray-600 list-disc pl-4 space-y-1">
                            ${item.notes.map(note => `<li>${note}</li>`).join('')}
                        </ul>
                    </div>`;
            });
            container.innerHTML = html;
        } else {
            container.innerHTML = `<div class="p-4 text-red-500 text-xs">⚠ 'changelog.js' fehlt.</div>`;
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