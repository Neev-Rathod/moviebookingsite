import React, { useState } from 'react';
import api from '../api/axios';

export default function AddMovieForm() {
  const [form, setForm] = useState({
    name: '', 
    rows: '', 
    cols: '',
    startDate: '', 
    endDate: '',
    time: '', 
    price: '', 
    description: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const onFile = e => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (file) data.append('image', file);
      
      await api.post('/movies', data);
      
      // Clear form
      setForm({
        name: '', rows: '', cols: '',
        startDate: '', endDate: '',
        time: '', price: '', description: ''
      });
      setFile(null);
      setPreview(null);
      
      // Show success message
      setSuccess('Movie added successfully!');
      
      // Reset form fields
      e.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add movie. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 bg-white rounded-lg mt-4 shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Movie</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Movie Name */}
          <div className="col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Movie Name
            </label>
            <input 
              id="name"
              name="name" 
              value={form.name}
              onChange={onChange} 
              placeholder="Enter movie name" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          {/* Theater Layout */}
          <div>
            <label htmlFor="rows" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Rows
            </label>
            <input 
              id="rows"
              name="rows" 
              type="number" 
              value={form.rows}
              onChange={onChange} 
              placeholder="Enter number of rows" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="cols" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Columns
            </label>
            <input 
              id="cols"
              name="cols" 
              type="number" 
              value={form.cols}
              onChange={onChange} 
              placeholder="Enter number of columns" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          {/* Dates */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input 
              id="startDate"
              name="startDate" 
              type="date" 
              value={form.startDate}
              onChange={onChange} 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input 
              id="endDate"
              name="endDate" 
              type="date" 
              value={form.endDate}
              onChange={onChange} 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          {/* Time and Price */}
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Show Time
            </label>
            <input 
              id="time"
              name="time" 
              value={form.time}
              onChange={onChange} 
              placeholder="e.g. 7:30 PM" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Ticket Price ($)
            </label>
            <input 
              id="price"
              name="price" 
              type="number" 
              step="0.01"
              value={form.price}
              onChange={onChange} 
              placeholder="Enter ticket price" 
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Movie Description
            </label>
            <textarea 
              id="description"
              name="description" 
              value={form.description}
              onChange={onChange} 
              placeholder="Enter movie description" 
              required
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          {/* Image Upload */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Movie Poster
            </label>
            <div className="flex items-center space-x-6">
              <div className="flex-1">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <span>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="image" 
                          type="file" 
                          className="sr-only" 
                          onChange={onFile}
                          accept="image/*"
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </label>
              </div>
              {preview && (
                <div className="h-32 w-24 overflow-hidden rounded-md bg-gray-100">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Movie...
              </>
            ) : 'Add Movie'}
          </button>
        </div>
      </form>
    </div>
  );
}