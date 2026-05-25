import { useState, useEffect } from "react";
import axios from "axios";

const ACCESS_KEY = "t1QdO_E4LZKp4Pi5FgDdJebgPthQSDQHe5dchZiXtfY";

export default function PunkGallery() {
  const [photos, setPhotos] = useState([]);
  const [query, setQuery] = useState("punk art");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchPhotos = async (searchQuery, pageNum, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("https://api.unsplash.com/search/photos", {
        params: { query: searchQuery, per_page: 12, page: pageNum, client_id: ACCESS_KEY },
      });
      setPhotos(prev => append ? [...prev, ...data.results] : data.results);
      setHasMore(pageNum < data.total_pages);
    } catch {
      setError("Erro ao buscar imagens. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(query, 1);
    setPage(1);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) { setQuery(input.trim()); setInput(""); }
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPhotos(query, next, true);
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Galeria</h1>
        <p className="text-sm text-gray-400">Buscando por: <span className="text-gray-600 font-medium">{query}</span></p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Buscar imagens..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-500"
        />
        <button
          type="submit"
          className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
        >
          Buscar
        </button>
      </form>

      {/* Error */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((photo, i) => (
            <div
              key={`${photo.id}-${i}`}
              className="cursor-pointer overflow-hidden rounded"
              onClick={() => setSelected(photo)}
            >
              <img
                src={photo.urls.small}
                alt={photo.alt_description || "foto"}
                className="w-full h-48 object-cover hover:opacity-80 transition-opacity"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && photos.length === 0 && !error && (
        <p className="text-center text-gray-400 py-20 text-sm">Nenhuma imagem encontrada.</p>
      )}

      {/* Load More */}
      <div className="mt-8 text-center">
        {loading && <p className="text-sm text-gray-400">Carregando...</p>}
        {!loading && hasMore && (
          <button
            onClick={handleLoadMore}
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded text-sm hover:bg-gray-50 transition-colors"
          >
            Carregar mais
          </button>
        )}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="bg-white rounded overflow-hidden max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <img
              src={selected.urls.regular}
              alt={selected.alt_description}
              className="w-full max-h-[70vh] object-contain"
            />
            <div className="p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-800">{selected.user.name}</p>
                <p className="text-xs text-gray-400">{selected.likes} curtidas</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-sm">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
