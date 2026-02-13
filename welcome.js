/**
 * DATENMODUL: welcome.js
 * Enthält den Standard-Inhalt für leere Tafelbilder.
 */
const WelcomeModul = {
    getHtml: function() {
        return `
            <h1>Willkommen an der E-Tafel 👋</h1>
            <p>Dieser Editor unterstützt deinen Unterricht mit nützlichen Funktionen:</p>
            <ul>
                <li>🎨 <b>Skizze:</b> Nutze den Button <i>Skizze</i> (Stift), um Freihandzeichnungen einzufügen.</li>
                <li>🧩 <b>Snippets:</b> Füge über das Menü <i>Snippets</i> interaktive Timer, Uhren oder Lernziel-Boxen ein.</li>
                <li>🔢 <b>Mathematik:</b> Schreibe Formeln in <code>$$</code> (LaTeX) oder <code>§§</code> (AsciiMath). Aktiviere die <i>Mathevorschau</i> oben rechts.</li>
                <li>📢 <b>Vorlesen:</b> Nutze den Button <i>Vorlesen</i> (Sprechblase), um markierten Text via Sprachsynthese wiederzugeben.</li>
                <li>⌨️ <b>Shortcuts:</b> Tippe Kürzel wie <code>##timer</code>, <code>##uhr</code> oder <code>##wichtig</code> + <b>Leertaste</b> für schnelles Einfügen.</li>
                <li>🖍️ <b>Korrekturmodus:</b> Markiere eine Textpassage und öffne per <b>Rechtsklick</b> das Kontextmenü für Korrekturen (Streichen, Markieren) oder Feedback-Symbole (✅, ❌, 👍).</li>
            </ul>
            <h3>⚡ Wichtige Funktionen & Sicherung:</h3>
            <ul>
                <li>📝 <b>Aufgabengestalter:</b> Über den Button <i>Aufgabe</i> (Klemmbrett) erstellst du Links und QR-Codes für Schüler.</li>
                <li>💾 <b>Speicherung:</b> Der Editor speichert automatisch im Browser. Nutze im Notfall "Entwurf wiederherstellen".</li>
                <li>⚠️ <b>Dateien laden:</b> Da es sich um eine Web-App handelt, ist es leider nicht möglich, Dateien direkt von der Festplatte zu öffnen. Du kannst jedoch jederzeit Sicherungen (z. B. aus LibreOffice oder Word) per <b>Copy-Paste</b> in den Editor übertragen.</li>
            </ul>
            <p><i>Für dauerhafte Sicherung: Datei -> Drucken (PDF) oder Export als HTML.</i></p>
            <p>&nbsp;</p>
        `;
    }
};