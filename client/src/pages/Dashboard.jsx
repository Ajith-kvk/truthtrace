import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { scoreToColor, scoreToLabel } from '../utils/scoreHelpers';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const token = localStorage.getItem('token');
    axios
      .get(`${API_URL}/api/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setChecks(res.data.checks))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>
          <div>
            <h2 style={styles.heading}>Fact-check history</h2>
            <p style={styles.sub}>
              {user?.name} · {checks.length} checks
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            style={styles.newBtn}
          >
            + New check
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="spinner" />
          </div>
        )}

        {!loading && checks.length === 0 && (
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>No checks yet</p>
            <p style={styles.emptySub}>
              Submit your first claim to see results here
            </p>
            <button
              onClick={() => navigate('/')}
              style={styles.newBtn}
            >
              Check a claim →
            </button>
          </div>
        )}

        {checks.map((check) => {
          const color = scoreToColor(check.credibilityScore);
          const label = scoreToLabel(check.credibilityScore);
          const isExpanded = expanded === check._id;

          return (
            <div
              key={check._id}
              style={styles.card}
              onClick={() => toggleExpand(check._id)}
            >
              <div style={styles.cardTop}>
                <div style={styles.cardLeft}>
                  <p style={styles.claimText}>{check.claimText}</p>
                  <p style={styles.date}>
                    {new Date(check.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div style={{
                  ...styles.badge,
                  color,
                  border: `1px solid ${color}44`,
                  background: `${color}15`,
                }}>
                  <span style={styles.badgeScore}>
                    {check.credibilityScore}
                  </span>
                  <span style={styles.badgeLabel}>{label}</span>
                </div>
              </div>

              {isExpanded && check.explanation && (
                <div style={styles.expandedBox}>
                  <p style={styles.expandedLabel}>AI Analysis</p>
                  <p style={styles.expandedText}>{check.explanation}</p>
                </div>
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    padding: '2rem 1rem',
  },
  container: {
    maxWidth: '680px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.3rem',
  },
  sub: {
    color: '#666',
    fontSize: '0.9rem',
  },
  newBtn: {
    background: 'linear-gradient(135deg, #4F6EF7, #7B5CF0)',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1.25rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    fontWeight: '500',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '16px',
  },
  emptyText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
  },
  emptySub: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
  },
  card: {
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '10px',
    padding: '1rem 1.25rem',
    marginBottom: '0.75rem',
    cursor: 'pointer',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  cardLeft: {
    flex: 1,
  },
  claimText: {
    fontSize: '0.95rem',
    color: '#ccc',
    marginBottom: '0.3rem',
    lineHeight: '1.5',
  },
  date: {
    fontSize: '0.78rem',
    color: '#555',
  },
  badge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '0.5rem 0.85rem',
    borderRadius: '8px',
    minWidth: '80px',
    flexShrink: 0,
  },
  badgeScore: {
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  badgeLabel: {
    fontSize: '0.6rem',
    fontWeight: '600',
    letterSpacing: '0.06em',
  },
  expandedBox: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #2a2a4a',
  },
  expandedLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.4rem',
  },
  expandedText: {
    fontSize: '0.9rem',
    color: '#aaa',
    lineHeight: '1.6',
  },
};

export default Dashboard;