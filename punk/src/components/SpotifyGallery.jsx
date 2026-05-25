import { useState, useRef, useEffect } from "react";
import axios from "axios";

// IDs fixos do Spotify
const ARTIST_IDS = [
  "7oPftvlwr6VrsViSDV7fJY"
];

const ALBUM_IDS = [
  "45eDjdVVHPTzCFUAQiXhmL"
];

const TRACK_IDS = [
  "6l8GvAyoUZwWDgF1e4822w"
];

async function getToken() {
  const { data } = await axios.post("http://localhost/projetoFinal/punk/back-end/spotify-token.php");
  return data.access_token;
}

export default function SpotifyGallery() {
  const [tab, setTab] = useState("tracks");
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);
  const audioRef = useRef(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();

      console.log("TOKEN:", token);

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const teste = await axios.get(
        "https://api.spotify.com/v1/artists/7oPftvlwr6VrsViSDV7fJY",
        { headers }
      );

      console.log("TESTE ARTISTA:", teste.data);

      const [tracksRes, albumsRes, artistsRes] = await Promise.all([
        axios.get("https://api.spotify.com/v1/tracks", {
          headers,
          params: { ids: TRACK_IDS.join(",") },
        }),
        axios.get("https://api.spotify.com/v1/albums", {
          headers,
          params: { ids: ALBUM_IDS.join(",") },
        }),
        axios.get("https://api.spotify.com/v1/artists", {
          headers,
          params: { ids: ARTIST_IDS.join(",") },
        }),
      ]);

      setTracks((tracksRes.data.tracks || []).filter(Boolean));
      setAlbums((albumsRes.data.albums || []).filter(Boolean));
      setArtists((artistsRes.data.artists || []).filter(Boolean));

      setLoaded(true);
    } catch (err) {
      console.error("===== ERRO SPOTIFY =====");
      console.error("Status:", err.response?.status);
      console.error("Data:", err.response?.data);
      console.error("Erro completo:", err);

      setError("Erro ao carregar conteúdo do Spotify.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const playPreview = (track) => {
    if (!track?.preview_url || !audioRef.current) return;

    if (currentPreview?.id === track.id) {
      audioRef.current.pause();
      setCurrentPreview(null);
      return;
    }

    audioRef.current.src = track.preview_url;
    audioRef.current.play();
    setCurrentPreview(track);
  };

  const TABS = [
    { key: "tracks", label: "Músicas" },
    { key: "albums", label: "Álbuns" },
    { key: "artists", label: "Artistas" },
  ];

  return (
    <section className="min-h-screen bg-black text-white pb-28">
      <audio ref={audioRef} onEnded={() => setCurrentPreview(null)} />

      {/* Header */}
      <div className="flex flex-col items-center pt-16 pb-10 px-6">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#1DB954">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <h1 className="text-xl font-bold tracking-tight">Galeria Musical</h1>
        </div>
        <p className="text-xs text-[#555] mt-2">Punk & Rock</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-5 h-5 border-2 border-[#333] border-t-[#1DB954] rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center py-16 gap-3">
          <p className="text-red-400 text-sm">{error}</p>
          <button onClick={fetchAll} className="text-[#1DB954] text-sm hover:underline underline-offset-4">
            tentar novamente
          </button>
        </div>
      )}

      {/* Content */}
      {loaded && !loading && (
        <div className="max-w-4xl mx-auto px-6">

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${tab === key
                  ? "bg-white text-black"
                  : "text-[#aaa] hover:text-white border border-[#333] hover:border-[#555]"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tracks — 2 colunas de 5 */}
          {tab === "tracks" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {[tracks.slice(0, 4), tracks.slice(4)].map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col">
                  {col.map((track, i) => (
                    <div key={track.id} className="flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-[#1a1a1a] group transition-colors">
                      <span className="text-xs text-[#555] w-4 text-right shrink-0">{colIdx * 4 + i + 1}</span>
                      {track.album?.images?.[2] && (
                        <img src={track.album.images[2].url} alt="" className="w-10 h-10 rounded shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{track.name}</p>
                        <p className="text-xs text-[#aaa] truncate mt-0.5">{track.artists?.map(a => a.name).join(", ")}</p>
                      </div>
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        {track.preview_url ? (
                          <button
                            onClick={() => playPreview(track)}
                            className={`text-xs px-3 py-1 rounded-full transition-colors ${currentPreview?.id === track.id
                              ? "bg-[#1DB954] text-black font-semibold"
                              : "border border-[#333] text-[#aaa] hover:border-[#1DB954] hover:text-[#1DB954]"
                              }`}
                          >
                            {currentPreview?.id === track.id ? "⏸ pausar" : "▶ preview"}
                          </button>
                        ) : (
                          <span className="text-xs text-[#333]">sem preview</span>
                        )}
                        <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-[#1DB954] transition-colors text-sm">↗</a>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Albums */}
          {tab === "albums" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {albums.map(album => (
                <a key={album.id} href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="group">
                  <div className="aspect-square overflow-hidden rounded-lg bg-[#1a1a1a] mb-3">
                    {album.images?.[1] && (
                      <img src={album.images[1].url} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-white truncate">{album.name}</p>
                  <p className="text-xs text-[#aaa] truncate mt-0.5">{track.artists?.map(a => a.name).join(", ")}</p>
                  <p className="text-xs text-[#555] mt-0.5">{album.release_date?.slice(0, 4)}</p>
                </a>
              ))}
            </div>
          )}

          {/* Artists */}
          {tab === "artists" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {artists.map(artist => (
                <a key={artist.id} href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center text-center">
                  <div className="w-full aspect-square overflow-hidden rounded-full bg-[#1a1a1a] mb-3">
                    {artist.images?.[1] ? (
                      <img src={artist.images[1].url} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-[#333]">♪</div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-white truncate w-full">{artist.name}</p>
                  <p className="text-xs text-[#555] mt-0.5">{artist.followers?.total?.toLocaleString()} seguidores</p>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Now playing bar */}
      {currentPreview && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#181818] border-t border-[#282828] px-6 py-3 flex items-center gap-4 z-50">
          {currentPreview.album?.images?.[2] && (
            <img src={currentPreview.album.images[2].url} alt="" className="w-10 h-10 rounded shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentPreview.name}</p>
            <p className="text-xs text-[#aaa] truncate">{currentPreview.artists.map(a => a.name).join(", ")}</p>
          </div>
          <span className="text-xs text-[#1DB954] shrink-0">▶ preview 30s</span>
          <button
            onClick={() => { audioRef.current.pause(); setCurrentPreview(null); }}
            className="text-[#555] hover:text-white transition-colors text-xl leading-none ml-2"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
