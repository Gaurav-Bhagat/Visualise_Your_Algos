import React, { useState } from 'react';
import './BellmanFord.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BellmanFord = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [positions, setPositions] = useState({});
  const [distances, setDistances] = useState({});
  const [prevMap, setPrevMap] = useState({});
  const [start, setStart] = useState('');
  const [visitedEdges, setVisitedEdges] = useState([]);

  const [totalNodes,setTotalNodes] = useState(0);

  const showMessage = (msg) => toast(msg);


  const generateRandomGraph = () => {
  const numNodes = Math.floor(Math.random() * 5) + 4; // 4–8 nodes
  const newNodes = [];
  for (let i = 0; i < numNodes; i++) newNodes.push(String.fromCharCode(65 + i)); // A, B, C, D...

  const newEdges = [];
  for (let i = 0; i < numNodes; i++) {
    for (let j = 0; j < numNodes; j++) {
      if (i !== j && Math.random() < 0.4) { // 40% chance of edge
        let weight = Math.floor(Math.random() * 15) - 5; // weights between -5 and +9
        newEdges.push({ from: newNodes[i], to: newNodes[j], weight });
      }
    }
  }

  // Ensure at least one negative edge
  const hasNegative = newEdges.some(e => e.weight < 0);
  if (!hasNegative && newEdges.length > 0) {
    newEdges[Math.floor(Math.random() * newEdges.length)].weight = -Math.floor(Math.random() * 5 + 1);
  }

  // Center nodes in a circle visually
  const newPositions = {};
  newNodes.forEach((id, idx) => {
    const angle = (idx / newNodes.length) * 2 * Math.PI;
    newPositions[id] = {
      x: 400 + 250 * Math.cos(angle),
      y: 400 + 250 * Math.sin(angle),
    };
  });

  setNodes(newNodes);
  setEdges(newEdges);
  setPositions(newPositions);
  setStart(newNodes[0]);
  setDistances({});
  setPrevMap({});
  setVisitedEdges([]);
  showMessage('Random graph generated!');
};


  const addNode = (id) => {
    if (!id) return showMessage('Node ID cannot be empty');
    if (!nodes.includes(id)) {
      const angle = (nodes.length / totalNodes) * 2 * Math.PI;
      const x = 300 + 200 * Math.cos(angle);
      const y = 300 + 200 * Math.sin(angle);
      setPositions(prev => ({ ...prev, [id]: { x, y } }));
      setNodes(prev => [...prev, id]);
      showMessage(`Node "${id}" added`);
    } else {
      showMessage(`Node "${id}" already exists`);
    }
  };

  const addEdge = (from, to, weight) => {
    if (!from || !to || !weight) return showMessage('All edge fields are required');
    setEdges(prev => [...prev, { from, to, weight: parseInt(weight) }]);
    showMessage(`Edge "${from} → ${to}" added with weight ${weight}`);
  };

  const runBellmanFord = () => {
    if (!start || !nodes.includes(start)) return showMessage('Please set a valid start node');

    const dist = {};
    const prev = {};

    nodes.forEach(node => {
      dist[node] = Infinity;
      prev[node] = null;
    });
    dist[start] = 0;

    const step = (iteration = 0) => {
      if (iteration >= nodes.length - 1) {
        // Check for negative weight cycles
        let hasNegativeCycle = false;
        for (let edge of edges) {
          if (dist[edge.from] + edge.weight < dist[edge.to]) {
            hasNegativeCycle = true;
            break;
          }
        }
        if (hasNegativeCycle) {
          showMessage("Graph contains a negative weight cycle!");
        } else {
          showMessage("Bellman-Ford complete!");
        }
        setDistances({ ...dist });
        setPrevMap({ ...prev });
        return;
      }

      const updatedEdges = [];

      for (let edge of edges) {
        if (dist[edge.from] + edge.weight < dist[edge.to]) {
          dist[edge.to] = dist[edge.from] + edge.weight;
          prev[edge.to] = edge.from;
          updatedEdges.push(`${edge.from}→${edge.to}`);
        }
      }

      setVisitedEdges(updatedEdges);
      setDistances({ ...dist });
      setPrevMap({ ...prev });

      setTimeout(() => step(iteration + 1), 1000);
    };

    step();
  };

  const tracePath = (target) => {
    const path = [];
    let at = target;
    while (at) {
      path.unshift(at);
      at = prevMap[at];
    }
    return path;
  };

  const isEdgeVisited = (from, to) => visitedEdges.includes(`${from}→${to}`);

  return (
    <div className="graph-container">
      <div className="input-panel">

        <h3>Total nodes</h3>
        <input
          id="nums-node"
          placeholder="Numbers of nodes in graph"
          type="number"
          min="1"
          onChange={e => {
            const num = parseInt(e.target.value);
            if (isNaN(num) || num <= 0) {
              showMessage("Please enter a valid positive number");
              setTotalNodes(0);
            } else {
              setTotalNodes(num);
            }
          }}
        />


        <h3>Add Node</h3>
        <input id="node-id" placeholder="Node ID" />
        <button onClick={() => addNode(document.getElementById('node-id').value)} 
          disabled={totalNodes <= 0 || nodes.length >= totalNodes}>Add Node</button>

        <h3>Add Edge</h3>
        <input id="edge-from" placeholder="From" />
        <input id="edge-to" placeholder="To" />
        <input id="edge-weight" placeholder="Weight" type="number" />
        <button onClick={() => addEdge(
          document.getElementById('edge-from').value,
          document.getElementById('edge-to').value,
          document.getElementById('edge-weight').value
        )} disabled={totalNodes <= 0}>Add Edge</button>

        <h3>Start Node</h3>
        <input value={start} onChange={e => setStart(e.target.value)} placeholder="Start Node" />

        <button onClick={generateRandomGraph}>Generate Random Graph</button>

        <button onClick={runBellmanFord}>Run Bellman-Ford</button>

        <button className="clear-button" onClick={() => {
          setNodes([]);
          setEdges([]);
          setPositions({});
          setDistances({});
          setPrevMap({});
          setVisitedEdges([]);
          setStart('');
          showMessage('Graph cleared');
        }}>Clear Graph</button>

        <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar newestOnTop />
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
                  stroke={isEdgeVisited(edge.from, edge.to) ? "red" : "#aaa"}
                  strokeWidth={isEdgeVisited(edge.from, edge.to) ? 4 : 2}
                />
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 5}
                  fill="black"
                  fontSize="14px"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {nodes.map(id => {
            const { x, y } = positions[id];
            return (
              <g key={id}>
                <circle cx={x} cy={y} r={25} fill="#2196f3" stroke="#000" />
                <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="18px">{id}</text>
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
        <h3>Shortest Paths</h3>
        <ul>
          {nodes.map(n => (
            <li key={n}>{n}: {distances[n] === Infinity ? '∞' : distances[n]} (Path: {tracePath(n).join(' → ')})</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BellmanFord;
