import React from 'react';

const TreeNode = ({ nodeName, treeData }) => {
  const children = Object.keys(treeData);
  const hasChildren = children.length > 0;

  return (
    <div className="node-item">
      <div className={`node-label ${hasChildren ? 'node-has-children' : ''}`}>
        {nodeName}
      </div>
      {hasChildren && (
        <div className="node-children">
          {children.map(child => (
            <TreeNode key={child} nodeName={child} treeData={treeData[child]} />
          ))}
        </div>
      )}
    </div>
  );
};

const TreeViewer = ({ hierarchies }) => {
  if (!hierarchies || hierarchies.length === 0) {
    return <div className="glass-panel"><p>No hierarchies generated yet.</p></div>;
  }

  return (
    <div className="glass-panel">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Hierarchies & Trees</h2>
      {hierarchies.map((h, index) => (
        <div key={index} className="tree-container">
          <div className="tree-header">
            <span className="tree-title">Root: {h.root}</span>
            {h.has_cycle ? (
              <span className="tree-badge cycle">Cycle Detected</span>
            ) : (
              <span className="tree-badge">Depth: {h.depth}</span>
            )}
          </div>
          
          <div className="tree-visual">
            {!h.has_cycle && h.tree[h.root] ? (
              <TreeNode nodeName={h.root} treeData={h.tree[h.root]} />
            ) : (
              <div style={{ padding: '1rem', color: 'var(--danger)', fontStyle: 'italic' }}>
                Cyclic Group - Cannot render tree.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TreeViewer;
