import { useState } from 'react';

const ClaimInput = ({ onSubmit, loading }) => {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (text.trim().length < 10) return;
    onSubmit(text.trim());
  };

  const handleKeyDown = (e) => {
    // Submit on Ctrl+Enter
    if (e.ctrlKey && e.key === 'Enter') handleSubmit();
  };

  const charColor = text.length > 900 ? '#E24B4A' : '#666';

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.heading}>Is it true?</h1>
      <p style={styles.sub}>
        Paste any claim, headline, or WhatsApp forward. We'll fact-check it instantly.
      </p>

      <div style={styles.inputBox}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. 5G towers cause COVID-19 and governments are hiding the evidence..."
          maxLength={1000}
          rows={5}
          style={styles.textarea}
        />
        <div style={styles.inputFooter}>
          <span style={{ ...styles.charCount, color: charColor }}>
            {text.length}/1000
          </span>
          <span style={styles.hint}>Ctrl+Enter to submit</span>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || text.trim().length < 10}
        style={{
          ...styles.button,
          opacity: loading || text.trim().length < 10 ? 0.5 : 1,
          cursor: loading || text.trim().length < 10 ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Analysing...' : 'Check this claim →'}
      </button>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '2rem 1rem',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '0.75rem',
    background: 'linear-gradient(135deg, #e8e8e8, #888)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  sub: {
    color: '#888',
    fontSize: '1rem',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  inputBox: {
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '1rem',
    textAlign: 'left',
  },
  textarea: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#e8e8e8',
    fontSize: '1rem',
    padding: '1.25rem',
    resize: 'none',
    lineHeight: '1.6',
    fontFamily: 'inherit',
  },
  inputFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 1.25rem',
    borderTop: '1px solid #2a2a4a',
  },
  charCount: {
    fontSize: '0.8rem',
  },
  hint: {
    fontSize: '0.8rem',
    color: '#555',
  },
  button: {
    background: 'linear-gradient(135deg, #4F6EF7, #7B5CF0)',
    color: '#fff',
    border: 'none',
    padding: '0.85rem 2.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'opacity 0.2s',
    fontFamily: 'inherit',
  },
};

export default ClaimInput;