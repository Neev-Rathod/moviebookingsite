import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie, isUser }) {
  const nav = useNavigate();
  return (
    <div className="card">
      {movie.imageUrl && <img src={movie.imageUrl} alt={movie.name} />}
      <h3>{movie.name}</h3>
      <p>{movie.time}</p>
      <p>
        {new Date(movie.startDate).toLocaleDateString()} –{' '}
        {new Date(movie.endDate).toLocaleDateString()}
      </p>
      <p>{movie.description}</p>
      <p>Price: ${movie.price}</p>
      <p>{movie.status}</p>
      {isUser && movie.status !== 'House full' && (
        <button onClick={() => nav(`/movies/${movie.id}/book`)}>
          Book Ticket
        </button>
      )}
    </div>
  );
}
