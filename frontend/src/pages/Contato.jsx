import React, { useState } from 'react'
import { BsWhatsapp, BsEnvelope, BsTelephone, BsGeoAlt } from 'react-icons/bs'

const PRIMARY_COLOR = '#001a33'
const SECONDARY_COLOR = '#c41e3a'
const ACCENT_COLOR = '#ffffff'
const TEXT_LIGHT = '#7a7a7a'
const BG_LIGHT = '#f5f3f0'

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
  })

  const [enviado, setEnviado] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aqui você pode integrar com um serviço de envio de email
    console.log('Formulário enviado:', formData)
    setEnviado(true)
    setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' })
    setTimeout(() => setEnviado(false), 5000)
  }

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

        .contato-hero {
          background: linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #0f2946 100%);
          color: ${ACCENT_COLOR};
          padding: 6rem 2rem 4rem;
          text-align: center;
          margin-top: 6rem;
        }

        .contato-hero h1 {
          font-size: 3.5rem;
          margin: 0 0 1rem;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .contato-hero p {
          font-size: 1.2rem;
          opacity: 0.9;
          margin: 0;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .contato-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .contato-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        @media (max-width: 768px) {
          .contato-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }

        .contato-info {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .info-card {
          display: flex;
          gap: 1.5rem;
          padding: 2rem;
          background: ${BG_LIGHT};
          border-left: 4px solid ${SECONDARY_COLOR};
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateX(8px);
          box-shadow: 0 8px 24px rgba(0, 26, 51, 0.12);
        }

        .info-icon {
          font-size: 2rem;
          color: ${SECONDARY_COLOR};
          flex-shrink: 0;
          margin-top: 0.3rem;
        }

        .info-content h3 {
          margin: 0 0 0.5rem;
          color: ${PRIMARY_COLOR};
          font-size: 1.2rem;
        }

        .info-content p {
          margin: 0;
          color: ${TEXT_LIGHT};
          line-height: 1.6;
        }

        .info-content a {
          color: ${SECONDARY_COLOR};
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s;
        }

        .info-content a:hover {
          color: ${PRIMARY_COLOR};
        }

        .contato-form {
          background: ${BG_LIGHT};
          padding: 3rem;
          border-radius: 2px;
          box-shadow: 0 4px 16px rgba(0, 26, 51, 0.08);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: ${PRIMARY_COLOR};
          font-weight: 600;
          font-size: 0.95rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 2px;
          font-family: 'Lora', serif;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: ${SECONDARY_COLOR};
          box-shadow: 0 0 0 3px rgba(196, 30, 58, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 150px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-submit {
          background: ${SECONDARY_COLOR};
          color: ${ACCENT_COLOR};
          border: none;
          padding: 1.2rem 3rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(196, 30, 58, 0.2);
        }

        .form-submit:hover {
          background: #a01829;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(196, 30, 58, 0.3);
        }

        .form-submit:active {
          transform: translateY(0);
        }

        .mensagem-sucesso {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
          padding: 1rem;
          border-radius: 2px;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 600;
          animation: slideInDown 0.3s ease-out;
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

        .mapa-section {
          background: ${BG_LIGHT};
          padding: 4rem 2rem;
          text-align: center;
        }

        .mapa-titulo {
          font-size: 2.5rem;
          color: ${PRIMARY_COLOR};
          margin: 0 0 2rem;
          font-weight: 800;
        }

        .mapa-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          border-radius: 2px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 26, 51, 0.12);
          height: 500px;
        }

        .mapa-wrapper iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>

      <div style={{ background: ACCENT_COLOR, minHeight: '100vh' }}>
        {/* Hero Section */}
        <section className="contato-hero">
          <h1>Entre em Contato</h1>
          <p>Temos prazer em atender você. Fale conosco através de qualquer um dos canais abaixo ou preencha o formulário.</p>
        </section>

        {/* Main Content */}
        <div className="contato-container">
          <div className="contato-grid">
            {/* Informações de Contato */}
            <div className="contato-info">
              <div className="info-card">
                <div className="info-icon">
                  <BsEnvelope />
                </div>
                <div className="info-content">
                  <h3>Email</h3>
                  <p>
                    <a href="mailto:contato@guedescapital.com">contato@guedescapital.com</a>
                  </p>
                  <p style={{ fontSize: '0.9rem', color: TEXT_LIGHT }}>Respondemos dentro de 24 horas</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <BsTelephone />
                </div>
                <div className="info-content">
                  <h3>Telefone</h3>
                  <p>
                    <a href="tel:+551199999999">(11) 9 9999-9999</a>
                  </p>
                  <p style={{ fontSize: '0.9rem', color: TEXT_LIGHT }}>Seg-Sex, 9h às 18h</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <BsWhatsapp />
                </div>
                <div className="info-content">
                  <h3>WhatsApp</h3>
                  <p>
                    <a href="https://wa.me/551199999999" target="_blank" rel="noopener noreferrer">(11) 9 9999-9999</a>
                  </p>
                  <p style={{ fontSize: '0.9rem', color: TEXT_LIGHT }}>Atendimento imediato</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <BsGeoAlt />
                </div>
                <div className="info-content">
                  <h3>Localização</h3>
                  <p>São Paulo, SP - Brasil</p>
                  <p style={{ fontSize: '0.9rem', color: TEXT_LIGHT }}>Centro Empresarial</p>
                </div>
              </div>
            </div>

            {/* Formulário de Contato */}
            <form className="contato-form" onSubmit={handleSubmit}>
              <h2 style={{ color: PRIMARY_COLOR, marginTop: 0, marginBottom: 2, fontSize: '2rem' }}>Envie sua Mensagem</h2>

              {enviado && (
                <div className="mensagem-sucesso">
                  ✓ Mensagem enviada com sucesso! Entraremos em contato em breve.
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nome">Nome Completo</label>
                  <input
                    id="nome"
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telefone">Telefone</label>
                  <input
                    id="telefone"
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(11) 9 9999-9999"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="assunto">Assunto</label>
                  <input
                    id="assunto"
                    type="text"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    placeholder="Sobre o que é?"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="mensagem">Mensagem</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  placeholder="Escreva sua mensagem aqui..."
                  required
                />
              </div>

              <button type="submit" className="form-submit">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contato
