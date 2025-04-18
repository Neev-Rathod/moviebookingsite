import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function MovieCard({ movie, isUser,deleteId}) {
  const nav = useNavigate();
  const user = localStorage.getItem('role')
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this show?')) return;
  
    try {
      const res = await fetch(`http://localhost:5000/api/movies/${deleteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (res.ok) {
        alert('Show deleted successfully!');
        window.location.reload();
      } else {
        let errorMsg = 'Failed to delete show';
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          const text = await res.text();
          errorMsg = text || errorMsg;
        }
        alert(errorMsg);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the show');
    }
  };
  

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:scale-[1.005]" style={{width:"calc(100% - 60px)"}}>
      {/* Movie Image with gradient overlay */}
      <div className="relative h-48 overflow-hidden">
        {movie.imageUrl ? (
          <img 
            src={movie.imageUrl} 
            alt={movie.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h18M3 16h18"></path>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
          
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{movie.name}</h3>
          <span className="text-lg font-semibold text-indigo-600">${movie.price}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {movie.time}
        </div>
        
        <div className="text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            {new Date(movie.startDate).toLocaleDateString()} – {new Date(movie.endDate).toLocaleDateString()}
          </div>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2 h-10">
          {movie.description}
        </p>
        
        {isUser && movie.status !== 'House full' && (
          <button 
            onClick={() => nav(`/movies/${movie.id}/book`)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
            </svg>
            Book Ticket
          </button>
        )}
        {user === 'admin' && (
  <button
    onClick={handleDelete}
    className="bg-red-600 text-white px-4 py-2 rounded mt-2 hover:bg-red-700"
  >
    Delete Show
  </button>
)}

        
        {isUser && movie.status === 'House full' && (
          <div className="w-full bg-gray-200 text-gray-500 font-medium py-2 px-4 rounded-md text-center cursor-not-allowed">
            Sold Out
          </div>
        )}
      </div>
    </div>
  );
}