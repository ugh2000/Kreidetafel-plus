/* ABI-ONLINE EXPORT MODUL
    Dieses Modul bündelt alle Funktionen, die für die Ausgabe der Daten zuständig sind:
    - Drucken (via Browser-Dialog)
    - PDF-Erstellung (via jsPDF)
    - HTML-Export (Download)
    - Identität speichern (Name/Klasse für den Header)
*/

// Identität (Name/Klasse) im LocalStorage speichern
function saveIdentity() {
    const nameField = document.getElementById('studentName');
    const classField = document.getElementById('studentClass');
    
    if (nameField && classField) {
        localStorage.setItem('abi_online_name', nameField.value);
        localStorage.setItem('abi_online_class', classField.value);
    }
}

// Identität laden (Hilfsfunktion für den Druck/Export)
function loadIdentityForExport() {
    const name = localStorage.getItem('abi_online_name') || '';
    const className = localStorage.getItem('abi_online_class') || '';
    
    // Füllt die Felder im Druckbereich
    const pName = document.getElementById('printName');
    const pClass = document.getElementById('printClass');
    const pDate = document.getElementById('printDate');
    
    if (pName) pName.innerText = name;
    if (pClass) pClass.innerText = className;
    if (pDate) pDate.innerText = new Date().toLocaleDateString('de-DE');
}

// Druck-Funktion: Bereitet den Druckbereich vor und öffnet den Dialog
function printPage() {
    // 1. Identität sichern und in den Header schreiben
    saveIdentity();
    loadIdentityForExport();

    // 2. Inhalt aus TinyMCE holen
    const content = tinymce.activeEditor ? tinymce.activeEditor.getContent() : '';
    
    // 3. Inhalt in den Druck-Div kopieren
    const printDiv = document.getElementById('printContent');
    if (printDiv) {
        printDiv.innerHTML = content;
        // MathJax muss neu rendern, da der Inhalt nun im printDiv liegt
        if (window.MathJax) {
            window.MathJax.typesetPromise([printDiv]).then(() => {
                window.print();
            }).catch((err) => console.error('MathJax Print Error:', err));
        } else {
            window.print();
        }
    }
}

// PDF Generierung (Basierend auf jsPDF)
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    
    // Wir nutzen hier eine einfache Text-Extraktion für Stabilität,
    // oder, falls gewünscht, den HTML-Druck-Weg. 
    // Da jsPDF HTML-Rendering komplex ist, empfehlen wir oft window.print() -> "Als PDF speichern".
    // Hier eine Implementierung, die den Textinhalt extrahiert:
    
    const doc = new jsPDF();
    
    // Metadaten
    const name = localStorage.getItem('abi_online_name') || 'Unbekannt';
    const className = localStorage.getItem('abi_online_class') || '';
    const title = window.taskTitle || 'Aufgabe'; // Zugriff auf globale Variable aus logic.js

    doc.setFontSize(10);
    doc.text(`Name: ${name} | Klasse: ${className} | Datum: ${new Date().toLocaleDateString()}`, 10, 10);
    
    doc.setFontSize(14);
    doc.text(title, 10, 20);
    
    // Inhalt (Reintext-Version für Kompatibilität)
    const rawText = tinymce.activeEditor.getContent({ format: 'text' });
    const splitText = doc.splitTextToSize(rawText, 180);
    
    doc.setFontSize(12);
    doc.text(splitText, 10, 30);
    
    doc.save(`${title.replace(/\s+/g, '_')}_${name}.pdf`);
}

// HTML Export (Download der Datei)
function generateHTML() {
    const content = tinymce.activeEditor ? tinymce.activeEditor.getContent() : '';
    const title = window.taskTitle || 'Dokument';
    
    const htmlStructure = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
            body { font-family: sans-serif; max-width: 800px; margin: 20px auto; line-height: 1.6; }
            img { max-width: 100%; height: auto; }
            table { border-collapse: collapse; width: 100%; }
            td, th { border: 1px solid #ccc; padding: 8px; }
        </style>
    </head>
    <body>
        <h1>${title}</h1>
        ${content}
    </body>
    </html>`;

    const blob = new Blob([htmlStructure], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${title.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Globale Bereitstellung (damit logic.js und HTML Buttons darauf zugreifen können)
window.saveIdentity = saveIdentity;
window.printPage = printPage;
window.generatePDF = generatePDF;
window.generateHTML = generateHTML;