import React, { useState } from 'react';
import './FloydWarshall.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FloydWarshall = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [dist, setDist] = useState({});
  const [updatedCell, setUpdatedCell] = useState(null);

  const showMessage = (msg) => toast(msg);

  // Initialize the adjacency matrix when nodes or edges change
  const initializeMatrix = (newNodes, newEdges) => {
    const temp = {};
    newNodes.forEach(i => {
      temp[i] = {};
      newNodes.forEach(j => {
        temp[i][j] = i === j ? 0 : Infinity;
      });
    });
    newEdges.forEach(e => {
      temp[e.from][e.to] = e.weight;
    });
    setDist(temp);
  };

  const addNode = (id) => {
    if (!id) return showMessage('Node ID cannot be empty');
    if (nodes.includes(id)) return showMessage(`Node "${id}" already exists`);

    const newNodes = [...nodes, id];
    setNodes(newNodes);
    initializeMatrix(newNodes, edges);
    showMessage(`Node "${id}" added`);
  };

  const addEdge = (from, to, weight) => {
    if (!from || !to || !weight) return showMessage('All fields are required');
    if (!nodes.includes(from) || !nodes.includes(to)) return showMessage('Node not found');

    const newEdges = [...edges, { from, to, weight: parseInt(weight) }];
    setEdges(newEdges);
    initializeMatrix(nodes, newEdges);
    showMessage(`Edge "${from} → ${to}" (${weight}) added`);
  };


  const runFloydWarshall = () => {
  if (nodes.length === 0) return showMessage('Add some nodes first');

  // Deep copy dist to a local matrix
  const D = {};
  nodes.forEach(i => {
    D[i] = {};
    nodes.forEach(j => {
      D[i][j] = dist[i][j];
    });
  });

  const nodeList = [...nodes];
  let k = 0, i = 0, j = 0;

  const step = () => {
    if (k === nodeList.length) {
      setDist(D);  // final result
      showMessage('Floyd–Warshall complete!');
      return;
    }

    const via = nodeList[k];
    const from = nodeList[i];
    const to = nodeList[j];

    // Only update if both paths are finite
    if (D[from][via] !== Infinity && D[via][to] !== Infinity) {
      const newDist = D[from][via] + D[via][to];
      if (newDist < D[from][to]) {
        D[from][to] = newDist;
        setUpdatedCell(`${from}-${to}`);
        setDist(JSON.parse(JSON.stringify(D))); // animate
      }
    }

    j++;
    if (j === nodeList.length) {
      j = 0;
      i++;
      if (i === nodeList.length) {
        i = 0;
        k++;
      }
    }

    setTimeout(step, 200);
  };

  step();
};

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setDist({});
    setUpdatedCell(null);
    showMessage('Graph cleared');
  };

  return (
    <div className="fw-container">
      <div className="fw-input-panel">
        <h3>Add Node</h3>
        <input id="node-id" placeholder="Node ID" />
        <button onClick={() => addNode(document.getElementById('node-id').value)}>Add Node</button>

        <h3>Add Edge (Directed with Weight)</h3>
        <input id="edge-from" placeholder="From" />
        <input id="edge-to" placeholder="To" />
        <input id="edge-weight" placeholder="Weight" type="number" />
        <button onClick={() => addEdge(
          document.getElementById('edge-from').value,
          document.getElementById('edge-to').value,
          document.getElementById('edge-weight').value
        )}>Add Edge</button>

        <button className="fw-clear-btn" onClick={clearGraph}>Clear Graph</button>
        <button className="fw-run-btn" onClick={runFloydWarshall}>Run Floyd–Warshall</button>

        <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar newestOnTop />
      </div>

      <div className="fw-matrix-panel">
        {Object.keys(dist).length > 0 && (
          <table className="fw-table">
            <thead>
              <tr>
                <th></th>
                {nodes.map(n => <th key={n}>{n}</th>)}
              </tr>
            </thead>
            <tbody>
              {nodes.map(i => (
                <tr key={i}>
                  <th>{i}</th>
                  {nodes.map(j => (
                    <td
                      key={j}
                      className={
                        updatedCell === `${i}-${j}` ? 'fw-updated' :
                        dist[i][j] === Infinity ? 'fw-infinite' : ''
                      }>
                      {dist[i][j] === Infinity ? '∞' : dist[i][j]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FloydWarshall;
