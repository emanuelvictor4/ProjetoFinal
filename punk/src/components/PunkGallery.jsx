import { useState, useEffect } from "react";
import axios from "axios";
import "./PunkGallery.css";

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
    <section className="punk-gallery">
      <div className="gallery-container">

        <div className="gallery-header">
          <h1>Galeria Punk</h1>
          <p>Buscando por: {query}</p>
        </div>

        <form
          onSubmit={handleSearch}
          className="search-form"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Buscar imagens..."
            className="search-input"
          />

          <button
            type="submit"
            className="search-btn"
          >
            Buscar
          </button>
        </form>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {photos.length > 0 && (
          <div className="gallery-grid">
            {photos.map((photo, i) => (
              <div
                key={`${photo.id}-${i}`}
                className="gallery-item"
                onClick={() => setSelected(photo)}
              >
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description || "foto"}
                />
              </div>
            ))}
          </div>
        )}

        {!loading &&
          photos.length === 0 &&
          !error && (
            <p className="empty-message">
              Nenhuma imagem encontrada.
            </p>
          )}

        <div className="load-more-container">

          {loading && (
            <p className="loading">
              Carregando...
            </p>
          )}

          {!loading && hasMore && (
            <button
              onClick={handleLoadMore}
              className="load-more-btn"
            >
              Carregar mais
            </button>
          )}

        </div>

        {selected && (
          <div
            className="modal-overlay"
            onClick={() => setSelected(null)}
          >
            <div
              className="modal-content"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <img
                src={selected.urls.regular}
                alt={selected.alt_description}
              />

              <div className="modal-footer">

                <div>
                  <p className="modal-author">
                    {selected.user.name}
                  </p>

                  <p className="modal-likes">
                    {selected.likes} curtidas
                  </p>
                </div>

                <button
                  className="close-btn"
                  onClick={() =>
                    setSelected(null)
                  }
                >
                  Fechar
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}