import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import axios from 'axios';

function Servicios() {
  const [animes, setAnimes] = useState([]);
  const [nuevoAnime, setNuevoAnime] = useState('');
  const [editando, setEditando] = useState(null);
  const [editText, setEditText] = useState('');
  const [accionActual, setAccionActual] = useState(null);
  const [animeInfo, setAnimeInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  useEffect(() => {
    cargarAnimes();
  }, []);

  const cargarAnimes = async () => {
    const { data, error } = await supabase
      .from('animes')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('Error cargando animes:', error);
    } else {
      setAnimes(data || []);
    }
  };

  const buscarAnimeInfo = async (nombre) => {
    if (!nombre.trim()) return;

    setLoading(true);
    setErrorBusqueda('');
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(nombre)}&limit=1`);
      const result = response.data?.data?.[0];

      if (result) {
        setAnimeInfo(result);
      } else {
        setAnimeInfo(null);
        setErrorBusqueda('No se encontró información para este anime');
      }
    } catch (error) {
      console.error('Error buscando anime:', error);
      setAnimeInfo(null);
      setErrorBusqueda('Error al buscar el anime. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const agregarAnime = async () => {
    if (!nuevoAnime.trim()) return;

    const animeExiste = animes.some(a => a.nombre.toLowerCase() === nuevoAnime.trim().toLowerCase());
    if (animeExiste) {
      setErrorBusqueda('Este anime ya está en la lista.');
      return;
    }

    const animeData = {
      nombre: nuevoAnime,
      info: animeInfo ? {
        imagen: animeInfo.images?.jpg?.image_url,
        titulo: animeInfo.title,
        sinopsis: animeInfo.synopsis,
        episodios: animeInfo.episodes,
        puntuacion: animeInfo.score,
        estado: animeInfo.status,
        fecha_estreno: animeInfo.aired?.string
      } : null
    };

    const { data, error } = await supabase
      .from('animes')
      .insert([animeData])
      .select();

    if (error) {
      console.error('Error agregando anime:', error);
      setErrorBusqueda('Error al guardar el anime');
    } else {
      setAnimes([data[0], ...animes]);
      setNuevoAnime('');
      setAnimeInfo(null);
      setAccionActual(null);
    }
  };

  const guardarEdicion = async () => {
    if (!editText.trim()) return;

    const { error } = await supabase
      .from('animes')
      .update({ nombre: editText })
      .eq('id', editando);

    if (error) {
      console.error('Error actualizando anime:', error);
    } else {
      setAnimes(animes.map(anime => 
        anime.id === editando ? { ...anime, nombre: editText } : anime
      ));
      setEditando(null);
      setEditText('');
    }
  };

  const eliminarAnime = async (id) => {
    const { error } = await supabase
      .from('animes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error eliminando anime:', error);
    } else {
      setAnimes(animes.filter(anime => anime.id !== id));
    }
  };

  return (
    <div className="servicios-container">
      <h2>Servicios de Anime</h2>

      <div className="botones-servicios">
        <button onClick={() => { setAccionActual('agregar'); setAnimeInfo(null); setErrorBusqueda(''); }} className="boton-servicio">
          Agregar Anime
        </button>
        <button onClick={() => setAccionActual('editar')} className="boton-servicio" disabled={animes.length === 0}>
          Editar Anime
        </button>
        <button onClick={() => setAccionActual('eliminar')} className="boton-servicio" disabled={animes.length === 0}>
          Eliminar Anime
        </button>
        <button onClick={() => setAccionActual('listar')} className="boton-servicio" disabled={animes.length === 0}>
          Mostrar Animes
        </button>
      </div>

      {accionActual === 'agregar' && (
        <div className="formulario-anime">
          <h3>Agregar nuevo anime</h3>
          <div className="busqueda-anime">
            <input
              type="text"
              value={nuevoAnime}
              onChange={(e) => setNuevoAnime(e.target.value)}
              placeholder="Nombre del anime"
              onKeyDown={(e) => e.key === 'Enter' && buscarAnimeInfo(nuevoAnime)}
            />
            <button onClick={() => buscarAnimeInfo(nuevoAnime)} disabled={!nuevoAnime.trim() || loading}>
              {loading ? 'Buscando...' : 'Buscar Info'}
            </button>
          </div>

          {errorBusqueda && <p className="error-message">{errorBusqueda}</p>}

          {animeInfo && (
            <div className="anime-info">
              <div className="anime-info-header">
                <img src={animeInfo.images?.jpg?.image_url} alt={animeInfo.title} className="anime-image" />
                <div className="anime-details">
                  <h4>{animeInfo.title}</h4>
                  <p><strong>Estado:</strong> {animeInfo.status}</p>
                  <p><strong>Episodios:</strong> {animeInfo.episodes || 'Desconocido'}</p>
                  <p><strong>Puntuación:</strong> {animeInfo.score || 'N/A'}</p>
                  <p><strong>Estreno:</strong> {animeInfo.aired?.string || 'Desconocido'}</p>
                </div>
              </div>
              <div className="anime-sinopsis">
                <p><strong>Sinopsis:</strong> {animeInfo.synopsis?.substring(0, 200)}...</p>
              </div>
            </div>
          )}

          <button onClick={agregarAnime} disabled={!nuevoAnime.trim()} className="boton-agregar">
            Agregar Anime
          </button>
        </div>
      )}

      {accionActual === 'editar' && (
        <div className="lista-animes">
          <h3>Selecciona un anime para editar</h3>
          <ul>
            {animes.map(anime => (
              <li key={anime.id}>
                {editando === anime.id ? (
                  <div className="edicion-anime">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="input-edicion"
                    />
                    <button onClick={guardarEdicion} className="boton-guardar">Guardar</button>
                  </div>
                ) : (
                  <div className="item-anime">
                    <span>{anime.nombre}</span>
                    <button onClick={() => { setEditando(anime.id); setEditText(anime.nombre); }} className="boton-editar">
                      Editar
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {accionActual === 'eliminar' && (
        <div className="lista-animes">
          <h3>Selecciona un anime para eliminar</h3>
          <ul>
            {animes.map(anime => (
              <li key={anime.id}>
                <div className="item-anime">
                  <span>{anime.nombre}</span>
                  <button onClick={() => eliminarAnime(anime.id)} className="boton-eliminar">
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {accionActual === 'listar' && (
        <div className="lista-animes">
          <h3>Lista de Animes</h3>
          {animes.length === 0 ? (
            <p>No hay animes en la lista</p>
          ) : (
            <div className="grid-animes">
              {animes.map(anime => (
                <div key={anime.id} className="tarjeta-anime">
                  {anime.info?.imagen && (
                    <img src={anime.info.imagen} alt={anime.info.titulo || anime.nombre} className="imagen-anime" />
                  )}
                  <div className="contenido-anime">
                    <h4>{anime.info?.titulo || anime.nombre}</h4>
                    {anime.info && (
                      <>
                        <p><strong>Episodios:</strong> {anime.info.episodios || 'Desconocido'}</p>
                        <p><strong>Puntuación:</strong> {anime.info.puntuacion || 'N/A'}</p>
                        <p className="sinopsis">{anime.info.sinopsis?.substring(0, 100)}...</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Servicios;
