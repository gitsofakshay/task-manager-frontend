// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 p-4 text-white flex flex-col sm:flex-row sm:justify-between sm:items-center shadow-md rounded-b-lg">
      <h1 className="text-2xl font-bold mb-2 sm:mb-0 transition-transform duration-200 hover:scale-105">
        <Link to="/" className="hover:text-blue-200">Task Manager</Link>
      </h1>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
        {!loggedIn ? (
          <>
            <Link to="/login">
              <button className="bg-white text-blue-600 font-semibold px-4 py-1 rounded shadow hover:bg-blue-100 border border-blue-200 transition-colors duration-150">Login</button>
            </Link>
            <Link to="/signup">
              <button className="bg-blue-500 text-white font-semibold px-4 py-1 rounded shadow hover:bg-blue-700 border border-blue-600 transition-colors duration-150">Signup</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="hover:underline hover:text-blue-200 px-3 py-1 rounded transition-colors duration-150">Dashboard</Link>
            <button onClick={handleLogout} className="hover:underline hover:text-blue-200 px-3 py-1 rounded transition-colors duration-150 bg-blue-700 hover:bg-blue-800">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
