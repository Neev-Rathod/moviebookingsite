import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SeatSelection() {
  const { id } = useParams();
  const nav    = useNavigate();
  const [movie, setMovie] = useState(null);
  const [sel, setSel]     = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get(`/movies/${id}`);
      setMovie(res.data);
    })();
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  const toggle = (r,c) => {
    const key = `${r}-${c}`;
    if (movie.booked.includes(key)) return;
    setSel(sel.includes(key)
      ? sel.filter(x=>x!==key)
      : sel.length<4 ? [...sel, key] : sel
    );
  };

  const submit = async () => {
    const seats = sel.map(s=>{
      const [row,col]=s.split('-').map(Number);
      return { row, col };
    });
    await api.post(`/movies/${id}/book`, { seats });
    nav('/');
  };

  return (
    <div>
      <h2>Select Seats: {movie.name}</h2>
      <div className="seat-grid">
        {Array.from({length: movie.rows}).map((_,r)=>(
          <div key={r} className="seat-row">
            {Array.from({length: movie.cols}).map((_,c)=>{
              const key = `${r}-${c}`;
              const booked   = movie.booked.includes(key);
              const selected = sel.includes(key);
              return (
                <div
                  key={c}
                  className={`seat ${booked?'booked':selected?'selected':''}`}
                  onClick={()=>toggle(r,c)}
                >
                  {r}-{c}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <button disabled={!sel.length} onClick={submit}>
        Book {sel.length} seat(s)
      </button>
    </div>
  );
}
