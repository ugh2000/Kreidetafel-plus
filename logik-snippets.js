/**
 * MODUL: logik-snippets.js
 * Enthält die Programmlogik für interaktive Snippets (Timer, Würfel, Ampel, Counter).
 * Wird von logik.js gesteuert.
 */
const SnippetLogicModul = {
    tickerInterval: null,

    // Startet den globalen Ticker für Uhren
    init: function() {
        console.log("SnippetLogicModul gestartet.");
        if (this.tickerInterval) clearInterval(this.tickerInterval);
        this.tickerInterval = setInterval(() => this.tick(), 1000);
    },

    // Generiert das HTML für den URL-Timer (Aufgabengestalter)
    getTimerHtml: function(remainingSeconds, endStr) {
        let timerHtml = '';
        
        // Versuche das Template aus snippets.js zu holen
        if (typeof SnippetModul !== 'undefined') {
            const allSnips = SnippetModul.getSnippetListe();
            const timerSnip = allSnips.find(s => s.title.includes('Timer (Interaktiv)'));
            
            if (timerSnip) {
                timerHtml = timerSnip.code;
                timerHtml = timerHtml.replace(/data-time="\d+"/, `data-time="${remainingSeconds}"`);
                
                const m = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
                const s = (remainingSeconds % 60).toString().padStart(2, '0');
                
                timerHtml = timerHtml.replace(/>\d{2}:\d{2}</, `>${m}:${s}<`);
                timerHtml = timerHtml.replace(/data-active="false"/, 'data-active="true"'); // Sofort start
                timerHtml = timerHtml.replace(/>Start</, '>Stop<');
                timerHtml = timerHtml.replace(/#facc15/, '#86efac');
                
                // Info anfügen
                const timeInfo = `<span style="margin-left:8px; font-size:0.8em; color:#854d0e;">(bis ${endStr})</span>`;
                timerHtml = timerHtml.replace('</div>', `${timeInfo}</div>`);
            }
        }

        // Fallback
        if (!timerHtml) {
            const m = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
            const s = (remainingSeconds % 60).toString().padStart(2, '0');
            timerHtml = `<div class="live-timer" contenteditable="false" data-time="${remainingSeconds}" data-active="true" style="padding:8px; border:2px solid #eab308; background:#fefce8; border-radius:6px; display:inline-block; font-weight:bold; color:#854d0e; font-family:monospace;">⏱️ ${m}:${s} (Abgabe: ${endStr})</div><p>&nbsp;</p>`;
        }
        
        return timerHtml;
    },

    // Der Herzschlag für Uhren und Timer
    tick: function() {
        // 1. Update in der VORSCHAU (DOM)
        this.updateTimeElements(document);

        // 2. Update im EDITOR (Iframe)
        if (typeof tinymce !== 'undefined' && tinymce.activeEditor && !tinymce.activeEditor.isHidden()) {
            const doc = tinymce.activeEditor.getDoc();
            if (doc) {
                this.updateTimeElements(doc);
            }
        }
    },

    updateTimeElements: function(root) {
        // Analog-Uhren
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

        // Timer
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
                const ctrl = timer.querySelector('.timer-control');
                if(ctrl) {
                    ctrl.textContent = "Ende";
                    ctrl.style.background = "#fca5a5";
                }
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

    // --- INTERAKTIONS-HANDLER ---
    handleInteraction: function(e, editor) {
        if (e.button !== 0) return;
        
        const target = e.target;
        
        // Helper
        const intercept = () => {
            e.preventDefault();
            e.stopPropagation();
            if (editor) e.stopImmediatePropagation();
            if (editor) editor.setDirty(true);
        };

        // 1. TIMER STEUERUNG
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
                } 
                else if (target.closest('.timer-btn-add')) {
                    const addAmount = parseInt(target.getAttribute('data-add'), 10);
                    let currentTime = parseInt(container.getAttribute('data-time'), 10);
                    currentTime += addAmount;
                    if (currentTime < 0) currentTime = 0;
                    container.setAttribute('data-time', currentTime);
                    this.renderTimerDisplay(container, currentTime);
                } 
                else if (target.closest('.timer-reset')) {
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
        
        // 2. PUNKTEZÄHLER
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

        // 3. WÜRFEL
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
                if (editor) editor.setDirty(true);
            }, 200);
            return;
        }

        // 4. AMPEL
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
                if (editor) editor.setDirty(true);
                return;
            }
        }

        // 5. SPOILER
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
                    if (editor) editor.setDirty(true);
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

        // 6. GLOCKE
        const bell = target.closest('.live-bell');
        if (bell) {
            intercept();
            const soundPath = bell.getAttribute('data-sound') || 'sound/freesound_community-bell-chord1-83260.mp3';
            const audio = new Audio(soundPath);
            audio.play().catch(err => {
                console.log("Audio Fehler:", err);
                alert("Ton konnte nicht abgespielt werden. Bitte prüfe, ob der Ordner 'sound' existiert.");
            });
            bell.style.transform = 'scale(0.95)';
            setTimeout(() => { if(bell) bell.style.transform = 'scale(1)'; }, 150);
            return;
        }
    }
};