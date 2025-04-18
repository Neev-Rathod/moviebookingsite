import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SeatSelection() {
  const { id } = useParams();
  const nav = useNavigate();
  const [movie, setMovie] = useState(null);
  const [sel, setSel] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get(`/movies/${id}`);
      setMovie(res.data);
    })();
  }, [id]);

  if (!movie) return <div className="flex justify-center items-center h-32"><p className="text-lg">Loading...</p></div>;

  const toggle = (r, c) => {
    const key = `${r}-${c}`;
    if (movie.booked.includes(key)) return;
    setSel(sel.includes(key)
      ? sel.filter(x => x !== key)
      : sel.length < 4 ? [...sel, key] : sel
    );
  };

  const submit = async () => {
    const seats = sel.map(s => {
      const [row, col] = s.split('-').map(Number);
      return { row, col };
    });
    await api.post(`/movies/${id}/book`, { seats });
    nav('/');
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Select Seats: {movie.name}</h2>
      
      {/* Legend */}
      <div className="flex justify-center gap-8 mb-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-600 mr-2"></div>
          <span>Booked</span>
        </div>
      </div>
      
      {/* Screen */}
      <div className="w-full bg-blue-200 h-8 rounded mb-8 flex items-center justify-center text-sm text-gray-700">
        SCREEN
      </div>
      
      {/* Seat Grid */}
      <div className="flex flex-col items-center mb-8 gap-1">
        {Array.from({ length: movie.rows }).map((_, r) => (
          <div key={r} className="flex gap-1">
            {Array.from({ length: movie.cols }).map((_, c) => {
              const key = `${r}-${c}`;
              const booked = movie.booked.includes(key);
              const selected = sel.includes(key);
              return (
                <div
                  key={c}
                  onClick={() => toggle(r, c)}
                  className={`w-6 h-6 cursor-pointer flex items-center justify-center text-xs transition-colors
                    ${booked ? 'bg-gray-600 cursor-not-allowed' : selected ? 'bg-green-500' : 'bg-gray-300 hover:bg-gray-400'}`}
                  title={`Row ${r+1}, Seat ${c+1}`}
                >
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Selection Info & Book Button */}
      <div className="flex flex-col items-center">
        {sel.length > 0 && (
          <div className="mb-4 text-center">
            <p>Selected {sel.length} seat(s):</p>
            <p className="text-sm text-gray-600">
              {sel.map(s => {
                const [r, c] = s.split('-').map(Number);
                return `Row ${r+1}, Seat ${c+1}`;
              }).join(', ')}
            </p>
          </div>
        )}
        <button 
          disabled={!sel.length} 
          onClick={submit}
          className={`px-6 py-2 rounded ${sel.length ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Book {sel.length} seat(s)
        </button>
      </div>
    </div>
  );
}