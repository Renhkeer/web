import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function Servicios() {
  const [animes, setAnimes] = useState([]);
  const [nuevoAnime, setNuevoAnime] = useState('');
  const [editando, setEditando] = useState(null);
  const [editText, setEditText] = useState('');
  const [accionActual, setAccionActual] = useState(null);

  // Cargar animes al iniciar
  useEffect(() => {
    cargarAnimes();
  }, []);

  const cargarAnimes = async () => {
    const { data, error } = await supabase
      .from('animes')
      .select('*')
      .order('creado_en', { ascending: false });
    
    if (error) console.error('Error cargando animes:', error);
    else setAnimes(data || []);
  };

  // Agregar anime
  const agregarAnime = async () => {
    if (!nuevoAnime.trim()) return;
    
    const { data, error } = await supabase
      .from('animes')
      .insert([{ nombre: nuevoAnime }])
      .select();
    
    if (error) {
      console.error('Error agregando anime:', error);
    } else {
      setAnimes([data[0], ...animes]);
      setNuevoAnime('');
      setAccionActual(null);
    }
  };

  // Actualizar anime
  const guardarEdicion = async () => {
    if (!editText.trim()) return;
    
    const { error } = await supabase
      .from('animes')
      .update({ nombre: editText })
      .eq('id', editando);
    
    if (error) {
      console.error('Error actualizando anime:', error);
    } else {
      cargarAnimes();
      setEditando(null);
      setEditText('');
    }
  };

  // Eliminar anime
  const eliminarAnime = async (id) => {
    const { error } = await supabase
      .from('animes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error eliminando anime:', error);
    } else {
      cargarAnimes();
    }
  };

  return (
    <div className="servicios-container">
      <h2>Servicios de Anime</h2>
      
      <div className="botones-servicios">
        <button 
          onClick={() => setAccionActual('agregar')} 
          className="boton-servicio"
        >
          Agregar Anime
        </button>
        
        <button 
          onClick={() => setAccionActual('editar')} 
          className="boton-servicio"
          disabled={animes.length === 0}
        >
          Editar Anime
        </button>
        
        <button 
          onClick={() => setAccionActual('eliminar')} 
          className="boton-servicio"
          disabled={animes.length === 0}
        >
          Eliminar Anime
        </button>
        
        <button 
          onClick={() => setAccionActual('listar')} 
          className="boton-servicio"
          disabled={animes.length === 0}
        >
          Mostrar Animes
        </button>
      </div>

      {/* Formulario para agregar anime */}
      {accionActual === 'agregar' && (
        <div className="formulario-anime">
          <h3>Agregar nuevo anime</h3>
          <input
            type="text"
            value={nuevoAnime}
            onChange={(e) => setNuevoAnime(e.target.value)}
            placeholder="Nombre del anime"
          />
          <button onClick={agregarAnime}>Agregar</button>
        </div>
      )}

      {/* Vista para editar anime */}
      {accionActual === 'editar' && (
        <div className="lista-animes">
          <h3>Selecciona un anime para editar</h3>
          <ul>
            {animes.map(anime => (
              <li key={anime.id}>
                {editando === anime.id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={guardarEdicion}>Guardar</button>
                  </>
                ) : (
                  <>
                    {anime.nombre}
                    <button onClick={() => {
                      setEditando(anime.id);
                      setEditText(anime.nombre);
                    }}>Editar</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Vista para eliminar anime */}
      {accionActual === 'eliminar' && (
        <div className="lista-animes">
          <h3>Selecciona un anime para eliminar</h3>
          <ul>
            {animes.map(anime => (
              <li key={anime.id}>
                {anime.nombre}
                <button onClick={() => eliminarAnime(anime.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Vista para mostrar la lista */}
      {accionActual === 'listar' && (
        <div className="lista-animes">
          <h3>Lista de Animes</h3>
          {animes.length === 0 ? (
            <p>No hay animes en la lista</p>
          ) : (
            <ul>
              {animes.map(anime => (
                <li key={anime.id}>{anime.nombre}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Servicios;