import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        🔍 TruthTrace
      </Link>

      <div style={styles.links}>
        {user ? (
          <>
            <span style={styles.greeting}>Hi, {user.name.split(' ')[0]}</span>
            <Link to="/dashboard" style={styles.link}>History</Link>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.btnLink}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    borderBottom: '1px solid #2a2a2a',
    backgroundColor: '#0f1117',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#e8e8e8',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  greeting: {
    color: '#888',
    fontSize: '0.9rem',
  },
  link: {
    color: '#aaa',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  btn: {
    background: 'transparent',
    border: '1px solid #444',
    color: '#aaa',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  btnLink: {
    background: '#4F6EF7',
    color: '#fff',
    textDecoration: 'none',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
  },
};

export default Navbar;