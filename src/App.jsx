import './App.css'
import FirstPage from './FirstPage'
import { BrowserRouter,Route,Routes} from 'react-router-dom'
import BubbleSort from './Sorting-Algos/BubbleSort'

import Menu from './Menu'
import SelectionSort from './Sorting-Algos/SelectionSort'
import MergeSort from './Sorting-Algos/MergeSort'
import InsertionSort from './Sorting-Algos/InsertionSort'
import HeapSort from './Sorting-Algos/HeapSort'
import QuickSort from './Sorting-Algos/QuickSort'
import DijkstraVisualizer from './Graph-Algos/DijkstraVisualizer'
import TopoSort from './Graph-Algos/TopoSort'
import BellmanFord from './Graph-Algos/BellmanFord'
import FloydWarshall from './Graph-Algos/FloydWarshall'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FirstPage />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/bubble-sort" element={<BubbleSort/>} />
          <Route path="/selection-sort" element={<SelectionSort/>} />
          <Route path="/insertion-sort" element={<InsertionSort/>} />
          <Route path="/heap-sort" element={<HeapSort/>} />
          <Route path="/merge-sort" element={<MergeSort/>} />
          <Route path="/quick-sort" element={<QuickSort/>} />
          <Route path="/dijkstra-visualizer" element={<DijkstraVisualizer/>} />
          <Route path="/TopoSort" element={<TopoSort/>} />
          <Route path="/Bellmanford" element={<BellmanFord/>} />
          <Route path="/Floydwarshall" element={<FloydWarshall/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
