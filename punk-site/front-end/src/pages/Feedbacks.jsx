import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import './Feedbacks.css'

const API = 'http://localhost/punk-site/back-end/api/feedbacks.php'

const estrelas = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)
const formatarData = (s) => new Date(s).toLocaleDateString('pt-BR')

export default function Feedbacks() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading]     = useState(true)
  const [erro, setErro]           = useState(null)

  // form novo
  const [mensagem, setMensagem] = useState('')
  const [nota, setNota]         = useState(5)
  const [enviando, setEnviando] = useState(false)

  // edição
  const [editId, setEditId]         = useState(null)
  const [editMensagem, setEditMensagem] = useState('')
  const [editNota, setEditNota]         = useState(5)

  useEffect(() => { carregar() }, [])

  async function carregar() {
    setLoading(true)
    try {
      const { data } = await axios.post(API, { action: 'list' }, { withCredentials: true })
      if (data.success) setFeedbacks(data.feedbacks)
    } finally {
      setLoading(false)
    }
  }

  async function handleCriar(e) {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setErro(null)
    setEnviando(true)
    try {
      const { data } = await axios.post(API, { action: 'create', mensagem, nota }, { withCredentials: true })
      if (data.success) { setMensagem(''); setNota(5); carregar() }
      else setErro(data.message)
    } catch {
      setErro('Erro ao conectar com o servidor.')
    } finally {
      setEnviando(false)
    }
  }

  async function handleEditar(id) {
    setErro(null)
    try {
      const { data } = await axios.post(
        API,
        { action: 'update', id, mensagem: editMensagem, nota: editNota },
        { withCredentials: true }
      )
      if (data.success) { setEditId(null); carregar() }
      else setErro(data.message)
    } catch {
      setErro('Erro ao conectar com o servidor.')
    }
  }

  async function handleDeletar(id) {
    if (!window.confirm('Deletar este feedback?')) return
    setErro(null)
    try {
      const { data } = await axios.post(API, { action: 'delete', id }, { withCredentials: true })
      if (data.success) carregar()
      else setErro(data.message)
    } catch {
      setErro('Erro ao conectar com o servidor.')
    }
  }

  function iniciarEdicao(fb) {
    setEditId(fb.id)
    setEditMensagem(fb.mensagem)
    setEditNota(Number(fb.nota))
  }

  return (
    <div className="fb-page">
      <h1>Feedbacks</h1>

      {user ? (
        <form onSubmit={handleCriar} className="fb-form">
          <h2>Deixar um feedback</h2>

          <label>Nota</label>
          <div className="fb-stars">
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button"
                className={'fb-star' + (n <= nota ? ' fb-star--on' : '')}
                onClick={() => setNota(n)}
              >★</button>
            ))}
          </div>

          <label>Comentário</label>
          <textarea
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
            required rows={3}
            placeholder="Escreva seu comentário..."
          />

          {erro && <p className="fb-erro">{erro}</p>}
          <button type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Publicar'}
          </button>
        </form>
      ) : (
        <p className="fb-aviso">
          <button onClick={() => navigate('/login')} className="fb-link">Faça login</button>{' '}
          para deixar um feedback.
        </p>
      )}

      <div className="fb-lista">
        {loading && <p className="fb-info">Carregando...</p>}
        {!loading && feedbacks.length === 0 && (
          <p className="fb-info">Nenhum feedback ainda. Seja o primeiro!</p>
        )}

        {feedbacks.map(fb => (
          <div key={fb.id} className="fb-card">
            {editId === fb.id ? (
              <div className="fb-edit">
                <div className="fb-stars">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button"
                      className={'fb-star' + (n <= editNota ? ' fb-star--on' : '')}
                      onClick={() => setEditNota(n)}
                    >★</button>
                  ))}
                </div>
                <textarea
                  value={editMensagem}
                  onChange={e => setEditMensagem(e.target.value)}
                  rows={3}
                />
                {erro && <p className="fb-erro">{erro}</p>}
                <div className="fb-edit-btns">
                  <button onClick={() => handleEditar(fb.id)}>Salvar</button>
                  <button onClick={() => setEditId(null)} className="fb-btn-cancel">Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div className="fb-card-header">
                  <span className="fb-autor">{fb.nome}</span>
                  <span className="fb-nota">{estrelas(Number(fb.nota))}</span>
                  <span className="fb-data">{formatarData(fb.criado_em)}</span>
                </div>
                <p className="fb-mensagem">{fb.mensagem}</p>
                {user && String(user.idusuarios) === String(fb.idusuario) && (
                  <div className="fb-acoes">
                    <button onClick={() => iniciarEdicao(fb)}>Editar</button>
                    <button onClick={() => handleDeletar(fb.id)} className="fb-btn-del">Deletar</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
