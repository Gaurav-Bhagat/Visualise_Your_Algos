import React, { useState } from 'react';
import './DijkstraVisualizer.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [directed, setDirected] = useState(true); // toggle directed/undirected

  const showMessage = (msg) => toast(msg);

  const addNode = (id) => {
    if (!id) return showMessage('Node ID cannot be empty');
    if (nodes.includes(id)) return showMessage(`Node "${id}" already exists`);

    const updatedNodes = [...nodes, id];
    setNodes(updatedNodes);

    const radius = 250;
    const centerX = 400, centerY = 400;
    const total = updatedNodes.length;
    const newPositions = {};
    updatedNodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / total;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      newPositions[node] = { x, y };
    });
    setPositions(newPositions);
    showMessage(`Node "${id}" added`);
  };

  const addEdge = (from, to, weight) => {
    if (!from || !to || !weight) return showMessage('All edge fields are required');
    if (!nodes.includes(from) || !nodes.includes(to)) return showMessage('Node not found');

    const newEdges = [...edges, { from, to, weight: parseInt(weight) }];
    if (!directed) newEdges.push({ from: to, to: from, weight: parseInt(weight) });
    setEdges(newEdges);
    showMessage(`Edge "${from} ${directed ? '→' : '↔'} ${to}" added with weight ${weight}`);
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
      if ((path[i] === from && path[i + 1] === to) || (!directed && path[i] === to && path[i + 1] === from))
        return true;
    }
    return false;
  };

  const generateRandomGraph = (numNodes = 5) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const newNodes = letters.slice(0, numNodes).split('');
    const newEdges = [];
    newNodes.forEach(from => {
      newNodes.forEach(to => {
        if (from !== to && Math.random() < 0.4) { // 40% chance of edge
          const weight = Math.floor(Math.random() * 10) + 1; // positive weight
          newEdges.push({ from, to, weight });
          if (!directed) newEdges.push({ from: to, to: from, weight });
        }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);

    const radius = 250;
    const centerX = 400, centerY = 400;
    const newPositions = {};
    newNodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / newNodes.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      newPositions[node] = { x, y };
    });
    setPositions(newPositions);
    showMessage('Random graph generated');
  };

  const handleClearGraph = () => {
    setNodes([]);
    setEdges([]);
    setPositions({});
    setStart('');
    setEnd('');
    setDistances({});
    setPrevMap({});
    setVisited([]);
    setPath([]);
    showMessage('Graph cleared');
  };

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar newestOnTop />

      <div className="graph-container">
        <div className="input-panel">
          <h3>Graph Type</h3>
          <button onClick={() => setDirected(true)} disabled={directed}>Directed</button>
          <button onClick={() => setDirected(false)} disabled={!directed}>Undirected</button>

          <h3>Add Node</h3>
          <input id="node-id" placeholder="Node ID" />
          <button onClick={() => addNode(document.getElementById('node-id').value)}>Add Node</button>

          <h3>Add Edge</h3>
          <input id="edge-from" placeholder="From" />
          <input id="edge-to" placeholder="To" />
          <input id="edge-weight" placeholder="Weight" type="number" min={1} />
          <button onClick={() =>
            addEdge(
              document.getElementById('edge-from').value,
              document.getElementById('edge-to').value,
              document.getElementById('edge-weight').value
            )
          }>Add Edge</button>

          <h3>Random Graph</h3>
          <button onClick={() => generateRandomGraph()} disabled={!directed}>Random Directed Graph</button>
          <button onClick={() => generateRandomGraph()} disabled={directed}>Random Undirected Graph</button>

          <h3>Set Start/End</h3>
          <input placeholder="Start" value={start} onChange={e => setStart(e.target.value)} />
          <input placeholder="End" value={end} onChange={e => setEnd(e.target.value)} />
          <button onClick={runDijkstra}>Run Dijkstra</button>

          <button onClick={handleClearGraph} className="bg-red-500 text-white px-4 py-2 rounded">
            Clear Graph
          </button>
        </div>

        <div className="canvas-panel">
          <svg width="800" height="800">
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
                  <circle cx={x} cy={y} r={25} fill={visited.includes(id) ? '#4caf50' : '#2196f3'} stroke="#000" />
                  <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="18px" fontWeight="bold">{id}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="result-panel">
          <h3 style={{ color: 'aliceblue' }}>Visited Nodes</h3>
          <p>{visited.join(', ')}</p>
          <h3 style={{ color: 'aliceblue' }}>Distances</h3>
          <ul>
            {Object.entries(distances).map(([k, v]) => (
              <li key={k}>{k}: {v === Infinity ? '∞' : v}</li>
            ))}
          </ul>
          <h3 style={{ color: 'aliceblue' }}>Shortest Path</h3>
          <p>{path.join(' → ')}</p>
        </div>
      </div>
    </>
  );
};

export default DijkstraVisualizer;
