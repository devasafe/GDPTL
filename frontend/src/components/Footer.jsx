import React from 'react';

const PRIMARY_COLOR = '#001d44'
const SECONDARY_COLOR = '#c41e3a'
const TEXT_LIGHT = '#666666'

const Footer = () => (
  <footer style={{ borderTop: `2px solid ${PRIMARY_COLOR}`, padding: '3rem 1.5rem 2rem', background: `linear-gradient(135deg, #001a33 0%, #0f2946 100%)`, marginTop: '6rem' }}>
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '2rem' }}>
        <div>
          <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>Guedes Capital</h4>
          <p style={{ color: '#cccccc', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Imobiliária especializada em imóveis de alto padrão.
          </p>
        </div>
        <div>
          <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>Contato</h4>
          <p style={{ color: '#cccccc', fontSize: '0.95rem', margin: '0.5rem 0' }}>
            Email: <a href="mailto:contato@guedescapital.com.br" style={{ color: SECONDARY_COLOR, textDecoration: 'none' }}>contato@guedescapital.com.br</a>
          </p>
          <p style={{ color: '#cccccc', fontSize: '0.95rem', margin: '0.5rem 0' }}>
            Telefone: <a href="tel:+55" style={{ color: SECONDARY_COLOR, textDecoration: 'none' }}>+55 (XX) XXXXX-XXXX</a>
          </p>
        </div>
        <div>
          <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '1rem', fontSize: '1.1rem' }}>Redes Sociais</h4>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ color: SECONDARY_COLOR, textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s' }}>Instagram</a>
            <a href="#" style={{ color: SECONDARY_COLOR, textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.3s' }}>Facebook</a>
          </div>
        </div>
      </div>
      <div style={{ borderTop: `1px solid rgba(255,255,255,0.2)`, paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#999999', fontSize: '0.9rem' }}>© {new Date().getFullYear()} Guedes Capital Imobiliária. Todos os direitos reservados.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
