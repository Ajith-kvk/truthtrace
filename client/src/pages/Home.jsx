import ClaimInput from '../components/ClaimInput';
import VerdictCard from '../components/VerdictCard';
import EvidenceList from '../components/EvidenceList';
import useCheck from '../hooks/useCheck';

const Home = () => {
  const { result, loading, error, submitClaim } = useCheck();

  return (
    <div style={styles.page}>
      <ClaimInput onSubmit={submitClaim} loading={loading} />

      {/* Loading state */}
      {loading && (
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Analysing claim across fact-check databases...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={styles.errorBox}>
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <>
          <VerdictCard result={result} />
          <EvidenceList sources={result.sources} newsContext={result.newsContext} />
        </>
      )}
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    padding: '2rem 1rem',
  },
  loadingBox: {
    maxWidth: '680px',
    margin: '2rem auto',
    textAlign: 'center',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #2a2a4a',
    borderTop: '3px solid #4F6EF7',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 1rem',
  },
  loadingText: {
    color: '#666',
    fontSize: '0.95rem',
  },
  errorBox: {
    maxWidth: '680px',
    margin: '2rem auto',
    padding: '1rem 1.25rem',
    background: '#2a1515',
    border: '1px solid #E24B4A44',
    borderRadius: '10px',
    color: '#E24B4A',
    textAlign: 'center',
  },
};

export default Home;