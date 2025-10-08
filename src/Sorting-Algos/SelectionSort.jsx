import React, { useState, useRef, useEffect } from 'react';
import './Visualiser.css';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SelectionSort = () => {
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

  const selectionSort = async () => {
    if (isSortingRef.current) return;

    cancelRef.current = false; 
    isSortingRef.current = true;
    setIsSorting(true);

    setPassLog([]);
    let arr = [...array];
    let log = [];

    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        log.push(`Pass ${i + 1}: ${arr[i]} ↔ ${arr[minIndex]}`);
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      } else {
        log.push(`Pass ${i + 1}: No swap`);
      }
      setPassLog([...log]);
      setArray([...arr]);
      await sleep(400);
    }

    setIsSorting(false);
    isSortingRef.current = false;
  };

  return (
    <div>
      <h2 style={{color:'aliceblue'}}>Selection Sort Visualizer</h2>

      <div className="array-container">
        {array.map((val, idx) => (
          <div className="bar" key={idx} style={{ height: `${val * 3}px` }}>
            <div className="bar-value">
                {val}
            </div>
          </div>
        ))}
      </div>

      <div className="buttons">
        <button onClick={generateArray} disabled={isSorting && !isPaused}>Generate New</button>
        <button onClick={selectionSort} disabled={isSorting}>Start</button>
        <button onClick={handlePause} disabled={!isSorting || isPaused}>Pause</button>
        <button onClick={handleResume} disabled={!isSorting || !isPaused}>Resume</button>
        <button onClick={() => setShowPassLog(!showPassLog)}>
          {showPassLog ? 'Hide Passes' : 'Show Passes'}
        </button>
      </div>
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
    // </div>
  );
};

export default SelectionSort;
