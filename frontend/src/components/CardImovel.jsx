import React from 'react';
import { Link } from 'react-router-dom';

// Cores sofisticadas - MESMAS DA HOME
const PRIMARY_COLOR = '#001a33';
const SECONDARY_COLOR = '#c41e3a';
const ACCENT_COLOR = '#ffffff';
const TEXT_DARK = '#0a0e27';
const TEXT_LIGHT = '#7a7a7a';

const CardImovel = ({ imovel, showSecondaryButton = true }) => {
  // Usar a primeira imagem de midias ou capa como fallback
  const imagemPrincipal = (Array.isArray(imovel.midias) && imovel.midias[0]?.url) || imovel.capa || ''

  return (
    <>
      <style>{`
        .card-imovel-button-primary:hover {
          background: #a01829 !important;
          box-shadow: 0 8px 24px rgba(196, 30, 58, 0.5) !important;
          transform: translateY(-2px) !important;
        }

        .card-imovel-button-secondary:hover {
          background: rgba(255, 255, 255, 0.25) !important;
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.1) !important;
        }
      `}</style>
      <Link to={`/imovel/${imovel.slug}`} style={cardStyle}>
      {/* Imagem inteira com degrade e detalhes sobrepostos */}
      <div 
        style={{
          ...cardImageContainer,
          backgroundImage: imagemPrincipal ? `url(${imagemPrincipal})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
        }}>
        
        {/* Degrade preto de baixo para cima */}
        <div style={gradientOverlay} />

        {/* Destaque Badge */}
        {imovel.destaque && (
          <div style={destaqueBadge}>
            DESTAQUE
          </div>
        )}

        {/* Label de Tipo */}
        <div style={tipoLabel}>{imovel.tipo}</div>

        {/* Conteúdo sobreposto na imagem */}
        <div style={overlayContentStyle}>
          <h3 style={cardTitleStyle}>{imovel.titulo}</h3>
          
          <div style={locationStyle}>
            <span style={{ fontSize: '0.9rem', color: '#fff' }}>📍 {imovel.bairro}, {imovel.cidade}</span>
          </div>

          {/* Preço e Botões */}
          <div style={footerOverlayStyle}>
            <div>
              <p style={priceStyle}>R$ {(imovel.preco || 0).toLocaleString('pt-BR')}</p>
              <div style={buttonsContainerStyle}>
                <button style={buttonPrimaryStyle} className="card-imovel-button-primary">
                  Ver Detalhes
                </button>
                {showSecondaryButton && (
                  <button style={buttonSecondaryStyle} className="card-imovel-button-secondary">
                    <span>💬</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
    </>
  )
}

const cardStyle = {
  background: ACCENT_COLOR,
  border: 'none',
  borderRadius: '0px',
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
}

const cardImageContainer = {
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #1a3a5c 100%)`,
  height: '350px',
  width: '100%',
}

const gradientOverlay = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '60%',
  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.8) 30%, transparent 100%)',
  zIndex: 5,
}

const destaqueBadge = {
  position: 'absolute',
  top: '1.5rem',
  right: '1.5rem',
  background: SECONDARY_COLOR,
  color: ACCENT_COLOR,
  padding: '0.5rem 1rem',
  fontSize: '0.75rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  zIndex: 15,
  display: 'inline-block',
  width: 'fit-content',
  boxShadow: '0 4px 12px rgba(196, 30, 58, 0.2)',
}

const tipoLabel = {
  position: 'absolute',
  top: '1.5rem',
  left: '1.5rem',
  background: 'rgba(0, 29, 68, 0.9)',
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

const cardTitleStyle = {
  margin: '0 0 0.8rem',
  fontSize: '1.4rem',
  fontWeight: 700,
  color: ACCENT_COLOR,
  lineHeight: 1.3,
  fontFamily: "'Playfair Display', serif",
}

const locationStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.3rem',
  marginBottom: '1rem',
}

const footerOverlayStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginTop: 'auto',
  width: '100%',
}

const priceStyle = {
  margin: '0.4rem 0 0',
  fontSize: '2rem',
  fontWeight: 700,
  color: SECONDARY_COLOR,
  fontFamily: "'Playfair Display', serif",
}

const buttonsContainerStyle = {
  display: 'flex',
  gap: '0.8rem',
  marginTop: '1.2rem',
  alignItems: 'center',
}

const buttonPrimaryStyle = {
  background: SECONDARY_COLOR,
  color: ACCENT_COLOR,
  border: 'none',
  padding: '0.75rem 1.8rem',
  fontSize: '0.9rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  boxShadow: '0 6px 16px rgba(196, 30, 58, 0.3)',
  borderRadius: '0px',
}

const buttonSecondaryStyle = {
  background: 'rgba(255, 255, 255, 0.15)',
  color: ACCENT_COLOR,
  border: `2px solid ${ACCENT_COLOR}`,
  padding: '0.7rem 1rem',
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  letterSpacing: '0.5px',
  borderRadius: '0px',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export default CardImovel;
