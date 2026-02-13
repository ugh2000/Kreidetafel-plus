/**
 * MODUL: korrektur.js
 * Stellt Werkzeuge für Lehrer bereit.
 * IDs wurden vereinfacht und standardisiert, um Konflikte zu vermeiden.
 */
const KorrekturModul = {
    init: function(editor) {
        console.log("KorrekturModul: Registriere Funktionen...");

        // 1. FORMATE (Definiert, wie der Text aussieht)
        // Wichtig: Wir registrieren diese SOFORT, nicht erst bei 'init'
        editor.on('PreInit', () => {
            editor.formatter.register('fmt_strike', { inline: 'span', styles: { 'text-decoration': 'line-through', 'color': '#DC2626', 'text-decoration-color': '#DC2626' } });
            editor.formatter.register('fmt_green', { inline: 'span', styles: { 'color': '#16A34A', 'font-weight': 'bold' } });
            editor.formatter.register('fmt_mark', { inline: 'span', styles: { 'background-color': '#FEF08A', 'color': '#000000' } });
            editor.formatter.register('fmt_red', { inline: 'span', styles: { 'color': '#DC2626' } });
        });

        // 2. ICONS (Eigene SVG Icons)
        editor.ui.registry.addIcon('ic_strike', '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 12h14" stroke="currentColor" stroke-width="2"/><path d="M12 5l-7 14h14l-7-14z" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5"/></svg>'); 
        editor.ui.registry.addIcon('ic_plus', '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>');
        editor.ui.registry.addIcon('ic_mark', '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 2l-2 2h4l-2-2z M10 4h4v10h-4z M8 14h8v2H8z" fill="currentColor"/></svg>');
        editor.ui.registry.addIcon('ic_check', '<svg width="24" height="24" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>');
        editor.ui.registry.addIcon('ic_cross', '<svg width="24" height="24" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>');

        // 3. BUTTONS (Für Toolbar & Quickbar)
        // Streichen (Rot)
        editor.ui.registry.addToggleButton('btn_strike', {
            icon: 'ic_strike',
            tooltip: 'Löschen (Rot)',
            onAction: () => editor.execCommand('mceToggleFormat', false, 'fmt_strike'),
            onSetup: (api) => editor.formatter.formatChanged('fmt_strike', (state) => api.setActive(state))
        });

        // Neu (Grün)
        editor.ui.registry.addToggleButton('btn_green', {
            icon: 'ic_plus',
            tooltip: 'Neu/Korrektur (Grün)',
            onAction: () => editor.execCommand('mceToggleFormat', false, 'fmt_green'),
            onSetup: (api) => editor.formatter.formatChanged('fmt_green', (state) => api.setActive(state))
        });

        // Marker (Gelb)
        editor.ui.registry.addToggleButton('btn_mark', {
            icon: 'ic_mark',
            tooltip: 'Markieren (Gelb)',
            onAction: () => editor.execCommand('mceToggleFormat', false, 'fmt_mark'),
            onSetup: (api) => editor.formatter.formatChanged('fmt_mark', (state) => api.setActive(state))
        });

        // Haken (Einfügen)
        editor.ui.registry.addButton('btn_check', {
            icon: 'ic_check',
            tooltip: 'Haken einfügen',
            onAction: () => editor.insertContent('✅')
        });

        // Kreuz (Einfügen)
        editor.ui.registry.addButton('btn_cross', {
            icon: 'ic_cross',
            tooltip: 'Kreuz einfügen',
            onAction: () => editor.insertContent('❌')
        });

        // 4. KONTEXTMENÜ ITEMS (Rechtsklick)
        // Diese brauchen TEXT, damit man im Menü lesen kann, was sie tun.
        editor.ui.registry.addMenuItem('mnu_red', { 
            text: 'Rot schreiben', 
            icon: 'textcolor', 
            onAction: () => editor.execCommand('mceToggleFormat', false, 'fmt_red') 
        });

        editor.ui.registry.addMenuItem('mnu_strike', { 
            text: 'Streichen (Rot)', 
            icon: 'ic_strike', 
            onAction: () => editor.execCommand('mceToggleFormat', false, 'fmt_strike') 
        });

        editor.ui.registry.addMenuItem('mnu_green', { 
            text: 'Korrektur (Grün)', 
            icon: 'ic_plus', 
            onAction: () => editor.execCommand('mceToggleFormat', false, 'fmt_green') 
        });

        editor.ui.registry.addMenuItem('mnu_mark', { 
            text: 'Markieren (Gelb)', 
            icon: 'ic_mark', 
            onAction: () => editor.execCommand('mceToggleFormat', false, 'fmt_mark') 
        });
        
        editor.ui.registry.addMenuItem('mnu_check', { 
            text: 'Haken (✅)', 
            icon: 'ic_check', 
            onAction: () => editor.insertContent('✅') 
        });

        editor.ui.registry.addMenuItem('mnu_cross', { 
            text: 'Kreuz (❌)', 
            icon: 'ic_cross', 
            onAction: () => editor.insertContent('❌') 
        });
    }
};