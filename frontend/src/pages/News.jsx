import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listarPostagens } from '../services/postagensService'

const PRIMARY_COLOR = '#001a33'
const SECONDARY_COLOR = '#c41e3a'
const ACCENT_COLOR = '#ffffff'
const TEXT_LIGHT = '#7a7a7a'
const BG_LIGHT = '#f5f3f0'

const News = () => {
  const [postagens, setPostagens] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')

  useEffect(() => {
    const buscar = async () => {
      try {
        const data = await listarPostagens()
        setPostagens(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    buscar()
  }, [])

  const noticias = postagens.filter((p) => p.categoria?.toLowerCase() === 'noticia')
  const eventos = postagens.filter((p) => p.categoria?.toLowerCase() === 'evento')

  const postagensFiltradas =
    filtro === 'noticias' ? noticias : filtro === 'eventos' ? eventos : postagens

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Lora:wght@400;500;600&display=swap');
        
        * {
          scroll-behavior: smooth;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Playfair Display', serif;
        }
        
        body {
          font-family: 'Lora', serif;
        }

        .news-hero {
          background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #0f2946 100%);
          color: ${ACCENT_COLOR};
          padding: 6rem 2rem 4rem;
          text-align: center;
          margin-top: 6rem;
        }

        .news-hero h1 {
          font-size: 3.5rem;
          margin: 0 0 1rem;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .news-hero p {
          font-size: 1.2rem;
          opacity: 0.9;
          margin: 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .news-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .filtros {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .filtro-btn {
          padding: 0.8rem 2rem;
          border: 2px solid ${SECONDARY_COLOR};
          background: transparent;
          color: ${PRIMARY_COLOR};
          font-weight: 600;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.3s ease;
          font-family: 'Lora', serif;
          font-size: 1rem;
        }

        .filtro-btn:hover {
          background: ${SECONDARY_COLOR};
          color: ${ACCENT_COLOR};
        }

        .filtro-btn.ativo {
          background: ${SECONDARY_COLOR};
          color: ${ACCENT_COLOR};
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .news-card {
          background: ${ACCENT_COLOR};
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 26, 51, 0.12);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }

        .news-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 26, 51, 0.2);
        }

        .news-image {
          width: 100%;
          height: 250px;
          background: ${BG_LIGHT};
          overflow: hidden;
          position: relative;
        }

        .news-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .news-card:hover .news-image img {
          transform: scale(1.05);
        }

        .news-categoria {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: ${SECONDARY_COLOR};
          color: ${ACCENT_COLOR};
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          z-index: 10;
        }

        .news-content {
          padding: 2rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .news-data {
          font-size: 0.85rem;
          color: ${TEXT_LIGHT};
          font-weight: 500;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .news-titulo {
          font-size: 1.4rem;
          font-weight: 700;
          color: ${PRIMARY_COLOR};
          margin: 0 0 1rem;
          line-height: 1.3;
          flex: 1;
        }

        .news-excerpt {
          font-size: 0.95rem;
          color: ${TEXT_LIGHT};
          line-height: 1.6;
          margin-bottom: 1.5rem;
          flex: 1;
        }

        .news-link {
          color: ${SECONDARY_COLOR};
          font-weight: 600;
          text-decoration: none;
          transition: color 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .news-link:hover {
          color: ${PRIMARY_COLOR};
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: ${TEXT_LIGHT};
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: ${PRIMARY_COLOR};
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .news-grid {
            grid-template-columns: 1fr;
          }

          .news-hero h1 {
            font-size: 2.5rem;
          }

          .filtros {
            gap: 0.5rem;
          }

          .filtro-btn {
            padding: 0.6rem 1.5rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div style={{ background: ACCENT_COLOR, minHeight: '100vh' }}>
        {/* Hero Section */}
        <section className="news-hero">
          <h1>Notícias & Eventos</h1>
          <p>Acompanhe as últimas novidades e eventos do mercado imobiliário premium</p>
        </section>

        {/* Main Content */}
        <div className="news-container">
          {/* Filtros */}
          <div className="filtros">
            <button
              className={`filtro-btn ${filtro === 'todos' ? 'ativo' : ''}`}
              onClick={() => setFiltro('todos')}
            >
              Todos
            </button>
            <button
              className={`filtro-btn ${filtro === 'noticias' ? 'ativo' : ''}`}
              onClick={() => setFiltro('noticias')}
            >
              Notícias ({noticias.length})
            </button>
            <button
              className={`filtro-btn ${filtro === 'eventos' ? 'ativo' : ''}`}
              onClick={() => setFiltro('eventos')}
            >
              Eventos ({eventos.length})
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Carregando notícias e eventos...</p>
            </div>
          )}

          {/* Grid de Postagens */}
          {!loading && postagensFiltradas.length > 0 ? (
            <div className="news-grid">
              {postagensFiltradas.map((postagem) => (
                <Link
                  key={postagem._id || postagem.slug}
                  to={`/postagem/${postagem.slug}`}
                  className="news-card"
                >
                  <div className="news-image">
                    {postagem.imagem && (
                      <img src={postagem.imagem} alt={postagem.titulo} />
                    )}
                    {!postagem.imagem && (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'grid',
                          placeItems: 'center',
                          background: BG_LIGHT,
                          color: TEXT_LIGHT,
                        }}
                      >
                        Sem imagem
                      </div>
                    )}
                    <div className="news-categoria">
                      {postagem.categoria || 'Notícia'}
                    </div>
                  </div>

                  <div className="news-content">
                    <div className="news-data">
                      {postagem.dataEvento &&
                      postagem.categoria?.toLowerCase() === 'evento'
                        ? `Evento em ${new Date(
                            postagem.dataEvento
                          ).toLocaleDateString('pt-BR')}`
                        : `Postado em ${new Date(
                            postagem.dataPublicacao
                          ).toLocaleDateString('pt-BR')}`}
                    </div>
                    <h3 className="news-titulo">{postagem.titulo}</h3>
                    <p className="news-excerpt">
                      {postagem.conteudo?.substring(0, 150)}...
                    </p>
                    <div className="news-link">
                      <span>Ler mais</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            !loading && (
              <div className="empty-state">
                <h3>Nenhuma postagem encontrada</h3>
                <p>
                  {filtro === 'noticias'
                    ? 'Ainda não há notícias disponíveis'
                    : filtro === 'eventos'
                    ? 'Ainda não há eventos disponíveis'
                    : 'Ainda não há postagens disponíveis'}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  )
}

export default News
