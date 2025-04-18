import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', password: '' });

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = e => {
    e.preventDefault();
    signup(form.username, form.password);
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Signup</h2>
      <input name="username" value={form.username} onChange={onChange} placeholder="Username" required />
      <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" required />
      <button type="submit">Signup</button>
          <p> Already have an account? <a href="/login">Log in here</a>   </p>
    </form>
  );
}