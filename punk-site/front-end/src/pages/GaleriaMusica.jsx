import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/musicGallery.css";

const TOKEN_URL = "http://localhost/punk-site/back-end/spotify-token.php";

const CATEGORIAS = [
  { key: "artists", label: "Artistas" },
  { key: "albums",  label: "Álbuns"   },
  { key: "tracks",  label: "Músicas"  },
];

export default function MusicGallery() {
  const [token, setToken]           = useState(null);
  const [categoria, setCategoria]   = useState("artists");
  const [results, setResults]       = useState({ artists: [], albums: [], tracks: [] });
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [selected, setSelected]     = useState(null);

  // 1. Busca token no PHP
  useEffect(() => {
    axios.get(TOKEN_URL)
      .then(({ data }) => setToken(data.access_token))
      .catch(() => setError("Erro ao obter token do Spotify."));
  }, []);

  // 2. Quando tiver token, busca os dados
  useEffect(() => {
    if (!token) return;
    fetchData(token);
  }, [token]);

  const fetchData = async (tkn) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        params: {
          q:     "punk rock",
          type:  "artist,album,track",
          limit: 10,
        },
        headers: { Authorization: `Bearer ${tkn}` },
      });

      setResults({
        artists: data.artists?.items || [],
        albums:  data.albums?.items  || [],
        tracks:  data.tracks?.items  || [],
      });
    } catch (err) {
      setError("Erro ao buscar dados do Spotify. Tente recarregar a página.");
    } finally {
      setLoading(false);
    }
  };

  const getImage = (item) => {
    if (categoria === "tracks") return item.album?.images?.[0]?.url;
    return item.images?.[0]?.url;
  };

  const getSubtitle = (item) => {
    if (categoria === "artists") return item.genres?.slice(0, 2).join(", ") || "Artista";
    if (categoria === "albums")  return item.artists?.map(a => a.name).join(", ");
    if (categoria === "tracks")  return item.artists?.map(a => a.name).join(", ");
    return "";
  };

  const getDetail = (item) => {
    if (categoria === "artists") {
      return item.followers?.total
        ? `${item.followers.total.toLocaleString("pt-BR")} seguidores`
        : null;
    }
    if (categoria === "albums") return item.release_date ? `Lançamento: ${item.release_date}` : null;
    if (categoria === "tracks") {
      if (!item.duration_ms) return null;
      const m = Math.floor(item.duration_ms / 60000);
      const s = String(Math.floor((item.duration_ms % 60000) / 1000)).padStart(2, "0");
      return `Duração: ${m}:${s}`;
    }
    return null;
  };

  const activeItems = results[categoria] || [];

  return (
    <section className="gf-page">
      <h1>Galeria Punk</h1>

      {/* Filtros de categoria */}
      <div className="gf-filtros">
        {CATEGORIAS.map(c => (
          <button
            key={c.key}
            className={`gf-filtro${categoria === c.key ? " gf-filtro--ativo" : ""}`}
            onClick={() => setCategoria(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {error && <div className="gf-erro">{error}</div>}

      {loading && <p className="gf-info">Carregando...</p>}

      {!loading && !error && activeItems.length === 0 && (
        <p className="gf-info">Nenhum resultado encontrado.</p>
      )}

      {!loading && activeItems.length > 0 && (
        <div className="gf-grid">
          {activeItems.map((item, i) => {
            const img = getImage(item);
            return (
              <div key={`${item.id}-${i}`} className="gf-card" onClick={() => setSelected(item)}>
                {img
                  ? <img src={img} alt={item.name} loading="lazy" />
                  : <div className="gf-card-placeholder">♪</div>
                }
                <div className="gf-card-overlay">
                  <p className="gf-card-autor">{item.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div className="gf-lightbox" onClick={() => setSelected(null)}>
          <div className="gf-lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="gf-lightbox-fechar" onClick={() => setSelected(null)}>✕</button>
            {getImage(selected)
              ? <img src={getImage(selected)} alt={selected.name} />
              : <div className="gf-card-placeholder gf-placeholder-lg">♪</div>
            }
            <div className="gf-lightbox-info">
              <span>{selected.name}</span>
              <p>{getSubtitle(selected)}</p>
              {getDetail(selected) && <p>{getDetail(selected)}</p>}
              {selected.external_urls?.spotify && (
                <a href={selected.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                  Abrir no Spotify ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
