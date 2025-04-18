import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', password: '' });

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = e => {
    e.preventDefault();
    login(form.username, form.password);
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Login</h2>
      <input name="username" value={form.username} onChange={onChange} placeholder="Username" required />
      <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" required />
      <button type="submit">Login</button>
      <p>
      Don't have an account? <a href="/signup">Sign up here</a>.
  </p>
    </form>
  );
}