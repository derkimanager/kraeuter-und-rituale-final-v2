export default function Impressum() {
  return (
    <main className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-12">
      <div className="flex flex-col items-center justify-center mb-6">
        <a href="/">
          <img src="/Logo2.png" alt="Logo" className="h-32 w-32 md:h-40 md:w-40 mb-2 cursor-pointer" />
        </a>
      </div>
      <h1 className="text-2xl font-bold mb-4">Impressum</h1>
      <pre className="whitespace-pre-wrap text-sm text-gray-800">
{`
Impressum (§ 5 TMG)

Johanna Bärenz
Schützenstraße 107
22761 Hamburg
Deutschland

E-Mail: der.ki.manager@gmail.com
Website: https://kraeuter-und-rituale-ueap.vercel.app/

Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:
Johanna Bärenz, Anschrift wie oben.
`}
      </pre>
    </main>
  );
} 