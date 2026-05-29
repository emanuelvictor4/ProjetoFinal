import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const { login, cadastrar, user } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab]         = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [success, setSuccess] = useState(null)

  const [loginForm, setLoginForm] = useState({ login: '', senha: '' })

  const [registerForm, setRegisterForm] = useState({
    nome: '', cpf: '', celular: '', email: '', senha: '', confirmar: '',
  })

  if (user) {
    navigate('/')
    return null
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await login(loginForm.login, loginForm.senha)
      if (data.success) navigate('/')
      else setError(data.message)
    } catch {
      setError('Erro ao conectar com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (registerForm.senha !== registerForm.confirmar) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      const data = await cadastrar({
        nome:     registerForm.nome,
        cpf:      registerForm.cpf,
        celular:  registerForm.celular,
        email:    registerForm.email,
        senha:    registerForm.senha,
      })
      if (data.success) {
        setSuccess(data.message)
        setRegisterForm({ nome: '', cpf: '', celular: '', email: '', senha: '', confirmar: '' })
        setTimeout(() => setTab('login'), 1500)
      } else {
        setError(data.message)
      }
    } catch {
      setError('Erro ao conectar com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="login-title">PUNK.BR</h1>

        <div className="login-tabs">
          <button
            className={'login-tab' + (tab === 'login' ? ' login-tab--active' : '')}
            onClick={() => { setTab('login'); setError(null); setSuccess(null) }}
          >Entrar</button>
          <button
            className={'login-tab' + (tab === 'register' ? ' login-tab--active' : '')}
            onClick={() => { setTab('register'); setError(null); setSuccess(null) }}
          >Cadastrar</button>
        </div>

        {error   && <p className="login-msg login-msg--erro">{error}</p>}
        {success && <p className="login-msg login-msg--ok">{success}</p>}

        {tab === 'login' ? (
          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="E-mail"
              required
              value={loginForm.login}
              onChange={e => setLoginForm({ ...loginForm, login: e.target.value })}
            />
            <input
              type="password"
              placeholder="Senha"
              required
              value={loginForm.senha}
              onChange={e => setLoginForm({ ...loginForm, senha: e.target.value })}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nome completo"
              required
              value={registerForm.nome}
              onChange={e => setRegisterForm({ ...registerForm, nome: e.target.value })}
            />
            <input
              type="text"
              placeholder="CPF"
              value={registerForm.cpf}
              onChange={e => setRegisterForm({ ...registerForm, cpf: e.target.value })}
              maxLength={11}
            />
            <input
              type="text"
              placeholder="Celular"
              value={registerForm.celular}
              onChange={e => setRegisterForm({ ...registerForm, celular: e.target.value })}
            />
            <input
              type="email"
              placeholder="E-mail"
              required
              value={registerForm.email}
              onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Senha"
              required
              minLength={6}
              value={registerForm.senha}
              onChange={e => setRegisterForm({ ...registerForm, senha: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirmar senha"
              required
              value={registerForm.confirmar}
              onChange={e => setRegisterForm({ ...registerForm, confirmar: e.target.value })}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
