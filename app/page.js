"use client";
import { useState, useEffect } from "react";
import { SparklesIcon, StarIcon, HomeIcon, GlobeAltIcon, ExclamationTriangleIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [suche, setSuche] = useState("");
  const [ergebnis, setErgebnis] = useState(null);
  const [isLaden, setIsLaden] = useState(false);
  const [notiz, setNotiz] = useState("");
  const [instagramPost, setInstagramPost] = useState("");
  const [instagramStory, setInstagramStory] = useState("");
  const [fachtext, setFachtext] = useState("");
  const TAG_LISTE = [
    "Kraut",
    "Fest",
    "Lieblingspflanze",
    "Giftpflanze",
    "Heimisch",
    "Exotisch"
  ];
  const [tags, setTags] = useState([]);
  const [gespeicherteEintraege, setGespeicherteEintraege] = useState([]);
  const [editBuffer, setEditBuffer] = useState({});
  const [editSuccess, setEditSuccess] = useState({});
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [sammlungSuche, setSammlungSuche] = useState("");
  const [sortierung, setSortierung] = useState("az"); // az, neu, alt
  const [tagFilter, setTagFilter] = useState([]);
  const [offen, setOffen] = useState({});
  const [seite, setSeite] = useState(1);
  const EINTRAEGE_PRO_SEITE = 5;
  const TAG_ICONS = {
    "Kraut": <SparklesIcon className="w-5 h-5 text-green-700" />,
    "Fest": <SparklesIcon className="w-5 h-5 text-yellow-600" />,
    "Lieblingspflanze": <StarIcon className="w-5 h-5 text-yellow-500" />,
    "Giftpflanze": <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />,
    "Heimisch": <HomeIcon className="w-5 h-5 text-green-500" />,
    "Exotisch": <GlobeAltIcon className="w-5 h-5 text-blue-500" />
  };
  const [showAccordion, setShowAccordion] = useState({});
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' oder 'desc'

  // States für die 4 API-Felder
  const [apiPflanze, setApiPflanze] = useState("");

  useEffect(() => {
    const daten = localStorage.getItem("heilkraeuter_sammlung");
    if (daten) {
      let geladeneEintraege = JSON.parse(daten);
      
      // Migration für alte und neue Daten, um eine konsistente Struktur sicherzustellen
      const korrigierteEintraege = geladeneEintraege.map(e => {
        if (!e || typeof e !== 'object') return null;

        let migrated = { ...e };

        // 1. Migration: `titel` zu `name`
        if (!migrated.name && migrated.titel) {
          const extrahierterName = migrated.titel.match(/"(.*?)"/);
          migrated.name = extrahierterName ? extrahierterName[1] : migrated.titel;
        }

        // 2. Migration: Alte Felder (`beschreibung`, `insta`) auf neue Struktur mappen
        if (migrated.beschreibung && !migrated.fachtext) {
          migrated.fachtext = migrated.beschreibung;
        }
        if (migrated.insta && !migrated.instagramPost) {
          migrated.instagramPost = migrated.insta;
        }
        
        // 3. Sicherstellen, dass alle neuen Felder existieren, um Fehler zu vermeiden
        if (typeof migrated.instagramStory === 'undefined') {
          migrated.instagramStory = "";
        }
        if (typeof migrated.fachtext === 'undefined') {
          migrated.fachtext = "";
        }
        if (typeof migrated.instagramPost === 'undefined') {
          migrated.instagramPost = "";
        }

        // 4. Alte, redundante Felder entfernen für saubere Daten
        delete migrated.beschreibung;
        delete migrated.insta;
        delete migrated.anwendung;
        delete migrated.titel;
        delete migrated.zeit;
        
        return migrated;

      }).filter(e => e && e.name); // Nur gültige Einträge mit einem Namen behalten

      setGespeicherteEintraege(korrigierteEintraege);
    }
  }, []);

  // Speichern in localStorage, wenn sich die Sammlung ändert
  useEffect(() => {
    localStorage.setItem("heilkraeuter_sammlung", JSON.stringify(gespeicherteEintraege));
  }, [gespeicherteEintraege]);

  // Editierbare Felder initialisieren, wenn Sammlung sich ändert
  useEffect(() => {
    const buffer = {};
    gespeicherteEintraege.forEach((eintrag, idx) => {
      buffer[idx] = {
        // Neue, saubere Struktur für den Editier-Buffer
        instagramPost: eintrag.instagramPost || "",
        instagramStory: eintrag.instagramStory || "",
        fachtext: eintrag.fachtext || "",
        notiz: eintrag.notiz || ""
      };
    });
    setEditBuffer(buffer);
  }, [gespeicherteEintraege]);

  const handleSuche = async (e) => {
    e.preventDefault();
    if (!suche.trim()) return;
    setIsLaden(true);
    setErgebnis(null);
    
    // States für neue Suche zurücksetzen
    setApiPflanze("");
    setInstagramPost("");
    setInstagramStory("");
    setFachtext("");
    setNotiz("");
    setTags([]);

    try {
      const response = await fetch("https://p3kbzlnlf6qvl81g.myfritz.net:8443/webhook/lookup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pflanze: suche }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (text) {
        try {
          const data = JSON.parse(text);
          // Die vier Felder aus der API-Antwort auslesen
          setApiPflanze(data["pflanze"] || `Ergebnis für "${suche}"`);
          setInstagramPost(data["Instagram-Post:"] || "Kein Instagram-Post gefunden.");
          setInstagramStory(data["Instagram-Story-Text"] || "Kein Story-Text gefunden.");
          setFachtext(data["Fachtext für Wissensdatenbank"] || "Kein Fachtext gefunden.");
          setErgebnis(data); // Ergebnis für Speichern-Funktion behalten
        } catch (jsonError) {
          console.error("Fehler beim Parsen von JSON:", jsonError);
          setErgebnis({
            name: "Antwort erhalten (kein JSON)",
            beschreibung: text,
            anwendung: "",
            insta: ""
          });
        }
      } else {
        setErgebnis({
          name: "Leere Antwort",
          beschreibung: "Der Server hat eine leere Antwort gesendet.",
          anwendung: "",
          insta: ""
        });
      }

    } catch (error) {
      console.error("Fehler bei der API-Anfrage:", error);
      // Optional: Benutzerfeedback für Fehler
      setErgebnis({
        name: "Fehler",
        beschreibung: "Die Suche konnte nicht durchgeführt werden. Bitte versuchen Sie es später erneut.",
        anwendung: "",
        insta: ""
      });
    } finally {
      setIsLaden(false);
    }
  };

  // Speichern-Funktion
  const handleSpeichern = () => {
    if (!ergebnis) return;
    
    // Ein neues, sauberes Objekt mit der neuen Struktur für die Speicherung erstellen
    const neuerEintrag = {
      name: apiPflanze,
      instagramPost: instagramPost,
      instagramStory: instagramStory,
      fachtext: fachtext,
      notiz: notiz,
      tags: tags,
      timestamp: new Date().toISOString() // Zeitstempel für die Sortierung
    };

    setGespeicherteEintraege([
      ...gespeicherteEintraege,
      neuerEintrag,
    ]);

    setShowSaveSuccess(true);
    setTimeout(() => {
      setShowSaveSuccess(false);
    }, 3000);
  };

  // Notiz aktualisieren
  const handleNotizChange = (e) => setNotiz(e.target.value);

  // Notiz bei gespeichertem Eintrag ändern
  const handleGespeicherteNotiz = (idx, neueNotiz) => {
    const kopie = [...gespeicherteEintraege];
    kopie[idx].notiz = neueNotiz;
    setGespeicherteEintraege(kopie);
  };

  // Notiz bei gespeichertem Eintrag ändern
  const handleGespeicherteBeschreibung = (idx, neueBeschreibung) => {
    const kopie = [...gespeicherteEintraege];
    kopie[idx].beschreibung = neueBeschreibung;
    setGespeicherteEintraege(kopie);
  };

  // Instagram-Text bei gespeichertem Eintrag ändern
  const handleGespeicherteInsta = (idx, neuerInsta) => {
    const kopie = [...gespeicherteEintraege];
    kopie[idx].insta = neuerInsta;
    setGespeicherteEintraege(kopie);
  };

  // Eintrag löschen
  const handleLoeschen = (idx) => {
    const kopie = [...gespeicherteEintraege];
    kopie.splice(idx, 1);
    setGespeicherteEintraege(kopie);
  };

  // Änderungen im Editier-Buffer speichern
  const handleEditBufferChange = (idx, feld, wert) => {
    setEditBuffer((prev) => ({
      ...prev,
      [idx]: {
        ...prev[idx],
        [feld]: wert
      }
    }));
  };

  // Änderungen übernehmen
  const handleEditSpeichern = (idx) => {
    const kopie = [...gespeicherteEintraege];
    kopie[idx] = {
      ...kopie[idx],
      ...editBuffer[idx]
    };
    setGespeicherteEintraege(kopie);
    setEditSuccess((prev) => ({ ...prev, [idx]: true }));
    setTimeout(() => {
      setEditSuccess((prev) => ({ ...prev, [idx]: false }));
    }, 2000);
  };

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-4"
      style={{
        background: `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), url('/background.jpg') center center / cover no-repeat fixed`,
      }}
    >
      <div className="relative z-10 flex flex-col items-center text-center mt-8 text-white">
        <div className="flex flex-col items-center justify-center">
          <img src="/Logo.png" alt="Logo" className="h-40 w-40 md:h-48 md:w-48 mb-4" />
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ color: '#2E403B' }}>
            HEILKRÄUTER & RITUALE
          </h1>
        </div>

        <div className="w-full max-w-lg mt-8">
          <form onSubmit={handleSuche} className="flex flex-col items-center gap-4">
            <input
              type="text"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              placeholder="Suche nach Pflanze oder Fest..."
              className="w-full p-2 border border-green-300 rounded text-gray-900"
            />
            <div className="flex items-center gap-4">
              <button
                type="submit"
                className={`text-white px-4 py-2 rounded transition${isLaden ? ' laden' : ''}`}
                style={{ backgroundColor: '#009975' }}
                disabled={isLaden}
              >
                Suchen
              </button>
              {isLaden && (
                <img
                  src="/ladeiconneu.png"
                  alt="Lädt..."
                  className="lade-spinner"
                  style={{ display: 'inline-block' }}
                />
              )}
            </div>
          </form>
        </div>
      </div>

      {showSaveSuccess && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-800 font-semibold rounded-lg shadow-md text-center">
          ✓ Erfolgreich in deiner Sammlung gespeichert!
        </div>
      )}

      {/* --- EINHEITLICHER ERGEBNIS-CONTAINER --- */}
      {apiPflanze && !isLaden && (
        <div className="w-full max-w-2xl mt-8 p-6 bg-white rounded-lg shadow-lg text-gray-800 text-left">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{apiPflanze}</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-green-700">Instagram-Post</h3>
            <p className="whitespace-pre-wrap">{instagramPost}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-green-700">Instagram-Story</h3>
            <p className="whitespace-pre-wrap">{instagramStory}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-green-700">Fachtext für Wissensdatenbank</h3>
            <p className="whitespace-pre-wrap">{fachtext}</p>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* Notizen und Speichern-Funktionalität */}
          <div className="mt-4">
             <textarea
              value={notiz}
              onChange={handleNotizChange}
              placeholder="Eigene Notizen hinzufügen..."
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {TAG_LISTE.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    tags.includes(tag)
                      ? "bg-green-700 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <button
              onClick={handleSpeichern}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              In Sammlung speichern
            </button>
            {showSaveSuccess && (
              <p className="text-green-600 mt-2">Erfolgreich gespeichert!</p>
            )}
          </div>
        </div>
      )}

      {ergebnis && !isLaden && (
        <div className="w-full max-w-2xl mt-8 p-4 bg-white rounded-lg shadow-lg text-gray-800 text-left">
          <h2 className="text-xl font-bold mb-2 text-gray-900">{ergebnis.name}</h2>
          <p className="mb-2">{ergebnis.beschreibung}</p>
          <p className="mb-4"><strong>Anwendungen:</strong> {ergebnis.anwendung}</p>

          <div className="flex items-center justify-between">
            {gespeicherteEintraege.some(e => e.name?.toLowerCase() === ergebnis.name?.toLowerCase()) ? (
                <span className="font-bold text-green-800">Bereits in deiner Sammlung!</span>
            ) : (
                <button
                    onClick={handleSpeichern}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    In Sammlung speichern
                </button>
            )}

            <div className="flex gap-2">
              <a href={`https://instagram.com/explore/tags/${(ergebnis.name || "").replace(/ /g, "")}`} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                <PlayCircleIcon className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-bold">Notiz zum Eintrag:</h4>
            <input
              type="text"
              value={notiz}
              onChange={(e) => setNotiz(e.target.value)}
              placeholder="Deine persönliche Notiz..."
              className="w-full p-2 border border-gray-300 rounded mt-1 text-gray-900"
            />
          </div>
        </div>
      )}

      {/* Gespeicherte Einträge */}
      {gespeicherteEintraege.length > 0 && (
        <div className="mt-12 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {TAG_LISTE.map(tag => (
              <button
                key={tag}
                className={`px-2 py-1 rounded text-xs border transition ${tagFilter.includes(tag) ? "bg-green-600 text-white border-green-700" : "bg-green-100 text-green-700 border-green-200"}`}
                onClick={() => setTagFilter(tagFilter.includes(tag) ? tagFilter.filter(t => t !== tag) : [...tagFilter, tag])}
              >
                {tag}
              </button>
            ))}
            {tagFilter.length > 0 && (
              <button
                className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-700 border border-gray-300 ml-2"
                onClick={() => setTagFilter([])}
              >
                Filter zurücksetzen
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
            <input
              type="text"
              placeholder="In Sammlung suchen..."
              value={sammlungSuche}
              onChange={e => setSammlungSuche(e.target.value)}
              className="w-full sm:w-2/3 p-2 border border-green-200 rounded"
            />
            <select
              value={sortierung}
              onChange={e => setSortierung(e.target.value)}
              className="w-full sm:w-1/3 p-2 border border-green-200 rounded"
            >
              <option value="az">A–Z (Name)</option>
              <option value="neu">Neueste zuerst</option>
              <option value="alt">Älteste zuerst</option>
            </select>
          </div>
          {(() => {
            // Gefilterte und sortierte Einträge berechnen
            const gefiltert = gespeicherteEintraege
              .filter(eintrag => {
                // Tag-Filter
                if (filter && eintrag && eintrag.tags && eintrag.tags.includes(filter)) {
                  return true;
                }
                // Suchtext-Filter
                if (filter && eintrag && eintrag.name && eintrag.name.toLowerCase().includes(filter.toLowerCase())) {
                  return true;
                }
                if (filter && eintrag && eintrag.beschreibung && eintrag.beschreibung.toLowerCase().includes(filter.toLowerCase())) {
                  return true;
                }
                // Wenn kein Filter gesetzt ist, alles anzeigen
                return !filter;
              })
              .sort((a, b) => {
                const nameA = a.name || '';
                const nameB = b.name || '';
                if (sortierung === "az") {
                  return nameA.localeCompare(nameB);
                } else if (sortierung === "neu") {
                  return (b.timestamp || 0) - (a.timestamp || 0);
                } else if (sortierung === "alt") {
                  return (a.timestamp || 0) - (b.timestamp || 0);
                }
                return 0;
              });
            // Pagination
            const seitenAnzahl = Math.ceil(gefiltert.length / EINTRAEGE_PRO_SEITE) || 1;
            const start = (seite - 1) * EINTRAEGE_PRO_SEITE;
            const ende = start + EINTRAEGE_PRO_SEITE;
            const aktuell = gefiltert.slice(start, ende);
            // Wenn Seite zu hoch (z.B. nach Filter), zurück auf 1
            if (seite > seitenAnzahl) setSeite(1);
            return <>
              {aktuell.map((eintrag, idx) => {
                // Index für Akkordeon und EditBuffer anpassen:
                const globalIdx = gespeicherteEintraege.indexOf(eintrag);
                return (
                  <div key={globalIdx} className="card-mood" style={{ background: 'rgba(191, 200, 184, 0.5)', backgroundColor: 'rgba(191, 200, 184, 0.5)', opacity: 1, zIndex: 10 }}>
                    <div className="flex justify-between items-center mb-1 cursor-pointer" onClick={() => setOffen(o => ({...o, [globalIdx]: !o[globalIdx]}))}>
                      <span className="card-mood-title flex items-center gap-2">
                        {/* Icon für das erste Tag */}
                        {eintrag.tags && eintrag.tags.length > 0 && (
                          <span className="text-lg">{TAG_ICONS[eintrag.tags[0]] || <SparklesIcon className="w-5 h-5 text-green-700" />}</span>
                        )}
                        {eintrag.name}
                        <span className="text-xs ml-2">{offen[globalIdx] ? "▲" : "▼"}</span>
                      </span>
                      <div className="card-mood-tags">
                        {eintrag.tags && eintrag.tags.map((tag, i) => (
                          <span key={i} className="card-mood-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                    {offen[globalIdx] && (
                      <div className="mt-4 text-left">
                        {/* Überarbeiteter Bearbeitungsbereich mit allen Feldern */}
                        <div className="space-y-4">
                          <div>
                            <label className="font-bold text-sm text-green-800">Instagram-Post</label>
                            <textarea
                              className="w-full p-2 border border-green-200 bg-white rounded text-sm mt-1"
                              value={editBuffer[globalIdx]?.instagramPost || ""}
                              onChange={e => handleEditBufferChange(globalIdx, "instagramPost", e.target.value)}
                              rows={5}
                            />
                          </div>
                          <div>
                            <label className="font-bold text-sm text-green-800">Instagram-Story</label>
                            <textarea
                              className="w-full p-2 border border-green-200 bg-white rounded text-sm mt-1"
                              value={editBuffer[globalIdx]?.instagramStory || ""}
                              onChange={e => handleEditBufferChange(globalIdx, "instagramStory", e.target.value)}
                              rows={5}
                            />
                          </div>
                          <div>
                            <label className="font-bold text-sm text-green-800">Fachtext</label>
                            <textarea
                              className="w-full p-2 border border-green-200 bg-white rounded text-sm mt-1"
                              value={editBuffer[globalIdx]?.fachtext || ""}
                              onChange={e => handleEditBufferChange(globalIdx, "fachtext", e.target.value)}
                              rows={7}
                            />
                          </div>
                          <div>
                            <label className="font-bold text-sm text-green-800">Eigene Notizen</label>
                            <textarea
                              className="w-full p-2 border border-gray-300 bg-white rounded text-sm mt-1"
                              value={editBuffer[globalIdx]?.notiz || ""}
                              onChange={e => handleEditBufferChange(globalIdx, "notiz", e.target.value)}
                              rows={3}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div>
                            <button
                              onClick={() => handleEditSpeichern(globalIdx)}
                              className="text-white px-4 py-2 rounded transition text-sm"
                              style={{ backgroundColor: '#009975' }}
                            >
                              Änderungen speichern
                            </button>
                            {editSuccess[globalIdx] && (
                              <span className="text-green-600 text-sm ml-2">Gespeichert!</span>
                            )}
                          </div>
                          <button onClick={() => handleLoeschen(globalIdx)} className="text-red-500 hover:text-red-700 text-xs font-semibold">
                            Eintrag löschen
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {eintrag.timestamp ? `Gespeichert am: ${new Date(eintrag.timestamp).toLocaleString('de-DE')}` : ''}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Pagination Buttons */}
              <div className="flex justify-center gap-2 mt-4 col-span-full">
                <button
                  onClick={() => setSeite(s => Math.max(1, s - 1))}
                  disabled={seite === 1}
                  className="px-3 py-1 rounded bg-green-100 text-green-700 border border-green-200 disabled:opacity-50"
                >
                  Vorherige
                </button>
                <span className="px-2 py-1 text-xs">Seite {seite} / {seitenAnzahl}</span>
                <button
                  onClick={() => setSeite(s => Math.min(seitenAnzahl, s + 1))}
                  disabled={seite === seitenAnzahl}
                  className="px-3 py-1 rounded bg-green-100 text-green-700 border border-green-200 disabled:opacity-50"
                >
                  Nächste
                </button>
              </div>
            </>;
          })()}
        </div>
      )}

      {isLaden && (
        <img
          src="/ladeiconneu.png"
          alt="Lädt..."
          className="lade-spinner"
          style={{ display: 'inline-block' }}
        />
      )}
    </main>
  );
}
