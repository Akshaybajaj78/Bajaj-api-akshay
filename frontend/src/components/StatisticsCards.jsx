import React from 'react';

const StatisticsCards = ({ summary, invalidEntries, duplicateEdges }) => {
  if (!summary) return null;

  return (
    <div className="stats-container">
      <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Summary</h3>
        <div className="stat-card">
          <span className="label">Total Trees</span>
          <span className="value">{summary.total_trees}</span>
        </div>
        <div className="stat-card" style={{ borderColor: 'var(--danger)' }}>
          <span className="label">Total Cycles</span>
          <span className="value">{summary.total_cycles}</span>
        </div>
        <div className="stat-card" style={{ borderColor: 'var(--success)' }}>
          <span className="label">Largest Tree Root</span>
          <span className="value">{summary.largest_tree_root || 'N/A'}</span>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '1rem', color: 'var(--warning)' }}>Data Issues</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <span className="label" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Invalid Entries ({invalidEntries?.length || 0})
          </span>
          <div className="badge-list">
            {invalidEntries?.map((item, idx) => (
              <span key={idx} className="badge invalid">{item === "" ? "(empty string)" : item}</span>
            ))}
            {(!invalidEntries || invalidEntries.length === 0) && <span style={{color: 'var(--text-muted)'}}>None</span>}
          </div>
        </div>

        <div>
          <span className="label" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Duplicate Edges ({duplicateEdges?.length || 0})
          </span>
          <div className="badge-list">
            {duplicateEdges?.map((item, idx) => (
              <span key={idx} className="badge duplicate">{item}</span>
            ))}
            {(!duplicateEdges || duplicateEdges.length === 0) && <span style={{color: 'var(--text-muted)'}}>None</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCards;
