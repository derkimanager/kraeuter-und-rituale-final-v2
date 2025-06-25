export default function Haftungsausschluss() {
  return (
    <main className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-12">
      <div className="flex flex-col items-center justify-center mb-6">
        <a href="/">
          <img src="/Logo2.png" alt="Logo" className="h-32 w-32 md:h-40 md:w-40 mb-2 cursor-pointer" />
        </a>
      </div>
      <h1 className="text-2xl font-bold mb-4">Haftungsausschluss</h1>
      <pre className="whitespace-pre-wrap text-sm text-gray-800">
{`
Haftungsausschluss zu Gesundheitsinformationen

Die bereitgestellten Inhalte dienen ausschließlich der allgemeinen Information über Heilkräuter und Rituale und ersetzen keine medizinische Beratung. Konsultieren Sie bei gesundheitlichen Fragen qualifiziertes Fachpersonal. Die Anwendung von Kräutern erfolgt in eigener Verantwortung. Eine Haftung für Schäden wird ausgeschlossen.

Hinweis: Die Inhalte zu Kräutern und Ritualen auf dieser Webseite werden teilweise automatisiert mit Hilfe von Künstlicher Intelligenz erstellt. Es erfolgt keine fachliche Prüfung. Für die Richtigkeit, Vollständigkeit und Aktualität der Angaben wird keine Gewähr übernommen.
`}
      </pre>
    </main>
  );
} 