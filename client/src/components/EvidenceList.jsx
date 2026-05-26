const EvidenceList = ({ sources, newsContext }) => {
  if (!sources?.length && !newsContext?.length) return null;

  const openLink = (url) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={styles.wrapper}>

      {sources?.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.heading}>
            📋 Fact-check sources ({sources.length})
          </h3>
          {sources.map((source, i) => {
            return (
              <div
                key={i}
                style={styles.card}
                onClick={() => openLink(source.url)}
              >
                <div style={styles.cardLeft}>
                  <span style={styles.publisher}>{source.publisher}</span>
                  <span style={styles.rating}>
                    Verdict: {source.rating}
                  </span>
                  {source.text && (
                    <span style={styles.claimText}>
                      "{source.text.substring(0, 80)}
                      {source.text.length > 80 ? '...' : ''}"
                    </span>
                  )}
                </div>
                {source.url && <span style={styles.arrow}>↗</span>}
              </div>
            );
          })}
        </div>
      )}

      {newsContext?.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.heading}>
            📰 Related news ({newsContext.length})
          </h3>
          {newsContext.map((article, i) => {
            return (
              <div
                key={i}
                style={styles.card}
                onClick={() => openLink(article.url)}
              >
                <div style={styles.cardLeft}>
                  <span style={styles.publisher}>{article.source}</span>
                  <span style={styles.rating}>{article.title}</span>
                </div>
                {article.url && <span style={styles.arrow}>↗</span>}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: '680px',
    margin: '0 auto 3rem',
    padding: '0 1rem',
  },
  section: {
    marginBottom: '1.5rem',
  },
  heading: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.75rem',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#1a1a2e',
    border: '1px solid #2a2a4a',
    borderRadius: '8px',
    padding: '0.85rem 1rem',
    marginBottom: '0.5rem',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  cardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1,
    paddingRight: '0.5rem',
  },
  publisher: {
    fontSize: '0.75rem',
    color: '#555',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  rating: {
    fontSize: '0.9rem',
    color: '#ccc',
    lineHeight: '1.4',
  },
  claimText: {
    fontSize: '0.8rem',
    color: '#666',
    fontStyle: 'italic',
  },
  arrow: {
    color: '#555',
    fontSize: '1rem',
    flexShrink: 0,
  },
};

export default EvidenceList;