import React, { useMemo, useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const PRIMARY_COLOR = '#001d44'
const SECONDARY_COLOR = '#c41e3a'
const ACCENT_COLOR = '#ffffff'

const linkStyle = ({ isActive }) => ({
  color: isActive ? SECONDARY_COLOR : PRIMARY_COLOR,
  fontWeight: isActive ? 700 : 600,
  textDecoration: 'none',
  fontSize: '1rem',
  transition: 'color 0.3s',
});

const Navbar = () => {
  const navigate = useNavigate();
  const authed = useMemo(() => !!localStorage.getItem('gc_token'), []);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem('gc_token');
    navigate('/');
  };

  // Calcula opacity: começa com 1 no topo e vai para 0.95 ao descer (mais opaco ao descer)
  const navOpacity = Math.max(1 - (scrollY / 500) * 0.15, 0.85);

  return (
    <header style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      borderBottom: `1px solid #e8e8e8`, 
      background: `rgba(255, 255, 255, ${navOpacity})`,
      boxShadow: scrollY > 10 ? '0 4px 16px rgba(0, 29, 68, 0.12)' : '0 2px 8px rgba(0, 29, 68, 0.05)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease'
    }}>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.2rem 2rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <Link to="/" style={{ color: PRIMARY_COLOR, fontWeight: 300, fontSize: '1.8rem', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          <span style={{ fontWeight: 700 }}>Guedes</span> Capital
        </Link>
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <NavLink to="/" style={linkStyle} end>
            Início
          </NavLink>
          <NavLink to="/imoveis" style={linkStyle}>
            Portfólio
          </NavLink>
          <NavLink to="/news" style={linkStyle}>
            News
          </NavLink>
          <NavLink to="/contato" style={linkStyle}>
            Contato
          </NavLink>
          {!authed ? null : (
            <>
              <NavLink to="/admin" style={linkStyle}>
                Painel
              </NavLink>
              <button onClick={logout} style={{ background: SECONDARY_COLOR, border: 'none', borderRadius: '0px', padding: '0.6rem 1.5rem', color: ACCENT_COLOR, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s', fontSize: '0.95rem' }}>
                Sair
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
