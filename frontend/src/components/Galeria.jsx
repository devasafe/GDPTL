import React, { useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Thumbs, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'
import './Galeria.css'

const PRIMARY_COLOR = '#001d44'
const SECONDARY_COLOR = '#c41e3a'
const ACCENT_COLOR = '#ffffff'

const Galeria = ({ midias = [], titulo = 'Imóvel' }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const mainSwiperRef = useRef(null)

  if (!Array.isArray(midias) || midias.length === 0) {
    return (
      <div style={{
        background: '#f0f0f0',
        borderRadius: '0',
        height: '500px',
        display: 'grid',
        placeItems: 'center',
        boxShadow: 'none',
      }}>
        <span style={{ color: '#999', fontSize: '1rem', fontWeight: 300 }}>
          Galeria de fotos
        </span>
      </div>
    )
  }

  return (
    <>
      <style>{`
        /* Estilo dos botões de navegação para SVG */
        .galeria-swiper .swiper-button-next svg,
        .galeria-swiper .swiper-button-prev svg {
          width: 24px;
          height: 24px;
          stroke: white;
          stroke-width: 2.5;
          fill: none;
          transition: all 0.3s ease;
        }

        .galeria-swiper .swiper-button-next:hover svg {
          transform: translateX(3px);
        }

        .galeria-swiper .swiper-button-prev:hover svg {
          transform: translateX(-3px);
        }
      `}</style>
      {/* GALERIA COM SWIPER */}
      <div style={{ marginBottom: '0' }}>
        {/* Swiper Principal com Zoom */}
        <div style={{
          position: 'relative',
          height: '650px',
          borderRadius: '0px',
          overflow: 'hidden',
          background: '#f0f0f0',
          marginBottom: '1.5rem',
        }}
        className="galeria-swiper">
          {/* Fundo Blur */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: midias.length > 0 ? `url(${midias[0]?.url})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(40px) brightness(0.7)',
            transform: 'scale(1.2)',
            zIndex: 1,
          }} />

          {/* Overlay Escuro */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 2,
          }} />

          {/* Swiper Principal */}
          <div style={{ height: '100%', zIndex: 3, position: 'relative' }}>
            <Swiper
              ref={mainSwiperRef}
              modules={[Navigation, Pagination, Thumbs, Autoplay]}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              autoplay={{ delay: 5000, disableOnInteraction: true }}
              pagination={{ clickable: true }}
              navigation={true}
              loop={true}
              style={{
                height: '100%',
                '--swiper-navigation-color': ACCENT_COLOR,
                '--swiper-pagination-color': SECONDARY_COLOR,
                '--swiper-pagination-bullet-inactive-color': 'rgba(255, 255, 255, 0.5)',
                '--swiper-pagination-bullet-inactive-opacity': '0.5',
              }}
            >
              {midias.map((midia, idx) => (
                <SwiperSlide key={idx}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F9FAFB',
                  }}>
                    <img
                      src={midia.url}
                      alt={`${titulo} - Imagem ${idx + 1}`}
                      style={{
                        maxWidth: '95%',
                        maxHeight: '95%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Counter de Fotos */}
          <div style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1.5rem',
            background: `${PRIMARY_COLOR}ee`,
            color: ACCENT_COLOR,
            padding: '0.75rem 1.25rem',
            borderRadius: '4px',
            fontSize: '0.9rem',
            fontWeight: 700,
            zIndex: 4,
          }}>
            {midias.length} fotos
          </div>
        </div>

        {/* Swiper de Thumbnails */}
        {midias.length > 1 && (
          <Swiper
            onSwiper={setThumbsSwiper}
            loop={true}
            spaceBetween={10}
            slidesPerView='auto'
            freeMode={true}
            watchSlidesProgress={true}
            modules={[Navigation, Thumbs]}
            style={{
              paddingBottom: '0',
            }}
          >
            {midias.map((midia, idx) => (
              <SwiperSlide key={idx} style={{ width: 'auto', maxWidth: '120px' }}>
                <div style={{
                  borderRadius: '6px',
                  height: '120px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: `2px solid #ddd`,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                }}>
                  <img
                    src={midia.url}
                    alt={`Thumbnail ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </>
  )
}

export default Galeria

