/**
 * MODUL: snippets.js
 * Enthält die Daten für Formeln und Textbausteine.
 * Format: Natives JavaScript-Array für maximale Stabilität.
 */
const SnippetModul = {
    
    // --- DATEN: MATHE ---
    mathData: {
        "Analysis": [
            { title: "Nullstellen", content: " §§f(x)=0§§ " },
            { title: "Ableitung", content: " §§f'(x)§§ " },
            { title: "Extrema (Notw.)", content: " §§f'(x)=0§§ " },
            { title: "Integral", content: " §§int_a^b f(x) dx§§ " }
        ],
        "Vektoren": [
            { title: "Vektor (3D)", content: " §§vec a = ((x_1),(x_2),(x_3))§§ " },
            { title: "Skalarprodukt", content: " §§vec a * vec b = 0§§ " },
            { title: "Ebene (Parameter)", content: " §§E: vec x = vec p + r * vec u + s * vec v§§ " }
        ],
        "Grundlagen": [
            { title: "Wurzel", content: " §§sqrt(x)§§ " },
            { title: "Bruch", content: " §§a/b§§ " },
            { title: "pq-Formel", content: " §§x_{1,2} = -p/2 +- sqrt((p/2)^2 - q)§§ " }
        ]
    },

    // --- DATEN: SNIPPETS ---
    snippetData: [
        { 
            title: "Skizze", 
            code: "__SKIZZE__", 
            tooltip: "Freihandzeichnung", 
            separator: false 
        },
        { 
            title: "Uhrzeit (Text)", 
            code: "__UHRZEIT__", 
            tooltip: "Fügt aktuelle Zeit ein", 
            separator: false 
        },
        { 
            title: "Datum (Text)", 
            code: "__DATUM__", 
            tooltip: "Fügt aktuelles Datum ein", 
            separator: true 
        },
        { 
            title: "Lernziele", 
            code: '<div style="background-color:#f0fdf4; border-left:4px solid #1f93b4; padding:12px; margin:10px 0; border-radius:0 4px 4px 0;"><strong style="color:#004f62;">🎯 Lernziele für heute:</strong><ul style="margin-bottom:0; padding-left:20px; margin-top:5px; color:#004f62;"><li>...</li><li>...</li></ul></div><p>&nbsp;</p>', 
            tooltip: "Lernziele-Box", 
            separator: false 
        },
        { 
            title: "Hausaufgabe", 
            code: '<div style="background-color:#eff6ff; border:1px solid #004f62; border-radius:8px; padding:15px; margin:10px 0;"><h4 style="margin:0 0 8px 0; color:#004f62;">🏠 Hausaufgabe</h4><p style="margin:0; color:#1f93b4;">Bis zum nächsten Mal:<br>S. 123 Nr. 1, 2</p></div><p>&nbsp;</p>', 
            tooltip: "Hausaufgaben-Box", 
            separator: false 
        },
        { 
            title: "Merke", 
            code: '<div style="background-color:#f8fbfc; border-left:4px solid #004f62; padding:12px; margin:10px 0; color:#004f62;"><strong>💡 Merke:</strong><br>Hier steht eine wichtige Regel oder Definition.</div><p>&nbsp;</p>', 
            tooltip: "Merke-Kasten", 
            separator: false 
        },
        { 
            title: "Wichtig", 
            code: '<div style="background-color:#fef2f2; border:1px solid #ef4444; color:#b91c1c; padding:10px; border-radius:4px; margin:10px 0; display:flex; gap:10px; align-items:center;"><span style="font-size:1.5em;">⚠️</span><div><strong>Achtung:</strong> Das ist prüfungsrelevant!</div></div><p>&nbsp;</p>', 
            tooltip: "Rote Warnbox", 
            separator: true 
        },
        { 
            title: "Akkordeon (Klapptext)", 
            code: '<details open="" style="border: 1px solid #e5e7eb; border-radius: 6px; margin: 10px 0; background: #ffffff; box-shadow: 0 1px 2px rgba(0,0,0,0.05);"><summary style="background: #f1f5f9; padding: 10px 15px; cursor: default; list-style: none; outline: none; display: flex; align-items: center;"><span class="accordion-trigger" contenteditable="false" style="margin-right: 10px; cursor: pointer; font-size: 1.2em; user-select: none;" title="Auf-/Zuklappen">👇</span><span style="font-weight: bold; cursor: text; flex-grow: 1; color: #004f62;">Titel (Hier editieren)</span></summary><div style="padding: 15px; border-top: 1px solid #e5e7eb; color: #4b5563;">Versteckter Inhalt...</div></details><p>&nbsp;</p>', 
            tooltip: "Aufklappbarer Bereich", 
            separator: false 
        },
        { 
            title: "Pro-Kontra", 
            code: '<table style="width:100%; border-collapse:collapse; margin:10px 0; border:1px solid #cbd5e1;"><thead><tr style="background:#f1f5f9;"><th style="border:1px solid #cbd5e1; padding:8px; width:50%; color:#004f62;">👍 Pro</th><th style="border:1px solid #cbd5e1; padding:8px; width:50%; color:#991b1b;">👎 Kontra</th></tr></thead><tbody><tr><td style="border:1px solid #cbd5e1; padding:8px; vertical-align:top;"><ul><li> </li></ul> </td><td style="border:1px solid #cbd5e1; padding:8px; vertical-align:top;"><ul><li> </li></ul> </td></tr></tbody></table><p>&nbsp;</p>', 
            tooltip: "Tabelle Pro/Kontra", 
            separator: false 
        },
        { 
            title: "Vokabeln", 
            code: '<table style="width:100%; border-collapse:collapse; margin:10px 0;"><thead style="background:#f8fafc; color:#004f62;"><tr><th style="border-bottom:2px solid #1f93b4; padding:8px; text-align:left;">Begriff</th><th style="border-bottom:2px solid #1f93b4; padding:8px; text-align:left;">Erklärung</th></tr></thead><tbody><tr><td style="padding:8px; border-bottom:1px solid #e2e8f0;">...</td><td style="padding:8px; border-bottom:1px solid #e2e8f0;">...</td></tr><tr><td style="padding:8px; border-bottom:1px solid #e2e8f0;">...</td><td style="padding:8px; border-bottom:1px solid #e2e8f0;">...</td></tr></tbody></table><p>&nbsp;</p>', 
            tooltip: "Vokabelliste", 
            separator: true 
        },
        { 
            title: "Checkliste", 
            code: '<ul style="list-style:none; padding:0; margin:10px 0;"><li><input type="checkbox"> Aufgabe gelesen</li><li><input type="checkbox"> Text markiert</li><li><input type="checkbox"> Fragen beantwortet</li></ul><p>&nbsp;</p>', 
            tooltip: "Abhak-Liste", 
            separator: false 
        },
        { 
            title: "Feedback", 
            code: '<div style="border:1px solid #e2e8f0; padding:10px; border-radius:8px; margin:10px 0;"><strong style="display:block; margin-bottom:5px; color:#004f62;">Kurzfeedback:</strong><table style="width:100%; border-collapse:collapse; font-size:0.9em;"><tr><td style="padding:5px; border-bottom:1px solid #eee;">Inhalt / Verständnis</td><td style="padding:5px; border-bottom:1px solid #eee; text-align:right;">🙂 😐 🙁</td></tr><tr><td style="padding:5px; border-bottom:1px solid #eee;">Sprachliche Richtigkeit</td><td style="padding:5px; border-bottom:1px solid #eee; text-align:right;">🙂 😐 🙁</td></tr><tr><td style="padding:5px; border-bottom:1px solid #eee;">Mitarbeit</td><td style="padding:5px; border-bottom:1px solid #eee; text-align:right;">🙂 😐 🙁</td></tr></table></div><p>&nbsp;</p>', 
            tooltip: "Feedback-Raster", 
            separator: false 
        },
        { 
            title: "Unterschrift", 
            code: '<div style="margin-top:40px; margin-bottom:20px;"><div style="border-top:1px solid #000; width:250px; padding-top:5px; font-size:0.8em; color:#555;">Ort, Datum / Unterschrift Erziehungsberechtigte</div></div><p>&nbsp;</p>', 
            tooltip: "Linie für Unterschrift", 
            separator: true 
        },
        { 
            title: "2-Spalten", 
            code: '<div style="display:flex; gap:20px; flex-wrap:wrap;"><div style="flex:1; min-width:200px;"><strong>Links</strong><br>Text hier...</div><div style="flex:1; min-width:200px;"><strong>Rechts</strong><br>Text hier...</div></div><p>&nbsp;</p>', 
            tooltip: "Spalten-Layout", 
            separator: false 
        },
        { 
            title: "Zitat", 
            code: '<blockquote style="border-left:4px solid #1f93b4; background:#f8fafc; margin:10px 0; padding:10px 15px; font-style:italic; color:#004f62;">„Das Zitat hier einfügen.“<footer style="margin-top:5px; font-size:0.8em; font-style:normal; color:#1f93b4;">— Quelle</footer></blockquote><p>&nbsp;</p>', 
            tooltip: "Zitatblock", 
            separator: false 
        },
        { 
            title: "JS Hello", 
            code: '<pre style="background:#1e1e1e; color:#dcdcdc; padding:10px; border-radius:5px; font-family:monospace; overflow-x:auto;"><code>console.log("Hallo Welt");</code></pre><p>&nbsp;</p>', 
            tooltip: "Code Block", 
            separator: false 
        },
        { 
            title: "Uhr (Standard)", 
            code: '<div class="live-clock" contenteditable="false" style="display:inline-block; width:80px; height:80px; border:2px solid #004f62; border-radius:50%; position:relative; background:white; vertical-align:middle; box-shadow:0 2px 4px rgba(0,0,0,0.1); cursor:move;"><div class="clock-hour" style="position:absolute; bottom:50%; left:calc(50% - 2px); width:4px; height:25%; background:#004f62; transform-origin:bottom center; transform:rotate(0deg); border-radius:2px;"></div><div class="clock-min" style="position:absolute; bottom:50%; left:calc(50% - 1.5px); width:3px; height:35%; background:#004f62; transform-origin:bottom center; transform:rotate(0deg); border-radius:2px;"></div><div class="clock-sec" style="position:absolute; bottom:50%; left:calc(50% - 1px); width:2px; height:40%; background:#dc2626; transform-origin:bottom center; transform:rotate(0deg);"></div><div style="position:absolute; top:50%; left:50%; width:8px; height:8px; background:#004f62; border-radius:50%; transform:translate(-50%, -50%);"></div></div>', 
            tooltip: "Mit Sekundenzeiger", 
            separator: true 
        },
        { 
            title: "Timer (Interaktiv)", 
            code: '<div class="live-timer" contenteditable="false" data-time="300" data-active="false" style="display:inline-flex; flex-wrap:wrap; align-items:center; gap:6px; padding:6px 10px; background:#e0f2f1; border:2px solid #004f62; border-radius:8px; color:#004f62; font-weight:bold; cursor:move; user-select:none; max-width: 350px;"><span style="font-size:1.2em;">⏱️</span> <span class="timer-display" style="font-family:monospace; font-size:1.4em; min-width:60px; text-align:center; background:#fff; border:1px solid #1f93b4; border-radius:4px; padding:0 4px;">05:00</span> <div style="display:flex; gap:2px;"><span class="timer-btn-add" role="button" data-add="60" style="background:#b2ebf2; border:1px solid #1f93b4; border-radius:3px; cursor:pointer; font-size:0.75em; padding:2px 4px; display:inline-block;">+1m</span><span class="timer-btn-add" role="button" data-add="300" style="background:#b2ebf2; border:1px solid #1f93b4; border-radius:3px; cursor:pointer; font-size:0.75em; padding:2px 4px; display:inline-block;">+5m</span><span class="timer-btn-add" role="button" data-add="-60" style="background:#b2ebf2; border:1px solid #1f93b4; border-radius:3px; cursor:pointer; font-size:0.75em; padding:2px 4px; display:inline-block;">-1m</span></div> <div style="width:1px; height:20px; background:#1f93b4; margin:0 4px;"></div> <span class="timer-control" role="button" style="background:#1f93b4; color:white; border:none; border-radius:4px; cursor:pointer; padding:4px 8px; font-size:0.8em; font-weight:bold; display:inline-block;">Start</span> <span class="timer-reset" role="button" style="background:transparent; border:1px solid #004f62; border-radius:4px; cursor:pointer; padding:4px 8px; font-size:0.8em; color:#004f62; display:inline-block;">Reset</span></div>', 
            tooltip: "Mit +/- Tasten", 
            separator: false 
        },
        { 
            title: "Timer (10 Sek)", 
            code: '<div class="live-timer" contenteditable="false" data-time="10" data-active="false" style="display:inline-flex; flex-wrap:wrap; align-items:center; gap:6px; padding:6px 10px; background:#e0f2f1; border:2px solid #004f62; border-radius:8px; color:#004f62; font-weight:bold; cursor:move; user-select:none; max-width: 350px;"><span style="font-size:1.2em;">⚡</span> <span class="timer-display" style="font-family:monospace; font-size:1.4em; min-width:60px; text-align:center; background:#fff; border:1px solid #1f93b4; border-radius:4px; padding:0 4px;">00:10</span> <span class="timer-control" role="button" style="background:#1f93b4; color:white; border:none; border-radius:4px; cursor:pointer; padding:4px 8px; font-size:0.8em; font-weight:bold; display:inline-block;">Start</span> <span class="timer-reset" role="button" style="background:transparent; border:1px solid #004f62; border-radius:4px; cursor:pointer; padding:4px 8px; font-size:0.8em; color:#004f62; display:inline-block;">Reset</span></div>', 
            tooltip: "Schnelltest", 
            separator: false 
        },
        { 
            title: "Container (Rechts)", 
            code: '<div style="float:right; margin:0 0 10px 15px; padding:15px; border:1px dashed #1f93b4; background:#f8fafc; border-radius:8px; width:220px;"><p style="margin-top:0;"><strong>Info-Box</strong></p><p>Hier kann Text stehen, der vom Haupttext umflossen wird.</p></div><p>&nbsp;</p>', 
            tooltip: "Schwebender Kasten", 
            separator: true 
        },
        { 
            title: "Würfel (Zufall)", 
            code: '<div class="live-dice" contenteditable="false" style="display:inline-flex; align-items:center; justify-content:center; width:60px; height:60px; border:2px solid #004f62; border-radius:12px; background:#fff; font-size:36px; cursor:pointer; user-select:none; box-shadow: 3px 3px 0 #004f62;">🎲</div>', 
            tooltip: "Interaktiver W6", 
            separator: false 
        },
        { 
            title: "Ampel (Phase)", 
            // HIER WURDE DER FEHLER BEHOBEN: &nbsp; in die <span>-Elemente eingefügt
            code: '<div class="live-traffic-light" contenteditable="false" style="display:inline-flex; gap:5px; padding:5px; background:#2c2c2c; border-radius:20px; user-select:none;"><span class="light red" style="display:inline-block; width:24px; height:24px; border-radius:50%; background:#ff4444; opacity:0.3; cursor:pointer; border:1px solid #000; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.5);">&nbsp;</span><span class="light yellow" style="display:inline-block; width:24px; height:24px; border-radius:50%; background:#ffbb00; opacity:0.3; cursor:pointer; border:1px solid #000; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.5);">&nbsp;</span><span class="light green" style="display:inline-block; width:24px; height:24px; border-radius:50%; background:#00cc00; opacity:0.3; cursor:pointer; border:1px solid #000; box-shadow: inset 1px 1px 2px rgba(0,0,0,0.5);">&nbsp;</span></div>', 
            tooltip: "Klickbare Ampel", 
            separator: false 
        },
        { 
            title: "Punktezähler", 
            code: '<div class="live-counter" contenteditable="false" data-count="0" style="display:inline-flex; align-items:center; gap:5px; border:1px solid #ccc; border-radius:5px; padding:3px 6px; background:#f9f9f9; user-select:none;"><span class="cnt-minus" role="button" style="cursor:pointer; font-weight:bold; color:#d32f2f; padding:0 5px; font-size:1.2em;">-</span><span class="cnt-val" style="font-family:monospace; font-size:1.1em; min-width:20px; text-align:center;">0</span><span class="cnt-plus" role="button" style="cursor:pointer; font-weight:bold; color:#388e3c; padding:0 5px; font-size:1.2em;">+</span></div>', 
            tooltip: "Counter", 
            separator: false 
        },
        { 
            title: "Spoiler (Verdeckt)", 
            code: '<span class="live-spoiler" style="background:#000; color:#000; padding:2px 6px; border-radius:4px; cursor:help; user-select:none; font-family:monospace;" title="Klick: Aufdecken | Shift+Klick: Text ändern">Lösung hier</span>', 
            tooltip: "Klicken zum Aufdecken", 
            separator: false 
        },
        { 
            title: "Glocke (Sound)", 
            code: '<div class="live-bell" contenteditable="false" data-sound="sound/freesound_community-bell-chord1-83260.mp3" style="display:inline-flex; align-items:center; gap:8px; padding:8px 16px; background:#e0f2f1; border:2px solid #004f62; border-radius:8px; color:#004f62; font-weight:bold; cursor:pointer; user-select:none; box-shadow: 2px 2px 4px rgba(0,0,0,0.1); transition: transform 0.1s;"><span style="font-size:1.2em;">🔔</span> Glocke</div>', 
            tooltip: "Spielt einen Glockenton ab", 
            separator: false 
        }
    ],

    // --- HELPER FUNKTIONEN ---
    
    getMathKategorien: function() {
        return this.mathData;
    },

    getSnippetListe: function() {
        return this.snippetData.map(s => ({
            title: s.title,
            code: s.code,
            tooltip: s.tooltip,
            hasSeparator: s.separator
        }));
    }
};

console.log("SnippetModul geladen.");