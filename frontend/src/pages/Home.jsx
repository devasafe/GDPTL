import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { listarImoveis } from '../services/imoveisService'
import { listarPostagens } from '../services/postagensService'
import { getRender } from '../services/sessoesService'

const Home = () => {
  const [imoveis, setImoveis] = useState([])
  const [postagens, setPostagens] = useState([])
  const [sessoes, setSessoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const buscar = async () => {
      try {
        const [imoveisData, postagensData, sessoesData] = await Promise.all([
          listarImoveis(),
          listarPostagens(),
          getRender(),
        ])
        setImoveis(imoveisData || [])
        setPostagens(postagensData || [])
        setSessoes(sessoesData || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    buscar()
  }, [])

  const novidades = imoveis.slice(0, 6)
  const casas = imoveis.filter((i) => i.tipo?.toLowerCase() === 'casa').slice(0, 6)
  const apartamentos = imoveis.filter((i) => i.tipo?.toLowerCase() === 'apartamento').slice(0, 6)

  if (loading) return <div style={loadingStyle}><p>Carregando imóveis e sessões...</p></div>

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Lora:wght@400;500;600&display=swap');
        
        * {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Lora', serif;
          padding-top: 0;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Playfair Display', serif;
        }
        a[href*="/imovel/"] {
          position: relative;
          display: block;
        }
        a[href*="/imovel/"]:hover {
          box-shadow: 0 40px 80px rgba(0, 29, 68, 0.25) !important;
          transform: translateY(-12px) !important;
        }
        a[href*="/imovel/"] div:first-child {
          position: relative;
          overflow: hidden;
        }
        a[href*="/imovel/"] div:first-child::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 29, 68, 0);
          transition: background 0.4s ease;
        }
        a[href*="/imovel/"]:hover div:first-child::after {
          background: rgba(0, 26, 51, 0.1);
        }
        a[href*="/imovel/"] img {
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        a[href*="/imovel/"]:hover img {
          transform: scale(1.1) !important;
        }
        a[href*="/postagem/"] {
          position: relative;
          display: block;
        }
        a[href*="/postagem/"]:hover {
          box-shadow: 0 40px 80px rgba(0, 29, 68, 0.25) !important;
          transform: translateY(-12px) !important;
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
          background: rgba(0, 29, 68, 0);
          transition: background 0.4s ease;
        }
        a[href*="/postagem/"]:hover div:first-child::after {
          background: rgba(0, 26, 51, 0.1);
        }
        a[href*="/postagem/"] img {
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        a[href*="/postagem/"]:hover img {
          transform: scale(1.1) !important;
        }
        .heroBg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, #001d44 0%, #0a2a5a 100%);
          z-index: -1;
        }
        .heroPattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(196, 30, 58, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(196, 30, 58, 0.05) 0%, transparent 50%);
          pointer-events: none;
        }
        .fadeIn {
          animation: fadeInUp 0.8s ease-out forwards;
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
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(196, 30, 58, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(196, 30, 58, 0.8), 0 0 30px rgba(196, 30, 58, 0.4);
          }
        }
        /* Swiper Styles */
        .swiper {
          width: 100%;
          padding-top: 0;
          padding-left: 80px;
          padding-right: 80px;
          height: auto;
          margin-right: 0px;
        }
        .swiper-wrapper {
          align-items: stretch;
        }
        .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: stretch;
          height: auto;
          align-self: stretch;
        }
        @media (max-width: 768px) {
          .swiper {
            padding-left: 40px;
            padding-right: 40px;
            margin-right: 300px;
          }
        }
        .swiper-button-next,
        .swiper-button-prev {
          width: 56px;
          height: 56px;
          border: none;
          border-radius: 0px;
          background: linear-gradient(135deg, #001a33 0%, #0f2946 100%);
          position: absolute;
          top: 50%;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-shadow: 0 8px 24px rgba(0, 26, 51, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
        }
        .swiper-button-prev {
          left: -85px;
        }
        .swiper-button-next {
          right: -85px;
        }
        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 0;
          content: '';
        }
        .swiper-button-next svg,
        .swiper-button-prev svg {
          width: 20px;
          height: 20px;
          stroke: white;
          stroke-width: 2.5;
          fill: none;
          transition: all 0.3s ease;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: linear-gradient(135deg, #c41e3a 0%, #8b1528 100%);
          box-shadow: 0 12px 32px rgba(0, 26, 51, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transform: translateY(-50%) scale(1.15) !important;
        }
        .swiper-button-prev:hover svg {
          transform: translateX(-3px);
        }
        .swiper-button-next:hover svg {
          transform: translateX(3px);
        }
        .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed !important;
        }
        .swiper-button-disabled:hover {
          background: linear-gradient(135deg, #c41e3a 0%, #8b1528 100%);
          box-shadow: 0 8px 24px rgba(30, 47, 196, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transform: translateY(-50%) !important;
        }
        .swiper-pagination {
          bottom: 0 !important;
          margin-top: 2rem;
        }
        .swiper-pagination-bullet {
          background: #c41e3a;
          opacity: 0.7;
        }
        .swiper-pagination-bullet-active {
          background: #001a33;
          opacity: 1;
        }

        /* Efeito diagonal no botão primary */
        a[href="/imoveis"][style*="display: inline-block"] {
          position: relative;
          overflow: hidden;
        }

        .hero-btn-primary {
          position: relative;
          overflow: hidden;
        }

        .hero-btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 150%;
          height: 100%;
          background: #ffffff;
          transform: skewX(-20deg);
          transition: left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 0;
        }

        .hero-btn-primary:hover::before {
          left: 100%;
        }

        .hero-btn-primary:hover {
          color: #001a33 !important;
          border-color: #ffffff !important;
          background: #ffffff !important;
        }

        .hero-btn-secondary {
          position: relative;
          overflow: hidden;
        }

        .hero-btn-secondary::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -150%;
          width: 150%;
          height: calc(100% + 4px);
          background: linear-gradient(90deg, transparent 0%, #ffffff 50%, transparent 100%);
          transform: skewX(-20deg);
          transition: left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          z-index: 0;
          pointer-events: none;
        }

        .hero-btn-secondary:hover::before {
          left: 100%;
        }

        .hero-btn-secondary span {
          position: relative;
          z-index: 1;
        }
        
        .section-title-accent {
          position: relative;
          display: inline-block;
        }
        .section-title-accent::before {
          content: '';
          position: absolute;
          left: -30px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 30px;
          background: linear-gradient(180deg, transparent 0%, #c41e3a 50%, transparent 100%);
          border-radius: 3px;
          box-shadow: 0 0 15px rgba(196, 30, 58, 0.6);
        }
        .premium-highlight {
          position: relative;
          background: linear-gradient(90deg, transparent 0%, rgba(196, 30, 58, 0.1) 50%, transparent 100%);
          padding: 0.2rem 0.8rem;
          border-left: 3px solid #c41e3a;
          border-right: 3px solid #c41e3a;
          transition: all 0.4s ease;
        }
        .premium-highlight:hover {
          background: linear-gradient(90deg, transparent 0%, rgba(196, 30, 58, 0.2) 50%, transparent 100%);
          box-shadow: 0 0 20px rgba(196, 30, 58, 0.3);
        }
        section {
          position: relative;
        }
        .section-title-box {
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .section-title-box:hover {
          background: linear-gradient(135deg, rgba(0, 26, 51, 0.12) 0%, rgba(0, 26, 51, 0.08) 100%) !important;
          box-shadow: 0 12px 40px rgba(196, 30, 58, 0.2), inset 0 0 30px rgba(196, 30, 58, 0.08) !important;
          transform: translateX(4px);
        }
        section {
          position: relative;
          overflow: visible;
        }
        section::after {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 2px;
          background: linear-gradient(180deg, #c41e3a 0%, #c41e3a 50%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          animation: slideInLeft 0.6s ease-out forwards;
        }
      `}</style>

      {/* Hero - Premium Full Screen */}
      <section style={heroStyle}>
        <div style={heroBgOverlay}>
          <div style={heroPatternDiv} />
        </div>
        <div style={heroContentWrapper}>
          <div style={{ textAlign: 'center', zIndex: 2, position: 'relative' }} className="fadeIn">
            <p style={heroSupStyle}>Luxo & Exclusividade</p>
            <h1 style={heroTitleStyle}>Guedes Capital</h1>
            <h2 style={heroSubtitleBigStyle}>Imobiliária</h2>
            <p style={heroDescStyle}>Descubra propriedades exclusivas e oportunidades de investimento de alto padrão</p>
            <div style={heroBtnsWrapper}>
              <Link to="/imoveis" style={heroBtnPrimary} className="hero-btn-primary">
                Explorar Portfólio
              </Link>
              <Link to="/imoveis" style={heroBtnSecondary} className="hero-btn-secondary">
                <span>Fale Conosco</span>
              </Link>
            </div>
          </div>
        </div>
        <div style={heroScrollIndicator}>
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M15 5V25M10 20L15 25L20 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      {/* Stats Section - Mais Compacta */}
      <section style={statsSection}>
        <div style={containerStyle}>
          <div style={statsGrid}>
            <div style={statCard}>
              <h3 style={statNumber}>5000+</h3>
              <p style={statLabel}>Propriedades Transacionadas</p>
            </div>
            <div style={statCard}>
              <h3 style={statNumber}>15+</h3>
              <p style={statLabel}>Anos de Experiência</p>
            </div>
            <div style={statCard}>
              <h3 style={statNumber}>98%</h3>
              <p style={statLabel}>Clientes Satisfeitos</p>
            </div>
            <div style={statCard}>
              <h3 style={statNumber}>R$ 1B+</h3>
              <p style={statLabel}>Volume Transacionado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resto do conteúdo com container */}
      <div style={containerStyle}>
        {/* Debug: Mostrar quantas sessões tem */}
        {sessoes.length === 0 && (
          <div style={emptyStateStyle}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
            </svg>
            <h3 style={{ color: PRIMARY_COLOR, fontSize: '1.3rem', fontWeight: 600, margin: '1rem 0 0.5rem' }}>Nenhuma coleção criada</h3>
            <p style={{ color: TEXT_LIGHT, fontSize: '0.95rem', margin: 0 }}>Acesse o painel administrativo para criar suas coleções de imóveis</p>
          </div>
        )}

        {/* Sessões dinâmicas (definidas no painel) */}
        {sessoes.length > 0 && sessoes.map((sess, idx) => (
          <section key={sess._id} style={{ ...sectionStyle, animationDelay: `${idx * 0.1}s` }} className="fadeIn">
            {/* Header da Seção - Layout Melhorado */}
            <div style={sectionHeaderStyle}>
              <div style={{ flex: 1 }}>
                <h2 style={sectionTitleStyle}>{sess.titulo}</h2>
                {sess.descricao && <p style={sectionDescStyle}>{sess.descricao}</p>}
              </div>
              <Link to={`/imoveis?section=${sess.slug}`} style={sectionLinkStyle}>
                <span>Ver Coleção</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            {/* Carrossel de Imóveis com Swiper */}
            {Array.isArray(sess.items) && sess.items.length > 0 ? (
              <div style={{ position: 'relative', marginTop: '2rem', overflow: 'visible', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                {/* Botão Prev - Esquerda */}
                <div className={`swiper-button-prev swiper-button-prev-${sess._id.replace(/[^a-zA-Z0-9]/g, '')}`}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                </div>

                {/* Carrossel */}
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={{
                    nextEl: `.swiper-button-next-${sess._id.replace(/[^a-zA-Z0-9]/g, '')}`,
                    prevEl: `.swiper-button-prev-${sess._id.replace(/[^a-zA-Z0-9]/g, '')}`,
                  }}
                  pagination={{ 
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  spaceBetween={40}
                  slidesPerView={2}
                  style={{ paddingBottom: '4rem', flex: 1 }}
                  breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 20 },
                    640: { slidesPerView: 1.5, spaceBetween: 30 },
                    1024: { slidesPerView: 2, spaceBetween: 40 },
                  }}
                  className={`swiper-container-${sess._id.replace(/[^a-zA-Z0-9]/g, '')}`}
                >
                  {sess.items.map((i, itemIdx) => (
                    <SwiperSlide key={i._id || i.slug} style={{ animation: `fadeInUp 0.6s ease-out ${0.1 + itemIdx * 0.05}s forwards` }}>
                      <CardImovel imovel={i} />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Botão Next - Direita */}
                <div className={`swiper-button-next swiper-button-next-${sess._id.replace(/[^a-zA-Z0-9]/g, '')}`}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 19l7-7-7-7" />
                  </svg>
                </div>

                {/* CSS customizado para o carrossel */}
                <style>{`
                  .swiper-button-prev-${sess._id.replace(/[^a-zA-Z0-9]/g, '')},
                  .swiper-button-next-${sess._id.replace(/[^a-zA-Z0-9]/g, '')} {
                    width: 56px !important;
                    height: 56px !important;
                    background: linear-gradient(135deg, #001a33 0%, #0f2946 100%) !important;
                    border: none !important;
                    border-radius: 0px !important;
                    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                    box-shadow: 0 8px 24px rgba(0, 26, 51, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    position: relative !important;
                    top: auto !important;
                    left: auto !important;
                    right: auto !important;
                    flex-shrink: 0 !important;
                  }

                  .swiper-button-prev-${sess._id.replace(/[^a-zA-Z0-9]/g, '')}::after,
                  .swiper-button-next-${sess._id.replace(/[^a-zA-Z0-9]/g, '')}::after {
                    display: none !important;
                  }

                  .swiper-button-prev-${sess._id.replace(/[^a-zA-Z0-9]/g, '')} svg,
                  .swiper-button-next-${sess._id.replace(/[^a-zA-Z0-9]/g, '')} svg {
                    width: 20px !important;
                    height: 20px !important;
                    stroke: white !important;
                    stroke-width: 2.5 !important;
                    fill: none !important;
                    transition: all 0.3s ease !important;
                  }

                  .swiper-button-prev-${sess._id.replace(/[^a-zA-Z0-9]/g, '')}:hover,
                  .swiper-button-next-${sess._id.replace(/[^a-zA-Z0-9]/g, '')}:hover {
                    background: linear-gradient(135deg, #c41e3a 0%, #8b1528 100%) !important;
                    box-shadow: 0 12px 32px rgba(0, 26, 51, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
                    transform: scale(1.15) !important;
                  }

                  .swiper-button-prev-${sess._id.replace(/[^a-zA-Z0-9]/g, '')}:hover svg {
                    transform: translateX(-3px) !important;
                  }

                  .swiper-button-next-${sess._id.replace(/[^a-zA-Z0-9]/g, '')}:hover svg {
                    transform: translateX(3px) !important;
                  }

                  .swiper-button-prev-${sess._id.replace(/[^a-zA-Z0-9]/g, '')}.swiper-button-disabled,
                  .swiper-button-next-${sess._id.replace(/[^a-zA-Z0-9]/g, '')}.swiper-button-disabled {
                    opacity: 0.3 !important;
                    cursor: not-allowed !important;
                  }
                `}</style>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#999' }}>
                <p>Nenhum imóvel nesta coleção</p>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Seção Notícias e Eventos */}
      {postagens.length > 0 && (
        <section style={{
          padding: '4rem 1rem',
          background: BG_LIGHT,
          borderTop: `2px solid ${SECONDARY_COLOR}`
        }}>
          <div style={{ maxWidth: '1900px', margin: '0 auto' }}>
            {/* Título da Seção - Simplificado */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: 800,
                margin: '0 0 0.8rem',
                letterSpacing: '-1px',
                fontFamily: "'Playfair Display', serif",
                color: PRIMARY_COLOR,
                lineHeight: 1.2
              }}>
                Notícias & Eventos
              </h2>
              <p style={{
                fontSize: '0.95rem',
                lineHeight: 1.6,
                color: TEXT_LIGHT,
                margin: 0,
                maxWidth: '500px'
              }}>
                Acompanhe as novidades e eventos do nosso mercado imobiliário
              </p>
            </div>

            {/* Carrossel de Notícias */}
            <div style={{ position: 'relative', marginTop: '2rem', overflow: 'visible', display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {/* Botão Prev - Esquerda */}
              <div className="swiper-button-prev swiper-button-prev-postagens">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </div>

              {/* Carrossel */}
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={40}
                slidesPerView={1}
                navigation={{
                  prevEl: '.swiper-button-prev-postagens',
                  nextEl: '.swiper-button-next-postagens',
                }}
                pagination={{
                  el: '.swiper-pagination-postagens',
                  clickable: true,
                  dynamicBullets: true,
                }}
                breakpoints={{
                  640: { slidesPerView: 1.5, spaceBetween: 30 },
                  1024: { slidesPerView: 2, spaceBetween: 40 },
                }}
                style={{ width: '100%', paddingBottom: '4rem', flex: 1 }}
                className="swiper-container-postagens"
              >
                {postagens.map((postagem, itemIdx) => (
                  <SwiperSlide key={postagem._id || postagem.slug} style={{ animation: `fadeInUp 0.6s ease-out ${0.1 + itemIdx * 0.05}s forwards` }}>
                    <CardPostagem postagem={postagem} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Botão Next - Direita */}
              <div className="swiper-button-next swiper-button-next-postagens">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 19l7-7-7-7" />
                </svg>
              </div>

              {/* CSS customizado para o carrossel */}
              <style>{`
                .swiper-button-prev-postagens,
                .swiper-button-next-postagens {
                  width: 56px !important;
                  height: 56px !important;
                  background: linear-gradient(135deg, #001a33 0%, #0f2946 100%) !important;
                  border: none !important;
                  border-radius: 0px !important;
                  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                  box-shadow: 0 8px 24px rgba(0, 26, 51, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
                  display: flex !important;
                  align-items: center !important;
                  justify-content: center !important;
                  position: relative !important;
                  top: auto !important;
                  left: auto !important;
                  right: auto !important;
                  flex-shrink: 0 !important;
                }

                .swiper-button-prev-postagens::after,
                .swiper-button-next-postagens::after {
                  display: none !important;
                }

                .swiper-button-prev-postagens svg,
                .swiper-button-next-postagens svg {
                  width: 20px !important;
                  height: 20px !important;
                  stroke: white !important;
                  stroke-width: 2.5 !important;
                  fill: none !important;
                  transition: all 0.3s ease !important;
                }

                .swiper-button-prev-postagens:hover,
                .swiper-button-next-postagens:hover {
                  background: linear-gradient(135deg, #c41e3a 0%, #8b1528 100%) !important;
                  box-shadow: 0 12px 32px rgba(0, 26, 51, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
                  transform: scale(1.15) !important;
                }

                .swiper-button-prev-postagens:hover svg {
                  transform: translateX(-3px) !important;
                }

                .swiper-button-next-postagens:hover svg {
                  transform: translateX(3px) !important;
                }

                .swiper-button-prev-postagens.swiper-button-disabled,
                .swiper-button-next-postagens.swiper-button-disabled {
                  opacity: 0.3 !important;
                  cursor: not-allowed !important;
                }

                .swiper-pagination-postagens {
                  bottom: -60px !important;
                }

                .swiper-pagination-postagens .swiper-pagination-bullet {
                  background: ${SECONDARY_COLOR} !important;
                }

                .swiper-pagination-postagens .swiper-pagination-bullet-active {
                  background: ${PRIMARY_COLOR} !important;
                }
              `}</style>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

const CardImovel = ({ imovel }) => {
  const caracteristicas = []
  if (imovel.quartos) caracteristicas.push(`${imovel.quartos} Qtos`)
  if (imovel.vagas) caracteristicas.push(`${imovel.vagas} Vagas`)
  if (imovel.area) caracteristicas.push(`${imovel.area} m²`)

  const customCaract = Array.isArray(imovel.caracteristicas)
    ? imovel.caracteristicas.filter((c) => c && c.valor).map((c) => `${c.icone || ''} ${c.valor}`.trim())
    : []

  const todasCaract = [...caracteristicas, ...customCaract].filter(Boolean)

  // Usar a primeira imagem de midias ou capa como fallback
  const imagemPrincipal = (Array.isArray(imovel.midias) && imovel.midias[0]?.url) || imovel.capa || ''

  return (
    <Link to={`/imovel/${imovel.slug}`} style={cardStyle}>
      {/* Imagem com overlay */}
      <div style={cardImageContainer}>
        <div 
          style={{
            ...cardImageStyle, 
            backgroundImage: imagemPrincipal ? `url(${imagemPrincipal})` : 'none'
          }}>
          {!imagemPrincipal && <span style={{ color: '#94a3b8' }}>Sem imagem</span>}
        </div>

        {/* Gradient Overlay */}
        <div style={gradientOverlay} />

        {/* Badge de Destaque */}
        {imovel.destaque && (
          <div style={destaqueBadge}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            DESTAQUE
          </div>
        )}

        {/* Label de Tipo */}
        <div style={tipoLabel}>{imovel.tipo}</div>

        {/* Conteúdo Sobreposto */}
        <div style={overlayContentStyle}>
          <h3 style={cardTitleStyle}>{imovel.titulo}</h3>
          
          <div style={locationStyle}>
            <span>📍 {imovel.bairro}</span>
            <span>{imovel.cidade}</span>
          </div>

          {/* Características */}
          {todasCaract.length > 0 && (
            <div style={caractsStyle}>
              {todasCaract.slice(0, 3).map((c, idx) => (
                <span key={idx} style={caracStyle}>{c}</span>
              ))}
            </div>
          )}

          {/* Preço */}
          <div style={footerStyle}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>Valor</span>
              <p style={priceStyle}>R$ {imovel.preco?.toLocaleString('pt-BR')}</p>
            </div>
            <span style={ctaStyle}>Ver mais →</span>
          </div>
        </div>
      </div>

      {/* Body escondido */}
      <div style={cardBodyStyle}></div>
    </Link>
  )
}

const CardPostagem = ({ postagem }) => {
  return (
    <Link to={`/postagem/${postagem.slug}`} style={postagemCardStyle}>
      {/* Imagem com overlay */}
      <div style={postagemImageContainer}>
        <div 
          style={{ 
            ...postagemImageStyle, 
            backgroundImage: postagem.imagem ? `url(${postagem.imagem})` : 'none' 
          }}>
          {!postagem.imagem && <span style={{ color: '#94a3b8' }}>Sem imagem</span>}
        </div>

        {/* Gradient Overlay */}
        <div style={postagemGradientOverlay} />

        {/* Conteúdo Sobreposto */}
        <div style={postagemOverlayContent}>
          <span style={postagemCategoriaStyle}>{postagem.categoria || 'Notícia'}</span>
          <h3 style={postagemTitleStyle}>{postagem.titulo}</h3>
          <p style={postagemExcerptStyle}>{postagem.conteudo?.substring(0, 120)}...</p>
          <span style={postagemDataStyle}>
            {postagem.dataEvento && postagem.categoria === 'evento' 
              ? `Evento em ${new Date(postagem.dataEvento).toLocaleDateString('pt-BR')}`
              : `Postado em ${new Date(postagem.dataPublicacao).toLocaleDateString('pt-BR')}`
            }
          </span>
        </div>
      </div>

      {/* Body escondido */}
      <div style={postagemBodyStyle}></div>
    </Link>
  )
}

// Estilos - Design Premium Completo
const PRIMARY_COLOR = '#001a33'      // Azul escuro profundo - COR PRINCIPAL
const SECONDARY_COLOR = '#c41e3a'    // Vermelho sofisticado - COR SECUNDÁRIA
const ACCENT_GOLD = '#d4af37'        // Dourado - detalhes premium
const ACCENT_COLOR = '#ffffff'       // Branco - backgrounds
const TEXT_DARK = '#0a0e27'          // Preto profundo - textos
const TEXT_LIGHT = '#7a7a7a'         // Cinza médio - textos secundários
const BG_LIGHT = '#f5f3f0'           // Branco quente - backgrounds

// Hero
const heroStyle = {
  height: '99vh',
  background: `linear-gradient(135deg, rgba(0, 26, 51, 0.8) 0%, rgba(15, 35, 70, 0.8) 100%), url('/hero-banner.png') center/cover`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: '0',
  marginTop: 0,
}

const heroBgOverlay = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.3)',
  zIndex: 1,
}

const heroPatternDiv = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `
    radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(196, 30, 58, 0.08) 0%, transparent 50%)
  `,
  pointerEvents: 'none',
  zIndex: 1,
}

const heroContentWrapper = {
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  maxWidth: '900px',
  padding: '2rem',
}

const heroSupStyle = {
  fontSize: '0.95rem',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: SECONDARY_COLOR,
  fontWeight: 600,
  margin: '0 0 1rem',
  opacity: 0.95,
}

const heroTitleStyle = {
  fontSize: '4.5rem',
  fontWeight: 800,
  color: ACCENT_COLOR,
  margin: '0 0 0.5rem',
  letterSpacing: '-1px',
  lineHeight: 1.1,
  fontFamily: "'Playfair Display', serif",
}

const heroSubtitleBigStyle = {
  fontSize: '2rem',
  fontWeight: 600,
  color: ACCENT_COLOR,
  margin: '0 0 1.5rem',
  opacity: 0.9,
  fontFamily: "'Playfair Display', serif",
  fontStyle: 'italic',
}

const heroDescStyle = {
  fontSize: '1.1rem',
  color: ACCENT_COLOR,
  margin: '0 0 3rem',
  opacity: 0.85,
  lineHeight: 1.6,
  maxWidth: '600px',
  margin: '0 auto 3rem',
}

const heroBtnsWrapper = {
  display: 'flex',
  gap: '1.5rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
}

const heroBtnPrimary = {
  display: 'inline-block',
  background: PRIMARY_COLOR,
  color: SECONDARY_COLOR,
  padding: '1.4rem 3.5rem',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  borderRadius: '0',
  border: `2px solid ${SECONDARY_COLOR}`,
  cursor: 'pointer',
  transition: 'all 0.4s ease',
  boxShadow: '0 20px 50px rgba(0, 26, 51, 0.4)',
  letterSpacing: '0.5px',
}

const heroBtnSecondary = {
  display: 'inline-block',
  background: 'transparent',
  color: SECONDARY_COLOR,
  padding: '1.4rem 3.5rem',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '1rem',
  borderRadius: '0',
  border: `2px solid ${SECONDARY_COLOR}`,
  cursor: 'pointer',
  transition: 'all 0.4s ease',
  letterSpacing: '0.5px',
}

const heroScrollIndicator = {
  position: 'absolute',
  bottom: '2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 2,
  animation: 'bounce 2s infinite',
  opacity: 0.7,
}

// Stats Section
const statsSection = {
  background: BG_LIGHT,
  padding: '3rem 1rem',
  borderTop: `1px solid #e5e7eb`,
}

const statsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '2rem',
  maxWidth: '1400px',
  margin: '0 auto',
}

const statCard = {
  textAlign: 'center',
  padding: '0',
}

const statNumber = {
  fontSize: '2.8rem',
  fontWeight: 700,
  color: SECONDARY_COLOR,
  margin: '0 0 0.5rem',
  fontFamily: "'Playfair Display', serif",
}

const statLabel = {
  fontSize: '0.95rem',
  color: TEXT_LIGHT,
  margin: 0,
  fontWeight: 500,
  letterSpacing: '0.3px',
}

// Container
const containerStyle = {
  maxWidth: '1900px',
  margin: '0 auto',
  padding: '3.5rem 1rem',
}

const loadingStyle = {
  textAlign: 'center',
  padding: '4rem 0',
  color: TEXT_LIGHT,
}

// Section
const sectionStyle = {
  marginBottom: '3.5rem',
  paddingBottom: '0',
}

const sectionBadgeStyle = {
  display: 'inline-block',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '1.5px',
  color: SECONDARY_COLOR,
  textTransform: 'uppercase',
  margin: '0 0 0.4rem',
}

const sectionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  paddingBottom: '1.5rem',
  borderBottom: `1px solid ${PRIMARY_COLOR}20`,
  gap: '2rem',
}

const sectionTitleStyle = {
  fontSize: '2.2rem',
  fontWeight: 800,
  color: PRIMARY_COLOR,
  margin: 0,
  letterSpacing: '-1px',
  lineHeight: 1.2,
  fontFamily: "'Playfair Display', serif",
}

const sectionDescStyle = {
  fontSize: '0.95rem',
  color: TEXT_LIGHT,
  margin: '0.8rem 0 0',
  lineHeight: 1.6,
}

const sectionLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.8rem',
  color: ACCENT_COLOR,
  background: SECONDARY_COLOR,
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  padding: '0.8rem 1.6rem',
  borderRadius: '2px',
  whiteSpace: 'nowrap',
  boxShadow: '0 4px 12px rgba(196, 30, 58, 0.2)',
}

// Grid
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
  gap: '3.5rem',
}

// Card Imovel
const cardImageContainer = {
  height: '450px',
  position: 'relative',
  overflow: 'hidden',
}

const cardImageStyle = {
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'grid',
  placeItems: 'center',
  position: 'relative',
}

const gradientOverlay = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '60%',
  background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.95))',
  zIndex: 5,
}

const destaqueBadge = {
  position: 'absolute',
  top: '1.5rem',
  right: '1.5rem',
  background: SECONDARY_COLOR,
  color: ACCENT_COLOR,
  padding: '0.7rem 1.3rem',
  fontSize: '0.7rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  zIndex: 15,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  boxShadow: '0 8px 20px rgba(196, 30, 58, 0.3)',
}

const tipoLabel = {
  position: 'absolute',
  top: '1.5rem',
  left: '1.5rem',
  background: 'rgba(196, 30, 58, 0.95)',
  color: ACCENT_COLOR,
  padding: '0.6rem 1.2rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  zIndex: 15,
  backdropFilter: 'blur(10px)',
}

const overlayContentStyle = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '2rem 1.8rem',
  zIndex: 10,
  color: ACCENT_COLOR,
}

const cardStyle = {
  border: 'none',
  borderRadius: '2px',
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  display: 'flex',
  flexDirection: 'column',
  height: '420px',
  width: '100%',
  boxShadow: '0 8px 24px rgba(0, 29, 68, 0.12)',
  cursor: 'pointer',
  position: 'relative',
}

const cardBodyStyle = {
  display: 'none',
}

const cardTitleStyle = {
  margin: '0 0 0.8rem',
  fontSize: '1.5rem',
  fontWeight: 600,
  color: ACCENT_COLOR,
  lineHeight: 1.3,
  fontFamily: "'Playfair Display', serif",
}

const locationStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
  marginBottom: '1.2rem',
  fontSize: '0.9rem',
  color: ACCENT_COLOR,
}

const caractsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.8rem',
  marginBottom: '1.2rem',
}

const caracStyle = {
  fontSize: '0.85rem',
  color: ACCENT_COLOR,
  fontWeight: 500,
  padding: '0.4rem 0.8rem',
  background: 'rgba(196, 30, 58, 0.4)',
  borderRadius: '0',
}

const footerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginTop: 'auto',
}

const priceStyle = {
  margin: '0.4rem 0 0',
  fontSize: '2rem',
  fontWeight: 700,
  color: SECONDARY_COLOR,
  fontFamily: "'Playfair Display', serif",
}

const ctaStyle = {
  fontSize: '0.95rem',
  color: SECONDARY_COLOR,
  fontWeight: 600,
  transition: 'all 0.3s',
  whiteSpace: 'nowrap',
}

// Empty State
const emptyStateStyle = {
  textAlign: 'center',
  padding: '4rem 2rem',
  background: '#f8f9fa',
  borderRadius: '0',
  border: '1px solid #e5e7eb',
  display: 'grid',
  placeItems: 'center',
  gap: '1rem',
  marginBottom: '3rem',
  color: TEXT_LIGHT,
}

// Section Header Improvements
const sectionBadgeWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1rem',
}

const badgeDotStyle = {
  width: '12px',
  height: '12px',
  background: SECONDARY_COLOR,
  borderRadius: '50%',
  animation: 'pulse 2s infinite',
}

// Section CTA
const sectionCTAStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: '3.5rem',
  paddingTop: '2.5rem',
  borderTop: '1px solid #e5e7eb',
}

const sectionViewMoreStyle = {
  padding: '1.1rem 2.8rem',
  background: PRIMARY_COLOR,
  color: ACCENT_COLOR,
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  borderRadius: '2px',
  transition: 'all 0.4s ease',
  border: `2px solid ${PRIMARY_COLOR}`,
  cursor: 'pointer',
  letterSpacing: '0.5px',
  boxShadow: '0 6px 16px rgba(0, 26, 51, 0.2)',
}

// Card Postagem
const postagemCardStyle = {
  border: 'none',
  borderRadius: '2px',
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  display: 'flex',
  flexDirection: 'column',
  height: '380px',
  width: '100%',
  boxShadow: '0 8px 24px rgba(0, 29, 68, 0.12)',
  cursor: 'pointer',
  position: 'relative',
}

const postagemImageContainer = {
  height: '380px',
  position: 'relative',
  overflow: 'hidden',
}

const postagemImageStyle = {
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'grid',
  placeItems: 'center',
  position: 'relative',
}

const postagemGradientOverlay = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '60%',
  background: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.95))',
  zIndex: 5,
}

const postagemOverlayContent = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '2.5rem 2rem',
  zIndex: 10,
  color: ACCENT_COLOR,
}

const postagemBodyStyle = {
  display: 'none',
}

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
  zIndex: 15,
  position: 'relative',
}

const postagemTitleStyle = {
  margin: '0 0 1rem',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: ACCENT_COLOR,
  lineHeight: 1.3,
  fontFamily: "'Playfair Display', serif",
  flex: 1,
}

const postagemExcerptStyle = {
  margin: '0 0 1.5rem',
  fontSize: '0.95rem',
  color: ACCENT_COLOR,
  lineHeight: 1.6,
  flex: 1,
}

const postagemDataStyle = {
  fontSize: '0.85rem',
  color: 'rgba(255, 255, 255, 0.8)',
  fontWeight: 500,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  marginTop: 'auto',
  paddingTop: '1rem',
  borderTop: 'none',
}

export default Home

