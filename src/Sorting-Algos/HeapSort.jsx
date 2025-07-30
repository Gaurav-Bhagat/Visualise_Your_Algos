import React, { useState, useRef, useEffect } from 'react';
import './Visualiser.css';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const HeapSort = () => {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isSortingRef = useRef(false);
  const isPausedRef = useRef(false);
  const cancelRef = useRef(false);

  const [passLog, setPassLog] = useState([]);
  const [showPassLog, setShowPassLog] = useState(false);

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    cancelRef.current = true;
    isSortingRef.current = false;
    isPausedRef.current = false;

    setIsSorting(false);
    setIsPaused(false);

    setTimeout(() => {
      const newArr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 10);
      setArray(newArr);
    }, 10);
  };

  const handlePause = () => {
    setIsPaused(true);
    isPausedRef.current = true;
  };

  const handleResume = () => {
    setIsPaused(false);
    isPausedRef.current = false;
  };

  const heapify = async (arr, n, i) => {
    let largest = i;
    let l = 2 * i + 1;
    let r = 2 * i + 2;

    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      await sleep(200);

      while (isPausedRef.current) await sleep(100);
      if (cancelRef.current) return;

      await heapify(arr, n, largest);
    }
  };

  const heapSort = async () => {
    if (isSortingRef.current) return;

    cancelRef.current = false;
    isSortingRef.current = true;
    setIsSorting(true);
    setPassLog([]);

    let arr = [...array];
    let log = [];

    let n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
      if (cancelRef.current) {
        setIsSorting(false);
        isSortingRef.current = false;
        return;
      }

      while (isPausedRef.current) await sleep(100);

      [arr[0], arr[i]] = [arr[i], arr[0]];
      setArray([...arr]);
      log.push(`Move ${arr[i]} to sorted position`);
      setPassLog([...log]);
      await sleep(300);

      await heapify(arr, i, 0);
    }

    setIsSorting(false);
    isSortingRef.current = false;
  };

  return (
    <div>
      <h2>Heap Sort Visualizer</h2>

      <div className="array-container">
        {array.map((val, idx) => (
          <div className="bar" key={idx} style={{ height: `${val * 3}px` }}>
            <div className="bar-value">{val}</div>
          </div>
        ))}
      </div>

      <div className="buttons">
        <button onClick={generateArray} disabled={isSorting && !isPaused}>Generate New</button>
        <button onClick={heapSort} disabled={isSorting}>Start</button>
        <button onClick={handlePause} disabled={!isSorting || isPaused}>Pause</button>
        <button onClick={handleResume} disabled={!isSorting || !isPaused}>Resume</button>
        <button onClick={() => setShowPassLog(!showPassLog)} disabled={passLog.length === 0}>
          {showPassLog ? 'Hide Passes' : 'Show Passes'}
        </button>
        {showPassLog && (
          <div className="pass-log-sidebar">
            <h3>Sorting Passes</h3>
            <div className="pass-log-content">
              {passLog.map((log, idx) => (
                <p key={idx}>{log}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeapSort;
