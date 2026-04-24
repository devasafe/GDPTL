import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Detalhes from './pages/Detalhes';
import Postagem from './pages/Postagem';
import News from './pages/News';
import Contato from './pages/Contato';
import Login from './pages/Login';
import PainelAdmin from './pages/PainelAdmin';

const App = () => (
  <div style={{ minHeight: '100vh' }}>
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/imoveis" element={<Catalogo />} />
        <Route path="/imovel/:slug" element={<Detalhes />} />
        <Route path="/postagem/:slug" element={<Postagem />} />
        <Route path="/news" element={<News />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={(
            <RequireAuth>
              <PainelAdmin />
            </RequireAuth>
          )}
        />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;
