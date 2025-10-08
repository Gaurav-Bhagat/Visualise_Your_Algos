import React from 'react'
import './Menu.css'
import { Link } from 'react-router-dom'

const Menu = () => {
  return (
    <div className='menu'>
      <div className='sorting-algorithms'>
        <p>Sorting Algorithms</p>
        <ul className='items'>
          <li>
            <Link to="/bubble-sort">
                Bubble Sort
            </Link>
            </li>
            <li>
              <Link to="/selection-sort">
              Selection Sort
              </Link>
            </li>
            <li>
            <Link to="/insertion-sort">
              Insertion Sort
            </Link>
            </li>
            <li>
            <Link to="/merge-sort">
              Merge Sort
            </Link>
            </li>
            <li>
              <Link to="/quick-sort">
                Quick Sort
              </Link>
            </li>
            <li>
              <Link to="/heap-sort">
                Heap Sort
              </Link>
            </li>
        </ul>
      </div>
      <div className='graph-algorithms'>
        <p>Graph Algorithms</p>
        <ul className='items'>
          <li>
            <Link to="/dijkstra-visualizer">
              Dijkstra's Algorithm
            </Link>
          </li>
          <li>
            <Link to="/TopoSort">
              Topological Sort
            </Link>
          </li>

          <li>
            <Link to="/Bellmanford">
              Bellman Ford
            </Link>
          </li>

          <li>
            <Link to="/Floydwarshall">
              Floyd Warshall
            </Link>
          </li>

        </ul>

      </div>
    </div>
  )
}

export default Menu
