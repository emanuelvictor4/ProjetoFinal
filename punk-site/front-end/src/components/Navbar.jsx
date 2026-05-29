import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/navbar.css'

const links = [
  { to: '/historia',       label: 'História' },
  { to: '/galeria-fotos',  label: 'Galeria de Fotos' },
  { to: '/galeria-musica', label: 'Galeria de Música' },
  { to: '/feedbacks',      label: 'Feedbacks' },
  { to: '/sobre',      label: 'Sobre' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <NavLink to="/" className="navbar__brand">PUNK.BR</NavLink>
      <nav className="navbar__nav">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              'navbar__link' + (isActive ? ' navbar__link--active' : '')
            }
          >
            {label}
          </NavLink>
        ))}

        {user ? (
          <>
            <span className="navbar__user">Olá, {user.nome.split(' ')[0]}</span>
            <button className="navbar__link navbar__logout" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              'navbar__link' + (isActive ? ' navbar__link--active' : '')
            }
          >
            Login
          </NavLink>
        )}
      </nav>
    </header>
  )
}
