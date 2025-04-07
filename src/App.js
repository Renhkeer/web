import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.css';
import anime from './anime.jpg';
import Servicios from './Servicios';

// Componente Header
function Header() {
  return (
    <header className="App-header compact-header">
      <Helmet>
        <title>Calendario de Animes</title>
      </Helmet>
      <h1 className="header-title">Calendario de Animes</h1>
      <img 
        src={anime} 
        className="App-anime compact-image" 
        alt="Anime decorativo"
      />
      <nav className="compact-nav">
        <ul>
          <li><Link to="/" className="nav-link">Inicio</Link></li>
          <li><Link to="/servicios" className="nav-link">Servicios</Link></li>
          <li><Link to="/contacto" className="nav-link">Contacto</Link></li>
        </ul>
      </nav>
    </header>
  );
}

// Componente Inicio
function Inicio() {
  return (
    <section id="inicio">
      <h2>Bienvenido</h2>
      <p>VE TU CALENDARIO DE ANIMES!!</p>
    </section>
  );
}

// Componente Contacto
function Contacto() {
  return (
    <section id="contacto">
      <h2>Contacto</h2>
      <p>Los 3 payasos</p>
    </section>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; {new Date().getFullYear()} CAnime. Todos los derechos reservados.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
