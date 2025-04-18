import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import MovieCard from './MovieCard';
import { AuthContext } from '../context/AuthContext';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const { user }     = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const res = await api.get('/movies');
      setMovies(res.data);
    })();
  }, []);

  return (
    <div>
      <h2>Now Showing</h2>
      <div className="grid">
        {movies.map(m => (
          <MovieCard key={m.id} movie={m} isUser={user?.role==='user'} />
        ))}
      </div>
    </div>
  );
}
