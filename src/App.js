import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import anime from './anime.jpg';
import Servicios from './Servicios';

// Componente de encabezado separado para usar useLocation
function Header() {
  const location = useLocation();
  const isServiciosPage = location.pathname === '/servicios';

  return (
    <header className="App-header compact-header">
      <title>Calendario de Animes</title>
      <h1 className="header-title">Calendario de Animes</h1>
      {!isServiciosPage && (
        <img 
          src={anime} 
          className="App-anime compact-image" 
          alt="anime"
        />
      )}
      <nav className="compact-nav">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/servicios">Servicios</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
      </nav>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        {/* Cabecera */}
        <Header />

        {/* Contenido principal */}
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <section id="inicio">
                  <h2>Bienvenido</h2>
                  <p>VE TU CALENDARIO DE ANIMES!!</p>
                </section>
              </>
            } />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/contacto" element={
              <section id="contacto">
                <h2>Contacto</h2>
                <p>Los 3 payasos</p>
              </section>
            } />
          </Routes>
        </main>

        {/* Pie de página */}
        <footer>
          <p>&copy; {new Date().getFullYear()} CAnime. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;