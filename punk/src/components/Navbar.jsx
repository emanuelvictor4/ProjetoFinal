import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-black border-b border-[#1a1a1a] px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <Link
          to="/"
          className="text-xl font-bold text-[#1DB954]"
        >
          Punk Gallery
        </Link>

        <div className="flex gap-5 text-sm">
          <Link to="/" className="hover:text-[#1DB954]">
            Home
          </Link>

          <Link to="/fotos" className="hover:text-[#1DB954]">
            Fotos
          </Link>

          <Link to="/musicas" className="hover:text-[#1DB954]">
            Músicas
          </Link>

          <Link to="/feedback" className="hover:text-[#1DB954]">
            Feedback
          </Link>
        </div>

      </div>
    </nav>
  );
}