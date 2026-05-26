import { useState } from 'react';
import { scoreToColor, scoreToBackground, scoreToLabel } from '../utils/scoreHelpers';

const VerdictCard = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const color = scoreToColor(result.credibilityScore);
  const bg = scoreToBackground(result.credibilityScore);
  const label = scoreToLabel(result.credibilityScore);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const filled = (result.credibilityScore / 100) * circumference;

  const handleShare = () => {
    const text = `TruthTrace verdict: "${result.claimText.substring(0, 60)}..." scored ${result.credibilityScore}/100 — ${label}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.wrapper}>

      <div style={styles.ringWrapper}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="#2a2a2a"
            strokeWidth="10"
          />
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={`${filled} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 70 70)"
          />
          <text
            x="70" y="65"
            textAnchor="middle"
            fill={color}
            fontSize="26"
            fontWeight="700"
          >
            {result.credibilityScore}
          </text>
          <text
            x="70" y="84"
            textAnchor="middle"
            fill="#666"
            fontSize="11"
          >
            out of 100
          </text>
        </svg>
      </div>

      <div style={{
        ...styles.verdictBadge,
        backgroundColor: bg,
        color,
        border: `1px solid ${color}40`,
      }}>
        {label}
      </div>

      <p style={styles.claimText}>"{result.claimText}"</p>

      <div style={styles.explanationBox}>
        <p style={styles.explanationLabel}>🤖 AI Analysis</p>
        <p style={styles.explanation}>{result.explanation}</p>
      </div>

      <div style={styles.footer}>
        <span style={styles.meta}>
          {result.fromCache ? '⚡ From cache' : '🔍 Analysed live'} · {result.processingMs}ms
        </span>
        <button onClick={handleShare} style={styles.shareBtn}>
          {copied ? '✅ Copied!' : '📋 Share result'}
        </button>
      </div>

    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: '680px',
    margin: '2rem auto 1rem',
    padding: '2rem',
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '16px',
    textAlign: 'center',
  },
  ringWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  verdictBadge: {
    display: 'inline-block',
    padding: '0.4rem 1.5rem',
    borderRadius: '99px',
    fontWeight: '700',
    fontSize: '0.95rem',
    letterSpacing: '0.08em',
    marginBottom: '1.25rem',
  },
  claimText: {
    color: '#666',
    fontSize: '0.95rem',
    fontStyle: 'italic',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  },
  explanationBox: {
    background: '#0f1117',
    borderRadius: '10px',
    padding: '1.25rem',
    textAlign: 'left',
    marginBottom: '1.25rem',
  },
  explanationLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.5rem',
  },
  explanation: {
    color: '#ccc',
    lineHeight: '1.7',
    fontSize: '0.95rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    fontSize: '0.8rem',
    color: '#555',
  },
  shareBtn: {
    background: 'transparent',
    border: '1px solid #2a2a4a',
    color: '#888',
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontFamily: 'inherit',
  },
};

export default VerdictCard;