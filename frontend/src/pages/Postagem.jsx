import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obterPostagem, listarPostagens } from '../services/postagensService';

// Cores sofisticadas
const PRIMARY_COLOR = '#001a33';
const SECONDARY_COLOR = '#c41e3a';
const ACCENT_COLOR = '#ffffff';
const TEXT_DARK = '#0a0e27';
const TEXT_LIGHT = '#7a7a7a';
const BG_LIGHT = '#f5f3f0';

const Postagem = () => {
  const { slug } = useParams();
  const [postagem, setPostagem] = useState(null);
  const [postagenRelacionadas, setPostagensRelacionadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verifica se há token no localStorage
    const token = localStorage.getItem('gc_token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const buscar = async () => {
      try {
        setLoading(true);
        const data = await obterPostagem(slug);
        setPostagem(data);

        // Busca postagens relacionadas (mesma categoria)
        const todas = await listarPostagens();
        const relacionadas = (Array.isArray(todas) ? todas : [])
          .filter(p => p.categoria === data.categoria && p.slug !== slug)
          .sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao))
          .slice(0, 3);
        
        setPostagensRelacionadas(relacionadas);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar postagem:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    buscar();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ ...loadingStyle, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error || !postagem) {
    return (
      <div style={{ ...errorStyle, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: TEXT_DARK, fontSize: '2rem', marginBottom: '1rem' }}>Postagem não encontrada</h2>
          <p style={{ color: TEXT_LIGHT, marginBottom: '2rem' }}>Desculpe, não conseguimos encontrar a postagem que você procura.</p>
          <Link to="/" style={{ ...backButtonStyle }}>Voltar para Home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Lora:wght@400;500;600&display=swap');
        
        * {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Lora', serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Playfair Display', serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(196, 30, 58, 0.15);
          }
          50% {
            box-shadow: 0 12px 36px rgba(196, 30, 58, 0.25);
          }
        }

        .fadeIn {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .slideInDown {
          animation: slideInDown 0.6s ease-out;
        }

        .scaleIn {
          animation: scaleIn 0.6s ease-out;
        }

        a[href*="/postagem/"] {
          position: relative;
          display: block;
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        a[href*="/postagem/"]:hover {
          box-shadow: 0 20px 60px rgba(0, 26, 51, 0.3) !important;
          transform: translateY(-8px) !important;
        }

        a[href*="/postagem/"] div:first-child {
          position: relative;
          overflow: hidden;
        }

        a[href*="/postagem/"] div:first-child::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(196, 30, 58, 0);
          transition: background 0.4s ease;
          z-index: 3;
        }

        a[href*="/postagem/"]:hover div:first-child::after {
          background: rgba(196, 30, 58, 0);
        }

        a[href*="/postagem/"] img {
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        a[href*="/postagem/"]:hover img {
          transform: scale(1.08);
        }

        section {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>

      {/* Hero Section com Imagem */}
      <section style={{
        height: '60vh',
        background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #1a3a5c 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        padding: '3rem',
        position: 'relative',
        color: ACCENT_COLOR,
        overflow: 'hidden'
      }}>
        {/* Fundo com imagem centralizada */}
        {postagem.imagem && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fafafa',
            zIndex: 1
          }}>
            <img
              src={postagem.imagem}
              alt={postagem.titulo}
              style={{
                maxWidth: '95%',
                maxHeight: '95%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        )}

        {/* Overlay escuro */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
          zIndex: 2
        }} />

        {/* Conteúdo em cima */}
        <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 3 }}>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '2px',
            color: SECONDARY_COLOR,
            textTransform: 'uppercase',
            marginBottom: '1rem',
            display: 'inline-block',
            background: `rgba(196, 30, 58, 0.2)`,
            padding: '0.6rem 1.2rem',
            borderRadius: '30px',
            backdropFilter: 'blur(10px)'
          }}>
            {postagem.categoria || 'Notícia'}
          </span>
          
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            margin: '1rem 0',
            letterSpacing: '-1px',
            fontFamily: "'Playfair Display', serif",
            lineHeight: 1.1,
            color: ACCENT_COLOR
          }}>
            {postagem.titulo}
          </h1>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            {postagem.dataEvento && postagem.categoria === 'evento' ? (
              <span style={{ fontSize: '1.2rem', color: SECONDARY_COLOR, fontWeight: 700 }}>
                📅 {new Date(postagem.dataEvento).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            ) : (
              <span style={{ fontSize: '1rem', color: ACCENT_COLOR }}>
                � {new Date(postagem.dataPublicacao).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section style={{ padding: '5rem 3rem', background: ACCENT_COLOR }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: TEXT_DARK,
            marginBottom: '4rem',
            fontFamily: "'Lora', serif"
          }}>
            {postagem.conteudo?.split('\n').map((paragrafo, idx) => (
              <p key={idx} style={{ marginBottom: '1.5rem' }}>
                {paragrafo}
              </p>
            ))}
          </div>

          {/* Divisor */}
          <div style={{
            height: '2px',
            background: BG_LIGHT,
            margin: '4rem 0',
            borderRadius: '1px'
          }} />

          {/* Info da Postagem */}
          <div style={{
            background: BG_LIGHT,
            padding: '2rem',
            borderRadius: '0',
            marginBottom: '4rem'
          }}>
            <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div>
                <p style={{ color: TEXT_LIGHT, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 0.5rem' }}>Categoria</p>
                <p style={{ color: PRIMARY_COLOR, fontSize: '1.2rem', fontWeight: 700, margin: 0, textTransform: 'capitalize' }}>
                  {postagem.categoria || 'Notícia'}
                </p>
              </div>
              {postagem.dataEvento && postagem.categoria === 'evento' ? (
                <div>
                  <p style={{ color: TEXT_LIGHT, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 0.5rem' }}>Data do Evento</p>
                  <p style={{ color: SECONDARY_COLOR, fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                    {new Date(postagem.dataEvento).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ color: TEXT_LIGHT, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 0.5rem' }}>Data de Publicação</p>
                  <p style={{ color: PRIMARY_COLOR, fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                    {new Date(postagem.dataPublicacao).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
              {isLoggedIn && (
                <div>
                  <p style={{ color: TEXT_LIGHT, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 0.5rem' }}>Status</p>
                  <p style={{ 
                    color: postagem.status === 'publicado' ? '#10b981' : TEXT_LIGHT, 
                    fontSize: '1.2rem', 
                    fontWeight: 700, 
                    margin: 0,
                    textTransform: 'capitalize'
                  }}>
                    {postagem.status || 'Publicado'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CTA Voltar */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Link to="/" style={{
              display: 'inline-block',
              padding: '1.2rem 3rem',
              background: PRIMARY_COLOR,
              color: ACCENT_COLOR,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: '0',
              transition: 'all 0.4s ease',
              border: `2px solid ${PRIMARY_COLOR}`,
              cursor: 'pointer',
              letterSpacing: '0.5px'
            }}>
              ← Voltar para Home
            </Link>
          </div>
        </div>
      </section>

      {/* Postagens Relacionadas */}
      {postagenRelacionadas.length > 0 && (
        <section style={{
          padding: '6rem 3rem',
          background: BG_LIGHT,
          borderTop: `2px solid ${SECONDARY_COLOR}`
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
              <h2 style={{
                fontSize: '2.8rem',
                fontWeight: 800,
                margin: '0',
                letterSpacing: '-1px',
                fontFamily: "'Playfair Display', serif",
                color: PRIMARY_COLOR
              }}>
                Leia também
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: TEXT_LIGHT,
                margin: '1rem auto 0',
                maxWidth: '600px'
              }}>
                Confira outras postagens da categoria {postagem.categoria}
              </p>
            </div>

            <div style={{
              display: 'grid',
              gap: '2.5rem',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
            }}>
              {postagenRelacionadas.map((p, idx) => (
                <Link
                  key={p._id || p.slug}
                  to={`/postagem/${p.slug}`}
                  style={{
                    ...postagemCardStyle,
                    animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s forwards`,
                    opacity: 0,
                    height: '380px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  className="fadeIn"
                >
                  {/* Imagem de fundo */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: p.imagem ? `url(${p.imagem})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 1
                  }} />

                  {/* Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60%',
                    background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.95))',
                    zIndex: 5
                  }} />

                  {/* Conteúdo Sobreposto */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '2.5rem 2rem',
                    zIndex: 10,
                    color: ACCENT_COLOR,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      background: SECONDARY_COLOR,
                      color: ACCENT_COLOR,
                      padding: '0.5rem 1rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '1rem',
                      width: 'fit-content',
                      boxShadow: '0 4px 12px rgba(196, 30, 58, 0.2)',
                    }}>
                      {p.categoria || 'Notícia'}
                    </span>
                    <h3 style={{
                      margin: '0 0 0.8rem',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: ACCENT_COLOR,
                      lineHeight: 1.3,
                      fontFamily: "'Playfair Display', serif",
                    }}>
                      {p.titulo}
                    </h3>
                    <p style={{
                      margin: '0 0 1rem',
                      fontSize: '0.95rem',
                      color: ACCENT_COLOR,
                      lineHeight: 1.6,
                    }}>
                      {p.conteudo?.substring(0, 100)}...
                    </p>
                    <span style={{
                      fontSize: '0.85rem',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: 500,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      marginTop: 'auto',
                      paddingTop: '1rem',
                    }}>
                      {p.dataEvento && p.categoria === 'evento' 
                        ? new Date(p.dataEvento).toLocaleDateString('pt-BR')
                        : new Date(p.dataPublicacao).toLocaleDateString('pt-BR')
                      }
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

// Estilos
const loadingStyle = {
  textAlign: 'center',
  color: TEXT_LIGHT,
  fontSize: '1.1rem'
};

const errorStyle = {
  textAlign: 'center',
  color: TEXT_DARK,
  padding: '3rem'
};

const backButtonStyle = {
  display: 'inline-block',
  padding: '1.2rem 3rem',
  background: PRIMARY_COLOR,
  color: ACCENT_COLOR,
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  borderRadius: '0',
  transition: 'all 0.4s ease',
  border: `2px solid ${PRIMARY_COLOR}`,
  cursor: 'pointer',
  letterSpacing: '0.5px'
};

const postagemCardStyle = {
  background: ACCENT_COLOR,
  border: 'none',
  borderRadius: '0',
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
  boxShadow: '0 8px 24px rgba(0, 29, 68, 0.12)',
  cursor: 'pointer',
  position: 'relative',
};

const postagemImageStyle = {
  height: '250px',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  position: 'relative',
  width: '100%',
};

const postagemBodyStyle = {
  padding: '2.5rem 2rem',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

const postagemCategoriaStyle = {
  display: 'inline-block',
  background: SECONDARY_COLOR,
  color: ACCENT_COLOR,
  padding: '0.5rem 1rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '1rem',
  width: 'fit-content',
  boxShadow: '0 4px 12px rgba(196, 30, 58, 0.2)',
};

const postagemTitleStyle = {
  margin: '0 0 1rem',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: PRIMARY_COLOR,
  lineHeight: 1.3,
  fontFamily: "'Playfair Display', serif",
  flex: 1,
};

const postagemExcerptStyle = {
  margin: '0 0 1.5rem',
  fontSize: '0.95rem',
  color: TEXT_LIGHT,
  lineHeight: 1.6,
  flex: 1,
};

const postagemDataStyle = {
  fontSize: '0.85rem',
  color: TEXT_LIGHT,
  fontWeight: 500,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  marginTop: 'auto',
  paddingTop: '1rem',
  borderTop: `1px solid #e5e7eb`,
};

export default Postagem;
