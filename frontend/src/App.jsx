import React, { useState } from 'react';
import axios from 'axios';
import { Network, Send, Loader2, AlertCircle } from 'lucide-react';
import TreeViewer from './components/TreeViewer';
import StatisticsCards from './components/StatisticsCards';
import './index.css';

function App() {
  const [inputData, setInputData] = useState('[\n  "A->B", "A->C", "B->D", "C->E", "E->F",\n  "X->Y", "Y->Z", "Z->X",\n  "P->Q", "Q->R",\n  "G->H", "G->H", "G->I",\n  "hello", "1->2", "A->"\n]');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Try to parse as JSON first
      let parsedData;
      try {
        parsedData = JSON.parse(inputData);
      } catch (e) {
        // Fallback to line-by-line if not valid JSON
        parsedData = inputData.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => line.replace(/["',]/g, '').trim()); // Strip quotes and commas if user copy pasted poorly
      }

      const response = await axios.post(`/bfhl`, {
        data: Array.isArray(parsedData) ? parsedData : [parsedData]
      });

      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An error occurred while connecting to the API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1><Network size={36} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '10px' }}/> BFHL Graph Processor</h1>
        <p>Analyze hierarchical relationships, detect cycles, and build trees effortlessly.</p>
      </header>

      <main>
        <section className="input-section glass-panel">
          <h2 style={{ marginBottom: '1rem' }}>Enter Node Relationships</h2>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Provide an array of strings in the format `A-&gt;B` where A and B are single uppercase letters.
          </p>
          <textarea
            className="node-input"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder='e.g. ["A->B", "A->C"]'
          />
          <button 
            className="submit-btn" 
            onClick={handleSubmit} 
            disabled={loading || !inputData.trim()}
          >
            {loading ? <Loader2 className="spinner" size={20} /> : <Send size={20} />}
            {loading ? 'Processing...' : 'Analyze Data'}
          </button>
        </section>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '8px' }}/>
            <strong>API Call Failed:</strong> {error}
          </div>
        )}

        {result && (
          <div className="results-grid">
            <section className="tree-section">
              <TreeViewer hierarchies={result.hierarchies} />
            </section>
            
            <section className="stats-section">
              <div className="user-info">
                <div className="user-info-row">
                  <span className="label">User ID</span>
                  <span className="value" style={{color: 'var(--primary)'}}>{result.user_id}</span>
                </div>
                <div className="user-info-row">
                  <span className="label">Email</span>
                  <span className="value">{result.email_id}</span>
                </div>
                <div className="user-info-row">
                  <span className="label">Roll Number</span>
                  <span className="value">{result.college_roll_number}</span>
                </div>
              </div>
              
              <StatisticsCards 
                summary={result.summary} 
                invalidEntries={result.invalid_entries}
                duplicateEdges={result.duplicate_edges}
              />
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
