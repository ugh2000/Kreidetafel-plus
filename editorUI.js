/**
 * MODUL: editorUI.js
 * Kapselt die Registrierung von Editor-Buttons, Menüs und UI-Elementen.
 */
const EditorUIModul = {
    
    // --- Hilfsfunktionen für die Menü-Listen (wird von logik.js abgerufen) ---
    getMathItemsString: function() {
        if (typeof SnippetModul === 'undefined') return 'help';
        let str = '';
        const mathCats = SnippetModul.getMathKategorien();
        Object.keys(mathCats).forEach((catName, idx) => {
            str += (str ? ' ' : '') + 'mathcat_' + idx;
        });
        return str || 'help';
    },

    getSnippetItemsString: function() {
        if (typeof SnippetModul === 'undefined') return 'help';
        let str = '';
        const snippets = SnippetModul.getSnippetListe();
        snippets.forEach((snip, index) => {
            str += (str ? ' ' : '') + 'snip_' + index;
            if (snip.hasSeparator) str += ' |';
        });
        return str || 'help';
    },

    // --- Initialisierung der UI-Elemente im Editor ---
    init: function(editor) {
        console.log("EditorUIModul: Registriere UI-Elemente...");
        this.registerZoom(editor);
        this.registerDeleteAll(editor);
        this.registerToggles(editor);
        this.registerSnippetsAndMath(editor);
    },

    registerZoom: function(editor) {
        const setZoom = (value) => {
            const body = editor.getBody();
            if(body) body.style.zoom = value;
        };

        editor.ui.registry.addNestedMenuItem('zoomMenu', {
            text: 'Zoom',
            getSubmenuItems: () => [
                { type: 'menuitem', text: '50%', onAction: () => setZoom(0.5) },
                { type: 'menuitem', text: '75%', onAction: () => setZoom(0.75) },
                { type: 'menuitem', text: '100% (Standard)', onAction: () => setZoom(1) },
                { type: 'menuitem', text: '125%', onAction: () => setZoom(1.25) },
                { type: 'menuitem', text: '150%', onAction: () => setZoom(1.5) },
                { type: 'menuitem', text: '200%', onAction: () => setZoom(2) },
            ]
        });
    },

    registerDeleteAll: function(editor) {
        const deleteAllAction = function() {
            if (confirm("Möchtest du wirklich die gesamte Tafel löschen?\nDies leert auch den automatischen Speicher.")) {
                editor.resetContent('');
                if (editor.plugins.autosave) editor.plugins.autosave.removeDraft();
            }
        };

        editor.ui.registry.addButton('deleteAll', {
            icon: 'remove', 
            tooltip: 'Alles löschen',
            onAction: deleteAllAction
        });
        
        editor.ui.registry.addMenuItem('deleteAll', {
            text: 'Alles löschen',
            icon: 'remove',
            onAction: deleteAllAction
        });
    },

    registerToggles: function(editor) {
        // Toggle Voice
        editor.ui.registry.addToggleMenuItem('toggleVoice', {
            text: 'Vorlesen anzeigen',
            onAction: function (api) {
                const show = !api.isActive();
                api.setActive(show);
                if (typeof VoiceModul !== 'undefined') VoiceModul.toggle(show);
            }
        });
        editor.ui.registry.addButton('toggleVoice', {
            icon: 'comment', 
            tooltip: 'Vorlese-Modul',
            onAction: function () {
                if (typeof VoiceModul !== 'undefined') VoiceModul.toggle();
            }
        });

        // Toggle Math
        editor.ui.registry.addToggleMenuItem('toggleMath', {
            text: 'Mathe-Vorschau anzeigen',
            onAction: function (api) {
                const show = !api.isActive();
                api.setActive(show);
                if (typeof MathModul !== 'undefined') MathModul.toggle(show);
            }
        });
    },

    registerSnippetsAndMath: function(editor) {
        if (typeof SnippetModul === 'undefined') return;

        // Snippets ins Menü einhängen
        const snippets = SnippetModul.getSnippetListe();
        snippets.forEach((snip, index) => {
            editor.ui.registry.addMenuItem('snip_' + index, {
                text: snip.title,
                onAction: () => {
                    // Verweist auf die globale Logik-Funktion zum Einsetzen der Variablen
                    if (typeof Logik !== 'undefined') {
                        const content = Logik.processSnippetContent(snip.code);
                        editor.insertContent(content);
                    } else {
                        editor.insertContent(snip.code);
                    }
                }
            });
        });

        // Mathe-Kategorien ins Menü einhängen
        const mathCats = SnippetModul.getMathKategorien();
        Object.keys(mathCats).forEach((catName, idx) => {
            const items = mathCats[catName];
            editor.ui.registry.addNestedMenuItem('mathcat_' + idx, {
                text: catName,
                getSubmenuItems: () => items.map(m => ({
                    type: 'menuitem',
                    text: m.title,
                    onAction: () => editor.insertContent(m.content + ' ')
                }))
            });
        });
    }
};