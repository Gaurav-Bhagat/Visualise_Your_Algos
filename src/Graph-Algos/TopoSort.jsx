import React, { useState } from 'react';
import './TopoSort.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TopoSort = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [positions, setPositions] = useState({});
  const [inDegree, setInDegree] = useState({});
  const [order, setOrder] = useState([]);
  const [queue, setQueue] = useState([]);
  const [visited, setVisited] = useState([]);

  const [totalNodes,setTotalNodes] = useState(0);

  const showMessage = (msg) => toast(msg);

  const addNode = (id) => {
    if (!id) return showMessage('Node ID cannot be empty');
    if (!nodes.includes(id)) {
      const angle = (nodes.length / totalNodes) * 2 * Math.PI;
      const x = 400 + 250 * Math.cos(angle);
      const y = 400 + 250 * Math.sin(angle);
      setPositions(prev => ({ ...prev, [id]: { x, y } }));
      setNodes(prev => [...prev, id]);
      setInDegree(prev => ({ ...prev, [id]: 0 }));
      showMessage(`Node "${id}" added`);
    } else {
      showMessage(`Node "${id}" already exists`);
    }
  };

  const addEdge = (from, to) => {
    if (!from || !to) return showMessage('Edge fields required');
    if (!nodes.includes(from) || !nodes.includes(to)) return showMessage('Node not found');
    setEdges(prev => [...prev, { from, to }]);
    setInDegree(prev => ({ ...prev, [to]: prev[to] + 1 }));
    showMessage(`Edge "${from} → ${to}" added`);
  };

  const runTopoSort = () => {
    const deg = { ...inDegree };
    const q = [];
    const result = [];
    const marked = {};

    for (let node of nodes) {
      if (deg[node] === 0) q.push(node);
    }

    const step = () => {
      if (q.length === 0) {
        if (result.length < nodes.length) {
          showMessage('Graph contains a cycle!');
        } else {
          showMessage('Topological sort completed');
        }
        setOrder(result);
        return;
      }

      const curr = q.shift();
      result.push(curr);
      marked[curr] = true;
      setVisited(Object.keys(marked));
      setQueue([...q]);
      setOrder([...result]);

      for (let edge of edges) {
        if (edge.from === curr) {
          deg[edge.to]--;
          if (deg[edge.to] === 0) q.push(edge.to);
        }
      }

      setTimeout(step, 1000);
    };

    step();
  };

  const generateRandomGraph = () => {
    const numNodes = Math.floor(Math.random() * 5) + 6; // 6–10 nodes
    const newNodes = Array.from({ length: numNodes }, (_, i) => String.fromCharCode(65 + i)); 

    const newEdges = [];

    for (let i = 0; i < numNodes; i++) {
      const numEdges = Math.floor(Math.random() * 2) + 1; // 1–2 edges per node
      for (let j = 0; j < numEdges; j++) {
        const to = Math.floor(Math.random() * (numNodes - i - 1)) + i + 1; // ensure to > from
        if (!newEdges.some(e => e.from === newNodes[i] && e.to === newNodes[to])) {
          newEdges.push({ from: newNodes[i], to: newNodes[to] });
        }
      }
    }

    const centerX = 400, centerY = 400, radius = 250;
    const newPositions = {};
    newNodes.forEach((id, i) => {
      const angle = (i / numNodes) * 2 * Math.PI;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      newPositions[id] = { x, y };
    });

    const newInDegree = {};
    newNodes.forEach(id => newInDegree[id] = 0);
    newEdges.forEach(e => newInDegree[e.to]++);

    setNodes(newNodes);
    setEdges(newEdges);
    setPositions(newPositions);
    setInDegree(newInDegree);
    setVisited([]);
    setOrder([]);
    setQueue([]);
    showMessage('Random graph generated');
  };


  return (
    <div className="graph-container">
      {/* <h1>Topological Sort</h1> */}
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
          disabled={totalNodes <= 0 || nodes.length >= totalNodes}  >Add Node</button>

        <h3>Add Edge (Directed)</h3>
        <input id="edge-from" placeholder="From" />
        <input id="edge-to" placeholder="To" />
        <button onClick={() => addEdge(
          document.getElementById('edge-from').value,
          document.getElementById('edge-to').value,
        )}disabled={totalNodes <= 0}>Add Edge</button>

        <button className="clear-button" onClick={() => {
          setNodes([]);
          setEdges([]);
          setPositions({});
          setInDegree({});
          setOrder([]);
          setVisited([]);
          setQueue([]);
          showMessage('Graph cleared');
        }}>Clear Graph</button>

        <button onClick={generateRandomGraph}>Generate Random Graph</button>

        <button onClick={runTopoSort}>Run Topological Sort</button>

        <ToastContainer position="bottom-right" autoClose={2000} hideProgressBar newestOnTop />
      </div>

      <div className="canvas-panel">
        <svg width="800" height="800">
          {edges.map((edge, idx) => {
            const from = positions[edge.from];
            const to = positions[edge.to];
            if (!from || !to) return null;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / len;
            const uy = dy / len;

            return (
              <g key={idx}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x - ux * 20}
                  y2={to.y - uy * 20}
                  stroke="#aaa"
                  strokeWidth={2}
                  markerEnd="url(#arrow)"
                />
              </g>
            );
          })}

          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,10 L10,5 z" fill="#aaa" />
            </marker>
          </defs>

          {nodes.map(id => {
            const { x, y } = positions[id];
            return (
              <g key={id}>
                <circle cx={x} cy={y} r={25} fill={visited.includes(id) ? '#4caf50' : '#2196f3'} stroke="#000" />
                <text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="18px">{id}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="result-panel">
        <h3 style={{color:'aliceblue'}}>Topological Order</h3>
        <p>{order.join(' → ')}</p>
      </div>
    </div>
  );
};

export default TopoSort;
