/**
 * MODUL: editorUI.js
 * Verwaltet die Registrierung der grafischen Elemente für TinyMCE.
 */
const EditorUIModul = {
    
    getMathItemsString: function() {
        if (typeof SnippetModul === 'undefined') return 'help';
        const mathCats = SnippetModul.getMathKategorien();
        return Object.keys(mathCats).map((_, idx) => `mathcat_${idx}`).join(' ');
    },

    getSnippetItemsString: function() {
        if (typeof SnippetModul === 'undefined') return 'help';
        const snippets = SnippetModul.getSnippetListe();
        let items = [];
        snippets.forEach((snip, index) => {
            items.push(`snip_${index}`);
            if (snip.hasSeparator) items.push('|');
        });
        return items.join(' ');
    },

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
                { type: 'menuitem', text: '100% (Std.)', onAction: () => setZoom(1) },
                { type: 'menuitem', text: '150%', onAction: () => setZoom(1.5) },
                { type: 'menuitem', text: '200%', onAction: () => setZoom(2) }
            ]
        });
    },

    registerDeleteAll: function(editor) {
        const action = () => {
            if (confirm("Ganze Tafel löschen?")) {
                editor.resetContent('');
                if (editor.plugins.autosave) editor.plugins.autosave.removeDraft();
            }
        };
        editor.ui.registry.addButton('deleteAll', { icon: 'remove', tooltip: 'Alles löschen', onAction: action });
        editor.ui.registry.addMenuItem('deleteAll', { text: 'Alles löschen', icon: 'remove', onAction: action });
    },

    registerToggles: function(editor) {
        // --- VOICE ---
        editor.ui.registry.addToggleMenuItem('toggleVoice', {
            text: 'Vorlesen anzeigen',
            onAction: () => { if (typeof VoiceModul !== 'undefined') VoiceModul.toggle(); }
        });
        // Toolbar Button hinzufügen (WICHTIG für die Anzeige!)
        editor.ui.registry.addButton('toggleVoice', {
            icon: 'comment',
            tooltip: 'Vorlesen',
            onAction: () => { if (typeof VoiceModul !== 'undefined') VoiceModul.toggle(); }
        });

        // --- MATH ---
        editor.ui.registry.addToggleMenuItem('toggleMath', {
            text: 'Mathe-Vorschau anzeigen',
            onAction: () => { if (typeof MathModul !== 'undefined') MathModul.toggle(); }
        });
        // Toolbar Button hinzufügen (WICHTIG!)
        editor.ui.registry.addButton('toggleMath', {
            icon: 'non-breaking',
            tooltip: 'Mathe-Vorschau',
            onAction: () => { if (typeof MathModul !== 'undefined') MathModul.toggle(); }
        });
    },

    registerSnippetsAndMath: function(editor) {
        if (typeof SnippetModul === 'undefined') return;
        
        SnippetModul.getSnippetListe().forEach((snip, index) => {
            editor.ui.registry.addMenuItem(`snip_${index}`, {
                text: snip.title,
                onAction: () => {
                    const content = (typeof Logik !== 'undefined') ? Logik.processSnippetContent(snip.code) : snip.code;
                    editor.insertContent(content);
                }
            });
        });

        const mathCats = SnippetModul.getMathKategorien();
        Object.keys(mathCats).forEach((catName, idx) => {
            const items = mathCats[catName];
            editor.ui.registry.addNestedMenuItem(`mathcat_${idx}`, {
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