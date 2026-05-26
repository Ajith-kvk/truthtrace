import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    if (!name || !email || !password) {
      return setError('Please fill in all fields');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create account</h2>
        <p style={styles.sub}>Save and track your fact-checks over time</p>

        {error && <div style={styles.error}>{error}</div>}

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          style={styles.input}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.linkText}>Log in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
  },
  card: {
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: '#e8e8e8',
  },
  sub: {
    color: '#666',
    marginBottom: '1.75rem',
    fontSize: '0.9rem',
  },
  error: {
    background: '#2a1515',
    border: '1px solid #E24B4A44',
    color: '#E24B4A',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    background: '#0f1117',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    padding: '0.85rem 1rem',
    color: '#e8e8e8',
    fontSize: '1rem',
    marginBottom: '1rem',
    fontFamily: 'inherit',
    outline: 'none',
    display: 'block',
  },
  btn: {
    width: '100%',
    background: 'linear-gradient(135deg, #4F6EF7, #7B5CF0)',
    color: '#fff',
    border: 'none',
    padding: '0.9rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '1.25rem',
    fontFamily: 'inherit',
  },
  footer: {
    textAlign: 'center',
    color: '#666',
    fontSize: '0.9rem',
  },
  linkText: {
    color: '#4F6EF7',
    textDecoration: 'none',
  },
};

export default Register;