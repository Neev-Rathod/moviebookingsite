import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      {user?.role === 'user' && <Link to="/history">My History</Link>}
      {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
      {user
        ? <button onClick={logout}>Logout</button>
        : <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>}
    </nav>
  );
}
