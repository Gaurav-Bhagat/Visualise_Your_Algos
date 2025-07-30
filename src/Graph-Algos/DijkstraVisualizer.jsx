import React, { useState } from 'react';
import './DijkstraVisualizer.css';
import { ToastContainer, toast } from 'react-toastify';

const DijkstraVisualizer = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [positions, setPositions] = useState({});
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [distances, setDistances] = useState({});
  const [prevMap, setPrevMap] = useState({});
  const [visited, setVisited] = useState([]);
  const [path, setPath] = useState([]);
  const [message, setMessage] = useState('');

  const showMessage = (msg) => {
    toast(msg);
  };

  const addNode = (id) => {
    if (!id) return showMessage('Node ID cannot be empty');
    if (!nodes.includes(id)) {
      const angle = (nodes.length / 8) * 2 * Math.PI;
      const x = 300 + 200 * Math.cos(angle);
      const y = 300 + 200 * Math.sin(angle);
      setPositions(prev => ({ ...prev, [id]: { x, y } }));
      setNodes([...nodes, id]);
      showMessage(`Node "${id}" added`);
    } else {
      showMessage(`Node "${id}" already exists`);
    }
  };

  const addEdge = (from, to, weight) => {
    if (!from || !to || !weight) return showMessage('All edge fields are required');
    setEdges([...edges, { from, to, weight: parseInt(weight) }, { from: to, to: from, weight: parseInt(weight) }]);
    showMessage(`Edge "${from} ↔ ${to}" added with weight ${weight}`);
  };

  const tracePath = (target, prev) => {
    const path = [];
    let at = target;
    while (at !== null) {
      path.unshift(at);
      at = prev[at];
    }
    return path;
  };

  const runDijkstra = () => {
    if (!start || !end) return showMessage('Please set both start and end nodes');
    if (!nodes.includes(start) || !nodes.includes(end)) return showMessage('Start or end node does not exist');

    const dist = {}, visitedMap = {}, prev = {};
    nodes.forEach(n => {
      dist[n] = Infinity;
      visitedMap[n] = false;
      prev[n] = null;
    });
    dist[start] = 0;
    const queue = [{ id: start, dist: 0 }];

    const step = () => {
      if (!queue.length) {
        setDistances(dist);
        setPrevMap(prev);
        setVisited(Object.keys(visitedMap).filter(k => visitedMap[k]));
        setPath(tracePath(end, prev));
        showMessage('Dijkstra complete!');
        return;
      }

      queue.sort((a, b) => a.dist - b.dist);
      const { id: current } = queue.shift();
      if (visitedMap[current]) {
        setTimeout(step, 500);
        return;
      }
      visitedMap[current] = true;

      const neighbors = edges.filter(e => e.from === current);
      for (let edge of neighbors) {
        const alt = dist[current] + edge.weight;
        if (alt < dist[edge.to]) {
          dist[edge.to] = alt;
          prev[edge.to] = current;
          queue.push({ id: edge.to, dist: alt });
        }
      }

      setDistances({ ...dist });
      setPrevMap({ ...prev });
      setVisited(Object.keys(visitedMap).filter(k => visitedMap[k]));
      setPath(tracePath(end, prev));

      setTimeout(step, 1000);
    };

    step();
  };

  const isEdgeInPath = (from, to) => {
    for (let i = 0; i < path.length - 1; i++) {
      if ((path[i] === from && path[i + 1] === to) || (path[i] === to && path[i + 1] === from)) return true;
    }
    return false;
  };

  return (
    <div className="graph-container">
      <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="input-panel">
        <h3>Add Node</h3>
        <input id="node-id" placeholder="Node ID" />
        <button onClick={() => addNode(document.getElementById('node-id').value)}>Add Node</button>

        <h3>Add Edge</h3>
        <input id="edge-from" placeholder="From" />
        <input id="edge-to" placeholder="To" />
        <input id="edge-weight" placeholder="Weight" type="number" />
        <button onClick={() => addEdge(
          document.getElementById('edge-from').value,
          document.getElementById('edge-to').value,
          document.getElementById('edge-weight').value
        )}>Add Edge</button>

        <h3>Set Start/End</h3>
        <input placeholder="Start" value={start} onChange={e => setStart(e.target.value)} />
        <input placeholder="End" value={end} onChange={e => setEnd(e.target.value)} />
        <button onClick={runDijkstra}>Run Dijkstra</button>

        {message && <div className="message-box">{message}</div>}
      </div>

      <div className="canvas-panel">
        <svg width="600" height="600">
          {edges.map((edge, idx) => {
            const from = positions[edge.from];
            const to = positions[edge.to];
            if (!from || !to) return null;
            return (
              <g key={idx}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isEdgeInPath(edge.from, edge.to) ? 'red' : '#aaa'}
                  strokeWidth={isEdgeInPath(edge.from, edge.to) ? 4 : 2}
                />
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 5}
                  fill="black"
                  fontSize="14px"
                >{edge.weight}</text>
              </g>
            );
          })}

          {nodes.map((id) => {
            const { x, y } = positions[id];
            return (
              <g key={id}>
                <circle
                  cx={x}
                  cy={y}
                  r={25}
                  fill={visited.includes(id) ? '#4caf50' : '#2196f3'}
                  stroke="#000"
                />
                <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="18px" fontWeight="bold">
                  {id}
                </text>
                {distances[id] !== undefined && (
                  <text
                    x={x}
                    y={y + 35}
                    textAnchor="middle"
                    fill="black"
                    fontSize="12px"
                  >{`Dist: ${distances[id] === Infinity ? '∞' : distances[id]}`}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="result-panel">
        <h3>Visited Nodes</h3>
        <p>{visited.join(', ')}</p>
        <h3>Distances</h3>
        <ul>
          {Object.entries(distances).map(([k, v]) => (
            <li key={k}>{k}: {v === Infinity ? '∞' : v}</li>
          ))}
        </ul>
        <h3>Shortest Path</h3>
        <p>{path.join(' → ')}</p>
      </div>

      <button className="clear-button" onClick={() => {
        setNodes([]);
        setEdges([]);
        setPositions({});
        setDistances({});
        setVisited([]);
        setPrevMap({});
        setPath([]);
        setStart('');
        setEnd('');
        // setMessage('Graph cleared');
      }}>
        Clear Graph
      </button>
    </div>
  );
};

export default DijkstraVisualizer;