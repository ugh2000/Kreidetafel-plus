/**
 * MODUL: hilfegruppe.js
 * Stellt ein modales Hilfefenster für das Gruppenmodul bereit.
 * Erklärt Funktionen wie Mischen, Rollenverteilung und manuelles Parsen.
 */
const HilfeGruppeModul = {
    dom: {
        modal: null,
        closeBtn: null
    },

    init: function() {
        console.log("HilfeGruppeModul wird initialisiert...");
        this.createUI();
    },

    createUI: function() {
        if (document.getElementById('help-group-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'help-group-modal';
        modal.className = 'fixed inset-0 z-[200] hidden flex items-center justify-center bg-gray-900/50 backdrop-blur-sm transition-opacity';
        
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative overflow-hidden">
                <!-- Header -->
                <div class="bg-[#004f62] text-white px-6 py-4 flex justify-between items-center flex-shrink-0">
                    <h2 class="text-xl font-bold flex items-center gap-2 m-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Anleitung: Gruppen-Generator
                    </h2>
                    <button id="btn-close-group-help" class="text-white hover:text-red-300 transition-colors p-1" title="Schließen">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <!-- Content -->
                <div class="p-6 overflow-y-auto flex-1 text-gray-700 space-y-6" style="font-family: 'Inter', 'Calibri', sans-serif;">
                    
                    <section>
                        <h3 class="text-lg font-bold text-[#1f93b4] mb-2 border-b border-gray-200 pb-1">1. Grundlagen & Automatik</h3>
                        <p class="mb-2 text-sm leading-relaxed">
                            Trage die Namen deiner Schülerinnen und Schüler in das linke Textfeld ein (ein Name pro Zeile). 
                            Wähle die gewünschte <strong>Gruppengröße</strong> und klicke auf <span class="bg-[#1f93b4] text-white px-2 py-0.5 rounded text-xs font-bold">Neu verteilen</span>. 
                            Das System mischt die Namen nach einem mathematischen Zufallsprinzip (Fisher-Yates-Algorithmus) und teilt sie restlos auf.
                        </p>
                    </section>

                    <section>
                        <h3 class="text-lg font-bold text-[#1f93b4] mb-2 border-b border-gray-200 pb-1">2. Rollenverteilung</h3>
                        <p class="mb-2 text-sm leading-relaxed">
                            Aktiviere die Checkboxen für Rollen (z.B. Zeit, Material). Diese werden innerhalb der bereits gebildeten Gruppen zufällig verteilt. 
                            Mit <span class="border border-[#1f93b4] text-[#1f93b4] px-2 py-0.5 rounded text-xs font-bold">Rollen mischen</span> 
                            kannst du die Rollen neu auslosen, <strong>ohne</strong> die Gruppenzusammensetzung zu verändern.
                        </p>
                    </section>

                    <section>
                        <h3 class="text-lg font-bold text-[#1f93b4] mb-2 border-b border-gray-200 pb-1">3. Manuelle Zuweisung (Profi-Funktion)</h3>
                        <p class="mb-2 text-sm leading-relaxed">
                            Um bestimmte Konstellationen (z.B. Leistungsdifferenzierung oder Konflikte) zu steuern, kannst du das Textfeld direkt programmieren:
                        </p>
                        <ul class="list-disc pl-5 text-sm space-y-1 mb-2">
                            <li><strong>Gruppenzuweisung:</strong> Schreibe ein <code>#</code> gefolgt von der Gruppennummer hinter den Namen (z.B. <code>Anja #1</code>).</li>
                            <li><strong>Rollenzuweisung:</strong> Schreibe die Rolle in Klammern hinter den Namen (z.B. <code>Berta (Joker)</code>).</li>
                        </ul>
                        <div class="bg-gray-100 p-3 rounded-md border border-gray-300 font-mono text-xs text-gray-800">
                            <strong>Beispiel für das Textfeld:</strong><br>
                            Anja #1 (🗣️ Vortrag, Joker)<br>
                            Berta #1<br>
                            Claus #2
                        </div>
                        <p class="mt-2 text-sm leading-relaxed">
                            Klicke anschließend auf <span class="bg-gray-200 border border-gray-300 px-2 py-0.5 rounded text-xs font-bold">Übernehmen ↓</span>. 
                            Alle Personen <em>ohne</em> Nummern werden automatisch den kleinsten Gruppen zugelost.
                        </p>
                    </section>

                    <section>
                        <h3 class="text-lg font-bold text-[#1f93b4] mb-2 border-b border-gray-200 pb-1">4. Synchronisation & Export</h3>
                        <ul class="list-disc pl-5 text-sm space-y-2">
                            <li>
                                <strong>Namen korrigieren:</strong> Klicke in den farbigen Gruppenkarten direkt auf einen Namen, um ihn zu ändern.
                            </li>
                            <li>
                                <strong>↑ Ins Textfeld:</strong> Wandelt deine aktuellen Gruppenkarten in den Text-Code (mit # und Klammern) um, 
                                damit du ihn bearbeiten kannst.
                            </li>
                            <li>
                                <strong>In Tafel einfügen:</strong> Überträgt die visuelle Gruppendarstellung als formatierte Tabelle direkt in deinen Texteditor, 
                                damit du sie abspeichern oder an die Wand werfen kannst.
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.dom.modal = modal;
        this.dom.closeBtn = modal.querySelector('#btn-close-group-help');

        this.bindEvents();
    },

    bindEvents: function() {
        this.dom.closeBtn.addEventListener('click', () => this.schliessen());
        
        // Klick außerhalb des Modals schließt es ebenfalls
        this.dom.modal.addEventListener('click', (e) => {
            if (e.target === this.dom.modal) {
                this.schliessen();
            }
        });
    },

    oeffnen: function() {
        if (!this.dom.modal) this.createUI();
        this.dom.modal.classList.remove('hidden');
    },

    schliessen: function() {
        if (this.dom.modal) {
            this.dom.modal.classList.add('hidden');
        }
    }
};

// Automatisch initialisieren
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => HilfeGruppeModul.init());
} else {
    HilfeGruppeModul.init();
}