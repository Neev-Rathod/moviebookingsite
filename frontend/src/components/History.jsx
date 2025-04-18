import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await api.get('/movies/history');
      setHistory(res.data);
    })();
  }, []);

  return (
    <div>
      <h2>My Booking History</h2>
      {history.length ? history.map(h=>(
        <div key={h.movieId} className="history-card">
          {h.imageUrl && <img src={h.imageUrl} alt={h.name} width={100} />}
          <div>
            <h3>{h.name}</h3>
            <p>{h.time}</p>
            <p>
              {new Date(h.startDate).toLocaleDateString()} –{' '}
              {new Date(h.endDate).toLocaleDateString()}
            </p>
            <p>Seats: {h.seats.map(s=>`${s.row}-${s.col}`).join(', ')}</p>
            <p>Price: ${h.price}</p>
            <p>Booked on: {new Date(h.bookedAt).toLocaleString()}</p>
            <button onClick={async ()=>{
              await api.post(`/movies/${h.movieId}/cancel`);
              window.location.reload();
            }}>
              Cancel Booking
            </button>
          </div>
        </div>
      )) : <p>No bookings yet.</p>}
    </div>
  );
}
