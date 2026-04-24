import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CardImovel from '../components/CardImovel';
import useImoveis from '../hooks/useImoveis';
import { listarImoveisPorSessao } from '../services/imoveisService';

// Cores sofisticadas
const PRIMARY_COLOR = '#001a33';
const SECONDARY_COLOR = '#c41e3a';
const ACCENT_COLOR = '#ffffff';
const TEXT_DARK = '#0a0e27';
const TEXT_LIGHT = '#7a7a7a';
const BG_LIGHT = '#f5f3f0';

const initialFilters = {
  cidade: '',
  bairro: '',
  tipo: '',
  precoMin: '',
  precoMax: '',
  quartos: '',
  vagas: '',
  ordenar: 'destaque',
};

const Catalogo = () => {
  const { imoveis, loading, error } = useImoveis();
  const [searchParams] = useSearchParams();
  const sessionFilter = searchParams.get('section');
  const [filters, setFilters] = useState(initialFilters);
  const [imoveisSessionao, setImoveisSessionao] = useState([]);
  const [loadingSessionao, setLoadingSessionao] = useState(false);

  // Carregar imoveis da sessão quando a URL tiver section
  useEffect(() => {
    if (sessionFilter) {
      setLoadingSessionao(true);
      listarImoveisPorSessao(sessionFilter)
        .then((data) => {
          setImoveisSessionao(data || []);
        })
        .catch((err) => {
          console.error('Erro ao buscar imoveis da sessão:', err);
          setImoveisSessionao([]);
        })
        .finally(() => setLoadingSessionao(false));
    } else {
      setImoveisSessionao([]);
    }
  }, [sessionFilter]);

  const filtrados = useMemo(() => {
    // Se há filtro de sessão, usar imoveis da sessão
    const baseList = imoveisSessionao.length > 0 ? imoveisSessionao : imoveis;
    
    const list = baseList.filter((item) => {
      const matchCidade = filters.cidade ? item.cidade?.toLowerCase().includes(filters.cidade.toLowerCase()) : true;
      const matchBairro = filters.bairro ? item.bairro?.toLowerCase().includes(filters.bairro.toLowerCase()) : true;
      const matchTipo = filters.tipo ? item.tipo?.toLowerCase() === filters.tipo.toLowerCase() : true;
      const matchQuartos = filters.quartos ? Number(item.quartos) >= Number(filters.quartos) : true;
      const matchVagas = filters.vagas ? Number(item.vagas) >= Number(filters.vagas) : true;
      const matchPrecoMin = filters.precoMin ? Number(item.preco) >= Number(filters.precoMin) : true;
      const matchPrecoMax = filters.precoMax ? Number(item.preco) <= Number(filters.precoMax) : true;
      return matchCidade && matchBairro && matchTipo && matchQuartos && matchVagas && matchPrecoMin && matchPrecoMax;
    });

    if (filters.ordenar === 'preco') return [...list].sort((a, b) => a.preco - b.preco);
    if (filters.ordenar === '-preco') return [...list].sort((a, b) => b.preco - a.preco);
    if (filters.ordenar === 'data') return [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return [...list].sort((a, b) => Number(b.destaque) - Number(a.destaque));
  }, [filters, imoveis, imoveisSessionao]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

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

        .fadeIn {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .catalog-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 3rem;
        }

        input:focus,
        select:focus {
          border-color: ${SECONDARY_COLOR} !important;
          box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.1);
        }
      `}</style>

      {/* Hero Section - Mais Compacta */}
      <section style={{
        background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #0f2946 100%)`,
        color: ACCENT_COLOR,
        padding: '6rem 2rem 4rem',
        textAlign: 'center',
        marginBottom: '0',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '6rem'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(196, 30, 58, 0.08) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            margin: '0 0 1rem',
            letterSpacing: '-1px',
            fontFamily: "'Playfair Display', serif",
            lineHeight: 1.2
          }}>
            Catálogo de Imóveis
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            lineHeight: 1.6,
            opacity: 0.9,
            margin: 0,
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Explore nossa seleção exclusiva de propriedades premium
          </p>
        </div>
      </section>

      {/* Filters Section - Mais Compacta */}
      <section style={{
        padding: '3rem 1rem',
        background: BG_LIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '1300px',
          background: 'white',
          border: `1px solid rgba(0, 26, 51, 0.08)`,
          borderRadius: '0',
          padding: '3rem',
          boxShadow: '0 8px 32px rgba(0, 26, 51, 0.08)',
        }}>
          {/* Primeira linha - Localização e Tipo */}
          <div style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(3, 1fr)',
            marginBottom: '2rem'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: TEXT_DARK, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cidade</label>
              <input name="cidade" placeholder="Digite a cidade" value={filters.cidade} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: TEXT_DARK, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Bairro</label>
              <input name="bairro" placeholder="Digite o bairro" value={filters.bairro} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: TEXT_DARK, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tipo</label>
              <input name="tipo" placeholder="Casa, apto..." value={filters.tipo} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* Segunda linha - Preço */}
          <div style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(3, 1fr)',
            marginBottom: '2rem'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: TEXT_DARK, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preço Mín</label>
              <input name="precoMin" placeholder="R$ 0" value={filters.precoMin} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: TEXT_DARK, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Preço Máx</label>
              <input name="precoMax" placeholder="R$ 10.000.000" value={filters.precoMax} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: TEXT_DARK, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quartos</label>
              <input name="quartos" placeholder="Qtd." value={filters.quartos} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {/* Terceira linha - Vagas e Ordenação */}
          <div style={{
            display: 'grid',
            gap: '2rem',
            gridTemplateColumns: 'repeat(2, 1fr)'
          }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: TEXT_DARK, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vagas</label>
              <input name="vagas" placeholder="Qtd." value={filters.vagas} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: TEXT_DARK, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ordenar por</label>
              <select name="ordenar" value={filters.ordenar} onChange={handleChange} style={inputStyle}>
                <option value="destaque">Destaque</option>
                <option value="data">Mais recentes</option>
                <option value="preco">Preço crescente</option>
                <option value="-preco">Preço decrescente</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section style={{
        padding: '3rem 0',
        background: 'white'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
        }}>
          {(loading || loadingSessionao) && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: TEXT_LIGHT,
              fontSize: '1rem'
            }}>
              <p>Carregando imóveis...</p>
            </div>
          )}

          {error && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: SECONDARY_COLOR,
              fontSize: '1rem'
            }}>
              <p>Erro ao carregar imóveis.</p>
            </div>
          )}

          {!loading && !loadingSessionao && filtrados.length > 0 && (
            <div style={{ 
              display: 'grid', 
              gap: '2.5rem', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gridAutoRows: '1fr'
            }}>
              {filtrados.map((imovel, idx) => (
                <div 
                  key={imovel._id || imovel.slug}
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${idx * 0.05}s forwards`,
                    opacity: 0
                  }}
                  className="fadeIn"
                >
                  <CardImovel imovel={imovel} showSecondaryButton={false} />
                </div>
              ))}
            </div>
          )}

          {!loading && !loadingSessionao && filtrados.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '5rem 2rem', 
              background: BG_LIGHT,
              borderRadius: '0',
              marginTop: '2rem'
            }}>
              <div style={{
                fontSize: '3.5rem',
                marginBottom: '1rem',
                opacity: 0.5
              }}>
                🔍
              </div>
              <p style={{ 
                color: TEXT_DARK, 
                fontSize: '1.5rem', 
                fontWeight: 700,
                margin: 0,
                fontFamily: "'Playfair Display', serif",
                letterSpacing: '-0.5px'
              }}>
                Nenhum imóvel encontrado
              </p>
              <p style={{ 
                color: TEXT_LIGHT, 
                fontSize: '0.95rem', 
                margin: '1rem 0 0',
                lineHeight: 1.6
              }}>
                Tente ajustar os parâmetros de busca ou explore todas as propriedades removendo os filtros.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

const inputStyle = {
  width: '100%',
  padding: '0.9rem 1rem',
  borderRadius: '0',
  border: `1px solid rgba(0, 26, 51, 0.15)`,
  background: '#fafafa',
  color: TEXT_DARK,
  fontSize: '0.9rem',
  fontFamily: "'Lora', serif",
  transition: 'all 0.3s ease',
  outline: 'none',
};

export default Catalogo;
