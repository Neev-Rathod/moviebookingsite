import React, { useState } from 'react';
import api from '../api/axios';

export default function AddMovieForm() {
  const [form, setForm] = useState({
    name: '', rows: '', cols: '',
    startDate: '', endDate: '',
    time: '', price: '', description: ''
  });
  const [file, setFile] = useState(null);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onFile   = e => setFile(e.target.files[0]);

  const onSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k,v]) => data.append(k, v));
    if (file) data.append('image', file);
    await api.post('/movies', data);
    window.location.reload();
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Add Movie</h2>
      <input name="name" onChange={onChange} placeholder="Name" required />
      <input name="rows" type="number" onChange={onChange} placeholder="Rows" required />
      <input name="cols" type="number" onChange={onChange} placeholder="Cols" required />
      <input name="startDate" type="date" onChange={onChange} required />
      <input name="endDate"   type="date" onChange={onChange} required />
      <input name="time" onChange={onChange} placeholder="Time" required />
      <input name="price" type="number" onChange={onChange} placeholder="Price" required />
      <textarea name="description" onChange={onChange} placeholder="Description" required />
      <input type="file" onChange={onFile} />
      <button type="submit">Add Movie</button>
    </form>
  );
}
