import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <h1>Bem-vindo ao PUNK.BR</h1>
      <p>Cultura, música e resistência punk no Brasil.</p>
      <div className="home__links">
        <Link to="/historia">História</Link>
        <Link to="/galeria-fotos">Galeria de Fotos</Link>
        <Link to="/galeria-musica">Galeria de Música</Link>
        <Link to="/feedbacks">Feedbacks</Link>
        <Link to="/sobre">Sobre</Link>
        <Link to="/login">Login</Link>
      </div>
    </div>
  )
}
  