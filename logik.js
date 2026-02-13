/**
 * ZENTRALE STEUERUNG: logik.js
 * Synchronisiert SnippetLogicModul (Uhren, Timer), Shortcuts und URL-Parameter.
 */
const Logik = {
    config: {
        editorSelector: '#tafel-editor'
    },

    debug: function(msg, isError = false) {
        const el = document.getElementById('debug-console');
        if(el) {
            const line = document.createElement('div');
            line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
            if(isError) line.style.color = '#f87171';
            el.appendChild(line);
            el.scrollTop = el.scrollHeight;
        }
        console.log(`[Logik] ${msg}`);
    },

    start: function() {
        this.debug("System-Initialisierung gestartet...");
        if (typeof MenuZeileModul !== 'undefined') MenuZeileModul.init();
        
        // SnippetLogicModul ist das kombinierte Modul für Uhren/Interaktion
        if (typeof SnippetLogicModul !== 'undefined') {
            SnippetLogicModul.init();
        }
        
        this.loadEditor();
    },

    // --- SHORTCUT LOGIK ---
    checkShortcut: function(editor) {
        if (typeof ShortcutModul === 'undefined' || typeof SnippetModul === 'undefined') return false;

        const rng = editor.selection.getRng();
        if (rng.startContainer.nodeType === 3) {
            const textContent = rng.startContainer.textContent;
            const offset = rng.startOffset;
            const textBefore = textContent.slice(0, offset);
            
            const match = textBefore.match(/(##[\wäöü]+)$/i);

            if (match) {
                const keyword = match[1];
                const shortcut = ShortcutModul.getEntry(keyword);
                
                if (shortcut) {
                    const targetSnip = SnippetModul.getSnippetListe().find(s => s.title === shortcut.snippetTitle);

                    if (targetSnip) {
                        const rangeToSelect = rng.cloneRange();
                        rangeToSelect.setStart(rng.startContainer, offset - keyword.length);
                        rangeToSelect.setEnd(rng.startContainer, offset);
                        editor.selection.setRng(rangeToSelect);
                        
                        editor.insertContent(this.processSnippetContent(targetSnip.code));
                        this.debug("Shortcut ersetzt: " + keyword);
                        return true; 
                    }
                }
            }
        }
        return false;
    },

    processSnippetContent: function(content) {
        const now = new Date();
        return content
            .replace(/__DATUM__/g, now.toLocaleDateString('de-DE'))
            .replace(/__UHRZEIT__/g, now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }))
            .replace(/__SKIZZE__/g, '<div style="border:2px dashed #ccc; height:200px; display:flex; align-items:center; justify-content:center; color:#888; background:#fafafa; border-radius:4px;">Hier Skizze einfügen</div><p>&nbsp;</p>');
    },

    loadEditor: function() {
        if (typeof tinymce === 'undefined') return;

        const urlParams = new URLSearchParams(window.location.search);
        const urlContent = urlParams.get('text');
        const urlLimit = urlParams.get('limit');
        const urlTarget = urlParams.get('target');

        // Wortlimit an Menüzeile übertragen, falls vorhanden
        if (urlLimit && typeof MenuZeileModul !== 'undefined') {
            MenuZeileModul.setWordLimit(urlLimit);
        }

        const mathItems = (typeof EditorUIModul !== 'undefined') ? EditorUIModul.getMathItemsString() : 'help';
        const snipItems = (typeof EditorUIModul !== 'undefined') ? EditorUIModul.getSnippetItemsString() : 'help';

        tinymce.init({
            selector: this.config.editorSelector,
            license_key: 'gpl',
            promotion: false,
            height: '100%',
            menubar: 'file edit view insert format tools table help mathe snippets',
            menu: {
                mathe: { title: 'Mathe', items: mathItems },
                snippets: { title: 'Snippets', items: snipItems },
                view: { title: 'Ansicht', items: 'zoomMenu | toggleMath toggleVoice | code preview fullscreen' }
            },
            plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount autosave quickbars emoticons',
            
            contextmenu: 'ctxCorrStrike ctxCorrMarkRed | btn_check_add btn_cross_add | cut copy paste | link table',
            quickbars_selection_toolbar: 'bold italic strikethrough | btn_strike btn_green btn_mark_red | btn_check_add btn_cross_add btn_smiley_add btn_up_add btn_down_add',
            toolbar: 'deleteAll toggleVoice toggleMath restoredraft | undo redo | searchreplace | blocks | bold italic strikethrough | btn_strike btn_green btn_mark_red | alignleft aligncenter alignright | bullist numlist | removeformat | help',
            
            content_css: 'editor-style.css',
            
            setup: (editor) => {
                // UI-Buttons müssen sofort registriert werden
                if (typeof EditorUIModul !== 'undefined') EditorUIModul.init(editor);

                editor.on('init', () => {
                    this.debug("Editor bereit.");
                    
                    // Module initialisieren, die den fertigen Editor-Body benötigen
                    if (typeof KorrekturModul !== 'undefined') KorrekturModul.init(editor);
                    if (typeof SkizzeModul !== 'undefined') SkizzeModul.init(editor);
                    if (typeof GruppenModul !== 'undefined') GruppenModul.init(editor); 
                    if (typeof VoiceModul !== 'undefined') VoiceModul.init(editor);
                    if (typeof MathModul !== 'undefined') MathModul.init(editor);

                    // --- INHALT LADEN ---
                    if (urlContent) {
                        let finalHtml = '';
                        // Falls ein Timer-Ziel gesetzt ist, Timer-HTML generieren
                        if (urlTarget && typeof SnippetLogicModul !== 'undefined') {
                            const targetTimestamp = parseInt(urlTarget, 10);
                            const now = Date.now();
                            const diff = Math.floor((targetTimestamp - now) / 1000);
                            
                            const endStr = new Date(targetTimestamp).toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'});
                            finalHtml += SnippetLogicModul.getTimerHtml(Math.max(0, diff), endStr);
                        }
                        
                        finalHtml += `<div style="background:#fdfdfd; border-left:5px solid #004f62; padding:15px; margin-bottom:20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);"><h3>📝 Aufgabe</h3>${urlContent}</div><p>&nbsp;</p>`;
                        editor.setContent(finalHtml);
                    } else if (editor.getContent().length < 20 && typeof WelcomeModul !== 'undefined') {
                        editor.setContent(WelcomeModul.getHtml());
                    }
                });

                // Tasten-Events für Shortcuts
                editor.on('keydown', (e) => {
                    if ((e.key === ' ' || e.key === 'Enter') && this.checkShortcut(editor)) {
                        e.preventDefault(); 
                    }
                });

                // Interaktions-Logik für interaktive Elemente
                editor.on('mousedown', (e) => {
                    if (typeof SnippetLogicModul !== 'undefined') {
                        SnippetLogicModul.handleInteraction(e, editor);
                    }
                });
            }
        });
    }
};

Logik.start();