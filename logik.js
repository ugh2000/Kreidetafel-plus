console.log("Skript logik.js wurde geladen.");

const Logik = {
    config: {
        editorSelector: '#tafel-editor'
    },

    tickerInterval: null,

    debug: function(msg) {
        const el = document.getElementById('debug-console');
        if(el) {
            const time = new Date().toLocaleTimeString();
            el.textContent = `[${time}] ${msg}`;
            if(msg.includes('FEHLER') || msg.includes('fehlt') || msg.includes('FATAL')) {
                el.style.backgroundColor = '#7f1d1d';
            } else {
                el.style.backgroundColor = '#004f62';
            }
        }
        console.log(`[Logik] ${msg}`);
    },

    start: function() {
        this.debug("System startet...");
        
        if (typeof MenuZeileModul !== 'undefined') MenuZeileModul.init();
        
        if (typeof SnippetModul === 'undefined') {
            console.error("KRITISCH: SnippetModul fehlt.");
            this.debug("KRITISCH: snippets.js nicht geladen!");
        }

        this.loadEditor();
        
        document.addEventListener('mousedown', (e) => {
            if (e.target.closest('#math-preview-container') || e.target.closest('#boardModal')) {
                this.handleInteraction(e, null);
            }
        });

        this.startTicker();
    },

    startTicker: function() {
        if (this.tickerInterval) clearInterval(this.tickerInterval);
        this.tickerInterval = setInterval(() => this.tick(), 1000);
    },

    tick: function() {
        this.updateTimeElements(document);
        if (tinymce.activeEditor && !tinymce.activeEditor.isHidden()) {
            const doc = tinymce.activeEditor.getDoc();
            if (doc) {
                this.updateTimeElements(doc);
            }
        }
    },

    updateTimeElements: function(root) {
        const clocks = root.querySelectorAll('.live-clock');
        if (clocks.length > 0) {
            const now = new Date();
            const sec = now.getSeconds();
            const min = now.getMinutes();
            const hour = now.getHours();
            const secDeg = ((sec / 60) * 360);
            const minDeg = ((min / 60) * 360) + ((sec/60)*6);
            const hourDeg = ((hour / 12) * 360) + ((min/60)*30);

            clocks.forEach(clock => {
                const elSec = clock.querySelector('.clock-sec');
                const elMin = clock.querySelector('.clock-min');
                const elHour = clock.querySelector('.clock-hour');
                if (elSec) elSec.style.transform = `rotate(${secDeg}deg)`;
                if (elMin) elMin.style.transform = `rotate(${minDeg}deg)`;
                if (elHour) elHour.style.transform = `rotate(${hourDeg}deg)`;
            });
        }

        const timers = root.querySelectorAll('.live-timer[data-active="true"]');
        timers.forEach(timer => {
            let timeLeft = parseInt(timer.getAttribute('data-time'), 10);
            if (timeLeft > 0) {
                timeLeft--;
                timer.setAttribute('data-time', timeLeft);
                this.renderTimerDisplay(timer, timeLeft);
            } else {
                timer.setAttribute('data-active', 'false');
                timer.style.backgroundColor = '#fee2e2'; 
                timer.style.borderColor = '#ef4444';
            }
        });
    },

    renderTimerDisplay: function(timerElement, seconds) {
        const display = timerElement.querySelector('.timer-display');
        if (!display) return;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        display.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    },

    handleInteraction: function(e, editor) {
        if (e.button !== 0) return; 
        const target = e.target;

        const intercept = () => {
            e.preventDefault();
            e.stopPropagation();
            if (editor) e.stopImmediatePropagation();
            if (editor) editor.setDirty(true);
        };

        const timerBtn = target.closest('.timer-control') || target.closest('.timer-btn-add') || target.closest('.timer-reset');
        if (timerBtn) {
            const container = target.closest('.live-timer');
            if (container) {
                intercept();
                if (target.closest('.timer-control')) {
                    const isActive = container.getAttribute('data-active') === 'true';
                    if (isActive) {
                        container.setAttribute('data-active', 'false');
                        target.textContent = "Start";
                        target.style.background = "#facc15"; 
                        target.style.color = "#000";
                    } else {
                        container.setAttribute('data-active', 'true');
                        target.textContent = "Stop";
                        target.style.background = "#86efac";
                        container.style.backgroundColor = '#fefce8'; 
                        container.style.borderColor = '#facc15';
                    }
                } else if (target.closest('.timer-btn-add')) {
                    const addAmount = parseInt(target.getAttribute('data-add'), 10);
                    let currentTime = parseInt(container.getAttribute('data-time'), 10);
                    currentTime += addAmount;
                    if (currentTime < 0) currentTime = 0;
                    container.setAttribute('data-time', currentTime);
                    this.renderTimerDisplay(container, currentTime);
                } else if (target.closest('.timer-reset')) {
                    container.setAttribute('data-active', 'false');
                    const ctrl = container.querySelector('.timer-control');
                    if(ctrl) { ctrl.textContent = "Start"; ctrl.style.background = "#facc15"; }
                    container.setAttribute('data-time', 0);
                    this.renderTimerDisplay(container, 0);
                    container.style.backgroundColor = '#fefce8'; 
                    container.style.borderColor = '#facc15';
                }
                return;
            }
        }
        
        const btnPlus = target.closest('.cnt-plus');
        const btnMinus = target.closest('.cnt-minus');
        if (btnPlus || btnMinus) {
            const container = target.closest('.live-counter');
            if (container) {
                intercept();
                let count = parseInt(container.getAttribute('data-count'), 10) || 0;
                count += btnPlus ? 1 : -1;
                if (count < 0) count = 0;
                container.setAttribute('data-count', count);
                const display = container.querySelector('.cnt-val');
                if (display) display.textContent = count;
                return;
            }
        }

        const dice = target.closest('.live-dice');
        if (dice) {
            intercept();
            if(dice.getAttribute('data-rolling') === 'true') return;
            dice.setAttribute('data-rolling', 'true');
            dice.textContent = '...';
            dice.style.transform = 'scale(0.9)';
            setTimeout(() => {
                const result = Math.floor(Math.random() * 6) + 1;
                const diceChars = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
                dice.textContent = diceChars[result - 1] || result;
                dice.style.transform = 'scale(1)';
                dice.removeAttribute('data-rolling');
            }, 200);
            return;
        }

        const light = target.closest('.light');
        if (light) {
            const container = light.closest('.live-traffic-light');
            if (container) {
                intercept();
                const lights = container.querySelectorAll('.light');
                const currentOpacity = light.style.opacity;
                lights.forEach(l => l.style.opacity = '0.3');
                if (currentOpacity === '0.3' || currentOpacity === '') {
                    light.style.opacity = '1.0';
                }
                return;
            }
        }

        const spoiler = target.closest('.live-spoiler');
        if (spoiler) {
            intercept();
            if (e.shiftKey) {
                const oldText = spoiler.textContent;
                const newText = prompt("Neuer Text für Spoiler:", oldText);
                if (newText !== null) {
                    spoiler.textContent = newText;
                    spoiler.style.backgroundColor = '#000';
                    spoiler.style.color = '#000';
                }
                return;
            }
            const currentBg = spoiler.style.backgroundColor;
            if (currentBg === 'transparent' || currentBg === 'rgba(0, 0, 0, 0)') {
                spoiler.style.backgroundColor = '#000';
                spoiler.style.color = '#000';
            } else {
                spoiler.style.backgroundColor = 'transparent';
                spoiler.style.color = 'inherit';
            }
            return;
        }

        const bell = target.closest('.live-bell');
        if (bell) {
            intercept();
            const soundPath = bell.getAttribute('data-sound') || 'sound/freesound_community-bell-chord1-83260.mp3';
            const audio = new Audio(soundPath);
            audio.play().catch(err => {
                console.log("Audio Fehler:", err);
                alert("Ton konnte nicht abgespielt werden. Bitte prüfe, ob die Datei im Ordner 'sound' existiert: " + soundPath);
            });
            bell.style.transform = 'scale(0.95)';
            setTimeout(() => {
                if(bell) bell.style.transform = 'scale(1)';
            }, 150);
            return;
        }
    },

    processSnippetContent: function(content) {
        const now = new Date();
        const dateStr = now.toLocaleDateString('de-DE');
        const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

        return content
            .replace(/__DATUM__/g, dateStr)
            .replace(/__UHRZEIT__/g, timeStr)
            .replace(/__SKIZZE__/g, '<div style="border:2px dashed #ccc; height:200px; display:flex; align-items:center; justify-content:center; color:#888;">Hier Skizze (Freihand)</div><p>&nbsp;</p>');
    },

    getURLParameter: function(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    },

    loadEditor: function() {
        if (typeof tinymce === 'undefined') {
            this.debug("FATAL: TinyMCE nicht gefunden!");
            console.error("Fehler: TinyMCE Bibliothek nicht gefunden.");
            return;
        }

        const urlContent = this.getURLParameter('text');
        const urlLimit = this.getURLParameter('limit');
        const urlTarget = this.getURLParameter('target');

        if (urlLimit && typeof MenuZeileModul !== 'undefined') {
            MenuZeileModul.setWordLimit(urlLimit);
        }

        let mathItemsStr = '';
        let snippetItemsStr = '';
        const registeredSnippets = []; 
        const registeredMathCats = [];

        if (typeof SnippetModul !== 'undefined') {
            const snippets = SnippetModul.getSnippetListe();
            snippets.forEach((snip, index) => {
                const id = 'snip_' + index;
                snippetItemsStr += (snippetItemsStr ? ' ' : '') + id;
                if (snip.hasSeparator) snippetItemsStr += ' |';
                registeredSnippets.push({ id: id, text: snip.title, tooltip: snip.tooltip, code: snip.code });
            });

            const mathCats = SnippetModul.getMathKategorien();
            Object.keys(mathCats).forEach((catName, idx) => {
                const catId = 'mathcat_' + idx;
                mathItemsStr += (mathItemsStr ? ' ' : '') + catId;
                registeredMathCats.push({ id: catId, text: catName, items: mathCats[catName] });
            });
        }
        
        if (!mathItemsStr) mathItemsStr = 'help';
        if (!snippetItemsStr) snippetItemsStr = 'help';

        this.debug("Initialisiere TinyMCE...");

        const myPlugins = [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 
            'autosave', 'quickbars', 'emoticons' 
        ];
        const myQuickbarsSelection = 'bold italic | corrDel corrAdd corrMark | corrErrors corrComment'; 

        tinymce.init({
            selector: this.config.editorSelector,
            license_key: 'gpl', 
            promotion: false,
            height: '100%',
            resize: false, 
            menubar: 'file edit view insert format tools table help mathe snippets',
            
            // HIER IST DIE KORREKTUR: Wir nutzen die lokalen Strings statt EditorUIModul
            menu: {
                file: { title: 'Datei', items: 'deleteAll newdocument restoredraft | preview | print' },
                edit: { title: 'Bearbeiten', items: 'undo redo | cut copy paste | selectall | searchreplace' },
                view: { title: 'Ansicht', items: 'zoomMenu | toggleMath toggleVoice | code | visualaid visualchars visualblocks | spellchecker | preview fullscreen' },
                insert: { title: 'Einfügen', items: 'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor' },
                format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | removeformat' },
                tools: { title: 'Werkzeuge', items: 'spellchecker spellcheckerlanguage | code wordcount' },
                table: { title: 'Tabelle', items: 'inserttable | cell row column | tableprops deletetable' },
                help: { title: 'Hilfe', items: 'help' },
                mathe: { title: 'Mathe', items: mathItemsStr }, 
                snippets: { title: 'Snippets', items: snippetItemsStr }
            },
            
            contextmenu: 'ctxCorrDel ctxCorrAdd ctxCorrComment | ctxMarkX ctxMarkCheck | cut copy paste | toggleVoice toggleMath | link table',

            language: 'de', 
            language_url: './tinymce/langs/de.js', 

            plugins: myPlugins,
            quickbars_selection_toolbar: myQuickbarsSelection,
            quickbars_insert_toolbar: false, 

            toolbar: 'deleteAll toggleVoice restoredraft | undo redo | searchreplace | blocks | ' +
                'corrDel corrAdd corrMark corrRed | bold italic strikethrough forecolor backcolor emoticons | alignleft aligncenter | ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            
            autosave_ask_before_unload: true,
            autosave_interval: '30s',
            autosave_prefix: '{path}{query}-{id}-',
            autosave_restore_when_empty: true, 

            content_css: 'editor-style.css',
            
            setup: (editor) => {
                if (typeof KorrekturModul !== 'undefined') KorrekturModul.init(editor);
                if (typeof EditorUIModul !== 'undefined') EditorUIModul.init(editor);
                
                editor.on('mousedown', (e) => {
                    this.handleInteraction(e, editor);
                });

                editor.on('click', (e) => {
                    const target = e.target;
                    const summary = target.closest('summary');
                    if (summary) {
                         const details = summary.parentElement;
                         if (target.classList.contains('accordion-trigger')) {
                             e.preventDefault();
                             e.stopPropagation();
                             if (details.hasAttribute('open')) {
                                details.removeAttribute('open');
                                target.textContent = '👉'; 
                             } else {
                                details.setAttribute('open', '');
                                target.textContent = '👇'; 
                             }
                         }
                    }
                    
                    if (target.closest('.live-counter') || target.closest('.live-dice') || target.closest('.live-traffic-light') || target.closest('.live-spoiler') || target.closest('.timer-control') || target.closest('.timer-btn-add') || target.closest('.timer-reset') || target.closest('.live-bell')) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });

                editor.on('init', function(e) {
                    console.log('TinyMCE Editor ist vollständig bereit.');
                    if (typeof SkizzeModul !== 'undefined') SkizzeModul.init(editor);
                    if (typeof GruppenModul !== 'undefined') GruppenModul.init(editor); 
                    if (typeof UhrModul !== 'undefined') UhrModul.init(editor);
                    if (typeof VoiceModul !== 'undefined') VoiceModul.init(editor);
                    if (typeof MathModul !== 'undefined') MathModul.init(editor);

                    if (urlContent) {
                        setTimeout(() => {
                            let finalHtml = '';
                            if (urlTarget) {
                                let timerHtml = '';
                                const targetTime = parseInt(urlTarget);
                                const now = Date.now();
                                let remainingSeconds = Math.floor((targetTime - now) / 1000);
                                if (remainingSeconds < 0) remainingSeconds = 0;

                                if (typeof SnippetModul !== 'undefined') {
                                    const allSnips = SnippetModul.getSnippetListe();
                                    const timerSnip = allSnips.find(s => s.title.includes('Timer (Interaktiv)'));
                                    if (timerSnip) {
                                        timerHtml = timerSnip.code;
                                        timerHtml = timerHtml.replace(/data-time="\d+"/, `data-time="${remainingSeconds}"`);
                                        const m = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
                                        const s = (remainingSeconds % 60).toString().padStart(2, '0');
                                        timerHtml = timerHtml.replace(/>\d{2}:\d{2}</, `>${m}:${s}<`);
                                    }
                                }
                                if (!timerHtml) {
                                    const m = Math.floor(remainingSeconds / 60);
                                    const s = (remainingSeconds % 60).toString().padStart(2, '0');
                                    const endDate = new Date(now + remainingSeconds * 1000);
                                    const endStr = endDate.toLocaleTimeString('de-DE', {hour: '2-digit', minute:'2-digit'});
                                    timerHtml = `<div class="live-timer" contenteditable="false" data-time="${remainingSeconds}" data-active="false" style="padding:8px; border:2px solid #eab308; background:#fefce8; border-radius:6px; display:inline-block; font-weight:bold; color:#854d0e;">⏱️ Abgabe in ${m}:${s} min, also um ${endStr} Uhr</div><p>&nbsp;</p>`;
                                }
                                finalHtml += timerHtml;
                            }

                            const taskHtml = `
                                <div style="background-color: #fdfdfd; border-left: 5px solid #004f62; padding: 15px 20px; margin: 10px 0 25px 0; box-shadow: 0 2px 6px rgba(0,0,0,0.08); border-radius: 0 4px 4px 0; font-family: 'Calibri', 'Segoe UI', sans-serif;">
                                    <h3 style="margin-top: 0; margin-bottom: 12px; color: #004f62; font-size: 1.2em; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; font-weight: bold;">
                                        <span style="margin-right:8px;">📝</span> Aufgabenstellung
                                    </h3>
                                    <div style="color: #333; line-height: 1.6; font-size: 1.1em;">
                                        ${urlContent}
                                    </div>
                                </div>
                                <p>&nbsp;</p>
                            `;
                            finalHtml += taskHtml;
                            editor.setContent(finalHtml);
                        }, 500);
                    }
                });

                editor.on('input keyup change SetContent', function(e) {
                    const wordCount = editor.plugins.wordcount.body.getWordCount();
                    if (typeof MenuZeileModul !== 'undefined') {
                        MenuZeileModul.updateWordCountDisplay(wordCount);
                    }
                });

                // HIER IST DIE 2. KORREKTUR: Wir registrieren die Buttons und Listen direkt wieder hier in der Logik, falls das UI Modul sie nicht gefangen hat.
                registeredSnippets.forEach(snip => {
                    editor.ui.registry.addMenuItem(snip.id, {
                        text: snip.text,
                        onAction: () => {
                            const content = Logik.processSnippetContent(snip.code);
                            editor.insertContent(content);
                        }
                    });
                });

                registeredMathCats.forEach(cat => {
                    editor.ui.registry.addNestedMenuItem(cat.id, {
                        text: cat.text,
                        getSubmenuItems: () => cat.items.map(m => ({
                            type: 'menuitem',
                            text: m.title,
                            onAction: () => editor.insertContent(m.content + ' ')
                        }))
                    });
                });
            }
        });
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Logik.start());
} else {
    Logik.start();
}