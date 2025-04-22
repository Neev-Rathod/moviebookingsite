import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setCancelling] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/api/movies/history');
        setHistory(res.data);
      } catch (error) {
        console.error("Failed to fetch booking history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  const handleCancelBooking = async (movieId) => {
    setCancelling(movieId);
    try {
      await api.post(`/api/movies/${movieId}/cancel`);
      setHistory(history.filter(booking => booking.movieId !== movieId));
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    } finally {
      setCancelling(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Booking History</h2>
      
      {history.length ? (
        <div className="space-y-4">
          {history.map(booking => (
            <div 
              key={booking.movieId} 
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row border border-gray-200"
            >
              {/* Movie Image */}
              <div className="sm:w-48 h-48 flex-shrink-0 bg-gray-100">
                {booking.imageUrl ? (
                  <img 
                    src={booking.imageUrl} 
                    alt={booking.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h18M3 16h18"></path>
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Booking Details */}
              <div className="p-4 flex-grow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{booking.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                    ${booking.price}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {booking.time}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                    </svg>
                    <span className="font-medium">Seats:</span>&nbsp;
                    {booking.seats.map(s => `${s.row}-${s.col}`).join(', ')}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span className="font-medium">Booked on:</span>&nbsp;
                    {new Date(booking.bookedAt).toLocaleString()}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleCancelBooking(booking.movieId)}
                  disabled={isCancelling === booking.movieId}
                  className={`mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                    ${isCancelling === booking.movieId 
                      ? 'bg-red-300 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}`}
                >
                  {isCancelling === booking.movieId ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Cancel Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings yet</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't booked any movies yet.</p>
        </div>
      )}
    </div>
  );
}