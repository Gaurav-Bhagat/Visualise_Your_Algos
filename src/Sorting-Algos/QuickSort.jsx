import React, { useState, useRef, useEffect } from 'react';
import './Visualiser.css';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const QuickSort = () => {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const isSortingRef = useRef(false);
  const isPausedRef = useRef(false);
  const cancelRef = useRef(false);

  const [passLog, setPassLog] = useState([]);
  const [showPassLog, setShowPassLog] = useState(false);

  const [pivotIndex, setPivotIndex] = useState(null);


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

  const quickSort = async () => {
    if (isSortingRef.current) return;

    cancelRef.current = false;
    isSortingRef.current = true;
    setIsSorting(true);

    setPassLog([]);
    let log = [];

    const arr = [...array];

    const partition = async (arr, low, high) => {
      const pivot = arr[high];
      setPivotIndex(high);
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (cancelRef.current) {
          setIsSorting(false);
          isSortingRef.current = false;
          return -1;
        }

        while (isPausedRef.current) {
          await sleep(100);
        }

        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          await sleep(500);
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      await sleep(200);
    
      setPivotIndex(null);
      log.push(`Pivot ${pivot} placed at position ${i + 1}`);
      setPassLog([...log]);
      return i + 1;
    };

    const quickSortRecursive = async (arr, low, high) => {
      if (low < high) {
        const pi = await partition(arr, low, high);
        if (pi === -1) return;

        await quickSortRecursive(arr, low, pi - 1);
        await quickSortRecursive(arr, pi + 1, high);
      }
    };

    await quickSortRecursive(arr, 0, arr.length - 1);

    setIsSorting(false);
    isSortingRef.current = false;
  };

  return (
    <div>
      <h2>Quick Sort Visualizer</h2>

      <div className="array-container">
        {array.map((val, idx) => (
            <div
            className={`bar ${idx === pivotIndex ? 'pivot' : ''}`}
            key={idx}
            style={{ height: `${val * 3}px` }}
            >
            <div className="bar-value">{val}</div>
            </div>
        ))}
        </div>

      <div className="buttons">
        <button onClick={generateArray} disabled={isSorting && !isPaused}>Generate New</button>
        <button onClick={quickSort} disabled={isSorting}>Start</button>
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

export default QuickSort;
