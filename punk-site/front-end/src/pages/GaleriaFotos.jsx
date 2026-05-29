import { useState, useEffect } from 'react'
import axios from 'axios'
import './GaleriaFotos.css'

const ACCESS_KEY = 't1QdO_E4LZKp4Pi5FgDdJebgPthQSDQHe5dchZiXtfY'
const API = 'https://api.unsplash.com/search/photos'

const CATEGORIAS = ['punk', 'punk rock', 'punk fashion', 'anarchy', 'punk band']

export default function GaleriaFotos() {
  const [fotos, setFotos]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [erro, setErro]           = useState(null)
  const [categoria, setCategoria] = useState('punk')
  const [pagina, setPagina]       = useState(1)
  const [total, setTotal]         = useState(0)
  const [fotoAberta, setFotoAberta] = useState(null)

  useEffect(() => {
    buscar(categoria, pagina)
  }, [categoria, pagina])

  async function buscar(query, page) {
    setLoading(true)
    setErro(null)
    try {
      const { data } = await axios.get(API, {
        params: {
          query,
          page,
          per_page: 12,
          client_id: ACCESS_KEY,
        },
      })
      setFotos(data.results)
      setTotal(data.total_pages)
    } catch (e) {
      setErro('Erro ao carregar fotos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function trocarCategoria(nova) {
    setCategoria(nova)
    setPagina(1)
    setFotos([])
  }

  return (
    <div className="gf-page">
      <h1>Galeria de Fotos</h1>

      {/* Filtros */}
      <div className="gf-filtros">
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => trocarCategoria(cat)}
            className={'gf-filtro' + (categoria === cat ? ' gf-filtro--ativo' : '')}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {erro && <p className="gf-erro">{erro}</p>}

      {loading ? (
        <p className="gf-info">Carregando fotos...</p>
      ) : fotos.length === 0 ? (
        <p className="gf-info">Nenhuma foto encontrada.</p>
      ) : (
        <div className="gf-grid">
          {fotos.map(foto => (
            <div
              key={foto.id}
              className="gf-card"
              onClick={() => setFotoAberta(foto)}
            >
              <img
                src={foto.urls.small}
                alt={foto.alt_description || foto.description || 'Foto punk'}
                loading="lazy"
              />
              <div className="gf-card-overlay">
                <span className="gf-card-autor">📷 {foto.user.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {!loading && fotos.length > 0 && (
        <div className="gf-paginacao">
          <button
            onClick={() => setPagina(p => p - 1)}
            disabled={pagina === 1}
          >
            ← Anterior
          </button>
          <span>Página {pagina} de {total}</span>
          <button
            onClick={() => setPagina(p => p + 1)}
            disabled={pagina === total}
          >
            Próxima →
          </button>
        </div>
      )}

      {/* Lightbox */}
      {fotoAberta && (
        <div className="gf-lightbox" onClick={() => setFotoAberta(null)}>
          <div className="gf-lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="gf-lightbox-fechar" onClick={() => setFotoAberta(null)}>✕</button>
            <img src={fotoAberta.urls.regular} alt={fotoAberta.alt_description || ''} />
            <div className="gf-lightbox-info">
              <span>📷 {fotoAberta.user.name}</span>
              {fotoAberta.description && <p>{fotoAberta.description}</p>}
              <a href={fotoAberta.links.html} target="_blank" rel="noreferrer">
                Ver no Unsplash
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
