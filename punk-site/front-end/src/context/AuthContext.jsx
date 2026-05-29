import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const AUTH = 'http://localhost/punk-site/back-end/api/auth.php'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.post(AUTH, { action: 'session' }, { withCredentials: true })
      .then(({ data }) => { if (data.success) setUser(data.user) })
      .finally(() => setLoading(false))
  }, [])

  async function login(login, senha) {
    const { data } = await axios.post(AUTH, { action: 'login', login, senha }, { withCredentials: true })
    if (data.success) setUser(data.user)
    return data
  }

  async function cadastrar(dados) {
    const { data } = await axios.post(AUTH, { action: 'register', ...dados }, { withCredentials: true })
    return data
  }

  async function logout() {
    await axios.post(AUTH, { action: 'logout' }, { withCredentials: true })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, cadastrar, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
