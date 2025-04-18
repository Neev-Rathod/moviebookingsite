import React from 'react';
import AddMovieForm from './AddMovieForm';
import MovieList from './MovieList';

export default function AdminDashboard() {
  return (
    <div>
      <AddMovieForm />
      <MovieList />
    </div>
  );
}