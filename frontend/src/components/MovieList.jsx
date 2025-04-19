import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axios';
import MovieCard from './MovieCard';
import { AuthContext } from '../context/AuthContext';

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/movies');
        setAllMovies(res.data);
        setMovies(res.data);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    })();
  }, []);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    
    if (!date) {
      setMovies(allMovies);
      return;
    }

    const selectedDateObj = new Date(date);
    
    const filteredMovies = allMovies.filter(movie => {
      const startDate = new Date(movie.startDate);
      const endDate = new Date(movie.endDate);
      return selectedDateObj >= startDate && selectedDateObj <= endDate;
    });
    
    setMovies(filteredMovies);
  };
  
  const resetFilter = () => {
    setSelectedDate('');
    setMovies(allMovies);
  };

  // Helper function to format dates for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Now Showing</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              placeholder="Select date"
            />
          </div>
          
          {selectedDate && (
            <button 
              onClick={resetFilter}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
      
      {movies.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <p className="text-xl text-gray-500">No movies found for the selected date</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {movies.map(movie => (
            <div key={movie.id} className="w-96 mb-6">
              <MovieCard 
                movie={movie} 
                isUser={user?.role === 'user'} 
                deleteId={movie.id} 
              />
              <div className="mt-2 text-sm text-gray-600">
                <p>Showing: {formatDate(movie.startDate)} - {formatDate(movie.endDate)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}