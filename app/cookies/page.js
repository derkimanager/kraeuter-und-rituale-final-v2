export default function Cookies() {
  return (
    <main className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-12">
      <div className="flex flex-col items-center justify-center mb-6">
        <a href="/">
          <img src="/Logo2.png" alt="Logo" className="h-32 w-32 md:h-40 md:w-40 mb-2 cursor-pointer" />
        </a>
      </div>
      <h1 className="text-2xl font-bold mb-4">Cookie-Richtlinie</h1>
      <pre className="whitespace-pre-wrap text-sm text-gray-800">
{`
Cookie-Banner-Text (Opt-In)

Wir verwenden ausschließlich notwendige Cookies. Diese Cookies sind für den sicheren Betrieb der Website unverzichtbar und werden automatisch gesetzt. Weitere Cookies (Statistik, Marketing) kommen nicht zum Einsatz.
`}
      </pre>
    </main>
  );
} 