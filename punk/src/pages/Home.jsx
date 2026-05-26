import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home">
      <div className="home-header">
        <h1>Punk Gallery</h1>
        <p>Explore músicas, imagens e compartilhe sua opinião.</p>
      </div>

      <div className="menu-grid">
        <Link to="/login" className="menu-card">
          <h2>🔐 Login</h2>
          <p>Acesse sua conta</p>
        </Link>

        <Link to="/feedback" className="menu-card">
          <h2>⭐ Feedbacks</h2>
          <p>Veja avaliações dos usuários</p>
        </Link>

        <Link to="/fotos" className="menu-card">
          <h2>📷 Galeria</h2>
          <p>Fotos e artes punk</p>
        </Link>

        <Link to="/musicas" className="menu-card">
          <h2>🎵 Música</h2>
          <p>Artistas, álbuns e músicas</p>
        </Link>
      </div>
    </div>
  );
}