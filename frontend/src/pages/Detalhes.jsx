import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { IoBedOutline, IoCarOutline, IoLocationOutline } from 'react-icons/io5'
import { LuBath, LuRuler, LuSparkles } from 'react-icons/lu'
import { BsWhatsapp } from 'react-icons/bs'
import useImoveis from '../hooks/useImoveis'
import Galeria from '../components/Galeria'

const PRIMARY_COLOR = '#001a33'
const SECONDARY_COLOR = '#c41e3a'
const ACCENT_COLOR = '#ffffff'
const TEXT_DARK = '#0a0e27'
const TEXT_LIGHT = '#7a7a7a'

const Detalhes = () => {
  const { slug } = useParams()
  const { imoveis, loading } = useImoveis()
  const imovel = imoveis.find((item) => item.slug === slug) || {}
  const [formContato, setFormContato] = useState({ nome: '', email: '', telefone: '', mensagem: '' })
  const [mapSrc, setMapSrc] = useState('')

  useEffect(() => {
    if (imovel.bairro && imovel.cidade) {
      const address = `${imovel.bairro}, ${imovel.cidade}, São Paulo, Brasil`
      const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(address)}`
      setMapSrc(`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`)
    }
  }, [imovel])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormContato((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Mensagem enviada! Entraremos em contato.')
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '3rem', marginTop: '6rem' }}><p>Carregando...</p></div>
  if (!imovel.slug) return <div style={{ textAlign: 'center', padding: '3rem', marginTop: '6rem' }}><p>Imóvel não encontrado.</p></div>

  const whatsappUrl = `${import.meta.env.VITE_WHATSAPP_URL_BASE || 'https://wa.me/'}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel: ${imovel.titulo}`)}`
  const caracteristicasCustom = Array.isArray(imovel.caracteristicas)
    ? imovel.caracteristicas.filter((c) => c && (c.titulo || c.valor || c.icone))
    : []

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
        
        .detalhes-page {
          background: #ffffff;
          min-height: 100vh;
          margin-top: 6rem;
        }
        
        .detalhes-header {
          max-width: 1300px;
          margin: 0 auto;
          padding: 3rem 2rem 2rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .breadcrumb {
          font-size: 0.9rem;
          color: #7a7a7a;
          margin-bottom: 2rem;
          font-weight: 500;
        }
        
        .breadcrumb a {
          color: #7a7a7a;
          text-decoration: none;
          transition: color 0.3s;
        }
        
        .breadcrumb a:hover {
          color: #c41e3a;
        }
        
        .titulo-principal {
          font-size: 3rem;
          font-weight: 800;
          color: #001a33;
          margin: 0 0 1rem;
          letter-spacing: -1px;
          line-height: 1.2;
        }
        
        .localizacao {
          font-size: 1.1rem;
          color: #7a7a7a;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 0;
        }
        
        .tipo-badge {
          color: #001a33;
          font-weight: 600;
          background: rgba(196, 30, 58, 0.1);
          padding: 0.35rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
        }
        
        .galeria-wrapper {
          max-width: 1300px;
          margin: 2rem auto 0;
          padding: 0 2rem;
        }
        
        .conteudo-principal {
          max-width: 1300px;
          margin: 0 auto;
          padding: 3rem 2rem;
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 4rem;
        }
        
        .coluna-esquerda {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        
        .caracteristicas-rapidas {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1.5rem;
          padding: 2.5rem;
          background: #f9fafb;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }
        
        .caract-item {
          text-align: center;
        }
        
        .caract-label {
          font-size: 0.75rem;
          color: #7a7a7a;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.8rem;
          letter-spacing: 0.5px;
        }
        
        .caract-valor {
          font-size: 1.8rem;
          font-weight: 800;
          color: #c41e3a;
          margin: 0;
        }
        
        .secao-titulo {
          font-size: 1.8rem;
          font-weight: 800;
          color: #001a33;
          margin: 0 0 1.5rem;
          letter-spacing: -0.5px;
        }
        
        .secao-texto {
          color: #7a7a7a;
          font-size: 1.05rem;
          line-height: 1.8;
          margin: 0;
          white-space: pre-line;
        }
        
        .grid-caract {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1.5rem;
        }
        
        .card-caract {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .card-caract:hover {
          background: #fff;
          border-color: #c41e3a;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(196, 30, 58, 0.15);
        }
        
        .card-caract-icone {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 0.75rem;
          color: #c41e3a;
        }
        
        .card-caract-label {
          font-size: 0.75rem;
          color: #7a7a7a;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          letter-spacing: 0.5px;
        }
        
        .card-caract-valor {
          font-size: 1.2rem;
          font-weight: 700;
          color: #001a33;
          margin: 0;
        }
        
        .coluna-direita {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: sticky;
          top: 8rem;
          height: fit-content;
        }
        
        .preco-card {
          background: linear-gradient(135deg, #001a33 0%, #0f2946 100%);
          color: #ffffff;
          border-radius: 12px;
          padding: 2.5rem;
          text-align: center;
          box-shadow: 0 8px 24px rgba(0, 26, 51, 0.2);
        }
        
        .preco-label {
          margin: 0 0 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .preco-valor {
          font-size: 2.8rem;
          font-weight: 800;
          color: #c41e3a;
          margin: 0;
        }
        
        .btn-whatsapp {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, #c41e3a 0%, #8b1528 100%);
          color: #ffffff;
          padding: 1.3rem 1.5rem;
          border-radius: 0px;
          text-decoration: none;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: none;
          box-shadow: 0 8px 20px rgba(196, 30, 58, 0.3);
          cursor: pointer;
          font-family: 'Lora', serif;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .btn-whatsapp:hover {
          background: linear-gradient(135deg, #e82d48 0%, #a0213d 100%);
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(196, 30, 58, 0.45);
        }
        
        .formulario-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 4rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          margin: 0.5rem auto;
          max-width: 500px;
        }
        
        .form-titulo {
          font-size: 1.2rem;
          font-weight: 700;
          color: #001a33;
          margin: 0 0 1.5rem;
        }
        
        .form-input {
          width: 100%;
          padding: 0.65rem 1rem;
          border-radius: 6px;
          border: 1.5px solid #e5e7eb;
          background: #ffffff;
          color: #001a33;
          font-size: 0.9rem;
          font-family: 'Lora', serif;
          transition: all 0.3s ease;
          margin-bottom: 0.8rem;
          box-sizing: border-box;
        }
        
        .form-input::placeholder {
          color: #9ca3af;
          text-align: center;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #c41e3a;
          box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.1);
        }
        
        .btn-enviar {
          width: 100%;
          padding: 0.9rem 1.5rem;
          background: linear-gradient(135deg, #001a33 0%, #0f2946 100%);
          color: #ffffff;
          border: none;
          border-radius: 0px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          font-family: 'Lora', serif;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(0, 26, 51, 0.2);
          box-sizing: border-box;
        }
        
        .btn-enviar:hover {
          background: linear-gradient(135deg, #c41e3a 0%, #8b1528 100%);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(196, 30, 58, 0.3);
        }
        
        @media (max-width: 968px) {
          .conteudo-principal {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .coluna-direita {
            position: relative;
            top: 0;
          }
          
          .titulo-principal {
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="detalhes-page">
        {/* Header */}
        <div className="detalhes-header">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span style={{ margin: '0 0.75rem' }}>→</span>
            <span style={{ color: '#001a33', fontWeight: 600 }}>{imovel.titulo}</span>
          </nav>

          <h1 className="titulo-principal">{imovel.titulo}</h1>
          <p className="localizacao">
            <IoLocationOutline style={{ fontSize: '1.4rem', color: '#c41e3a', flexShrink: 0 }} />
            {imovel.bairro}, {imovel.cidade}
            <span className="tipo-badge">{imovel.tipo}</span>
          </p>
        </div>

        {/* Galeria */}
        <div className="galeria-wrapper">
          <Galeria midias={imovel.midias || []} titulo={imovel.titulo} />
        </div>

        {/* Conteúdo Principal */}
        <div className="conteudo-principal">
          {/* Coluna Esquerda */}
          <div className="coluna-esquerda">
            {/* Características Rápidas */}
            <div className="caracteristicas-rapidas">
              {imovel.area && (
                <div className="caract-item">
                  <p className="caract-label">Área</p>
                  <p className="caract-valor">{imovel.area} m²</p>
                </div>
              )}
              {imovel.quartos && (
                <div className="caract-item">
                  <p className="caract-label">Quartos</p>
                  <p className="caract-valor">{imovel.quartos}</p>
                </div>
              )}
              {imovel.banheiros && (
                <div className="caract-item">
                  <p className="caract-label">Banheiros</p>
                  <p className="caract-valor">{imovel.banheiros}</p>
                </div>
              )}
              {imovel.vagas && (
                <div className="caract-item">
                  <p className="caract-label">Vagas</p>
                  <p className="caract-valor">{imovel.vagas}</p>
                </div>
              )}
            </div>

            {/* Descrição */}
            {imovel.descricao && (
              <div>
                <h2 className="secao-titulo">Sobre este imóvel</h2>
                <p className="secao-texto">{imovel.descricao}</p>
              </div>
            )}

            {/* Características Customizadas */}
            {caracteristicasCustom.length > 0 && (
              <div>
                <h2 className="secao-titulo">Características do imóvel</h2>
                <div className="grid-caract">
                  {caracteristicasCustom.map((c, idx) => (
                    <div key={`${c.titulo || 'caract'}-${idx}`} className="card-caract">
                      <span className="card-caract-icone">{c.icone || '•'}</span>
                      <p className="card-caract-label">{c.titulo}</p>
                      <p className="card-caract-valor">{c.valor}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mapa de Localização */}
            <div style={{ marginTop: '3rem' }}>
              <h2 className="secao-titulo">Localização</h2>
              <div style={{
                borderRadius: '0px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0, 26, 51, 0.12)',
                height: '450px',
                marginBottom: '2rem'
              }}>
                <iframe
                  key={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  src={mapSrc}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '0px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <IoLocationOutline style={{ fontSize: '2rem', color: '#c41e3a', flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#001a33', fontSize: '1.1rem' }}>
                    {imovel.bairro}, {imovel.cidade}
                  </p>
                  <p style={{ margin: '0.5rem 0 0', color: '#7a7a7a', fontSize: '0.95rem' }}>
                    Localizado em uma região privilegiada
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Sticky */}
          <aside className="coluna-direita">
            {/* Preço */}
            <div className="preco-card">
              <p className="preco-label">Preço</p>
              <p className="preco-valor">R$ {imovel.preco?.toLocaleString('pt-BR')}</p>
            </div>

            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp"
            >
              <BsWhatsapp style={{ fontSize: '1.3rem' }} />
              WhatsApp
            </a>

            {/* Formulário */}
            <div className="formulario-card">
              <h3 className="form-titulo">Interesse neste imóvel?</h3>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0' }}>
                <input 
                  name="nome" 
                  placeholder="Seu nome" 
                  value={formContato.nome} 
                  onChange={handleChange} 
                  className="form-input" 
                  required 
                />
                <input 
                  name="email" 
                  type="email" 
                  placeholder="E-mail" 
                  value={formContato.email} 
                  onChange={handleChange} 
                  className="form-input" 
                  required 
                />
                <input 
                  name="telefone" 
                  placeholder="Telefone" 
                  value={formContato.telefone} 
                  onChange={handleChange} 
                  className="form-input" 
                  required 
                />
                <button type="submit" className="btn-enviar">
                  Enviar Interesse
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

export default Detalhes
