/**
 * MODUL: korrektur.js
 * Verwaltet Korrektur-Formate, Icons und die Logik für Feedback-Symbole.
 */
const KorrekturModul = {
    init: function(editor) {
        if (!editor.formatter) return;

        console.log("KorrekturModul: Initialisiere erweiterte Korrekturwerkzeuge...");

        // 1. FORMATE REGISTRIEREN
        // Durchstreichen (Rot)
        editor.formatter.register('fmt_strike', { 
            inline: 'span', 
            styles: { 'text-decoration': 'line-through', 'color': '#DC2626' } 
        });
        // Neu/Grün
        editor.formatter.register('fmt_green', { 
            inline: 'span', 
            styles: { 'color': '#16A34A', 'font-weight': 'bold' } 
        });
        // Hervorheben (JETZT: Hellrot statt Gelb)
        editor.formatter.register('fmt_mark_red', { 
            inline: 'span', 
            styles: { 'background-color': '#fee2e2', 'border-radius': '2px' } 
        });

        // 2. HELPER: Symbol nach markiertem Text einfügen
        const appendSymbol = (symbol) => {
            const content = editor.selection.getContent({format: 'html'});
            // Wir fügen das Symbol nach dem HTML-Inhalt der Selektion ein
            editor.insertContent(content + ' ' + symbol);
        };

        // 3. ICONS (Neue Symbole für - und +)
        editor.ui.registry.addIcon('ic_strike_new', '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7l10 10M17 7L7 17"/></svg>'); // X-Symbol für Streichen
        editor.ui.registry.addIcon('ic_plus_new', '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>');

        // 4. BUTTONS REGISTRIEREN
        // Streichen
        editor.ui.registry.addButton('btn_strike', {
            icon: 'ic_strike_new',
            tooltip: 'Streichen (Rot)',
            onAction: () => editor.execCommand('mceToggleFormat', false, 'fmt_strike')
        });

        // Korrektur (Grün)
        editor.ui.registry.addButton('btn_green', {
            icon: 'ic_plus_new',
            tooltip: 'Neu/Korrektur (Grün)',
            onAction: () => editor.execCommand('mceToggleFormat', false, 'fmt_green')
        });

        // Markieren (Hellrot)
        editor.ui.registry.addButton('btn_mark_red', {
            icon: 'highlight-bg-color',
            tooltip: 'Hervorheben (Hellrot)',
            onAction: () => editor.execCommand('mceToggleFormat', false, 'fmt_mark_red')
        });

        // Feedback-Symbole (Additive Logik)
        editor.ui.registry.addButton('btn_check_add', { text: '✅', onAction: () => appendSymbol('✅') });
        editor.ui.registry.addButton('btn_cross_add', { text: '❌', onAction: () => appendSymbol('❌') });
        editor.ui.registry.addButton('btn_smiley_add', { text: '🙂', onAction: () => appendSymbol('🙂') });
        editor.ui.registry.addButton('btn_up_add', { text: '👍', onAction: () => appendSymbol('👍') });
        editor.ui.registry.addButton('btn_down_add', { text: '👎', onAction: () => appendSymbol('👎') });

        // 5. KONTEXTMENÜ-EINTRÄGE
        editor.ui.registry.addMenuItem('ctxCorrStrike', { text: 'Durchstreichen (Rot)', icon: 'ic_strike_new', onAction: () => editor.execCommand('mceToggleFormat', false, 'fmt_strike') });
        editor.ui.registry.addMenuItem('ctxCorrMarkRed', { text: 'Markieren (Hellrot)', icon: 'highlight-bg-color', onAction: () => editor.execCommand('mceToggleFormat', false, 'fmt_mark_red') });
    }
};