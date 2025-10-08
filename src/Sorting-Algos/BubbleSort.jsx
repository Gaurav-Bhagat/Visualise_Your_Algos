import React, { useState, useRef, useEffect } from 'react';
import './Visualiser.css';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const BubbleSort = () => {
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

    setTimeout(() => {                         //js function->setTimeout
      const newArr = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100) + 10);
      setArray(newArr);
    }, 10);
  };

  const handlePause = () => {
    setIsPaused(true);
    isPausedRef.current = true;
  };

  const handleResume = () => {
    setIsPaused(false);               //Updates React state and Causes re-render so the UI updates (for example, updating a play/pause button).
    isPausedRef.current = false;      //does not cuase a re-render, so it is used to track the pause state without affecting the UI. for a consitent value of the variable.
  };

  const bubbleSort = async () => {
    if (isSortingRef.current) return;

    cancelRef.current = false; 
    isSortingRef.current = true;
    setIsSorting(true);

    setPassLog([]);
    let arr = [...array];
    let log = [];

    for (let i = 0; i < arr.length - 1; i++) {
      let swaps = [];
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (cancelRef.current) {
          setIsSorting(false);
          isSortingRef.current = false;
          return;
        }

        while (isPausedRef.current) {
          await sleep(100);
        }

        if (arr[j] > arr[j + 1]) {
          swaps.push(`${arr[j]} ↔ ${arr[j + 1]}`);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(200);
        }
      }
      if (swaps.length > 0) {
        log.push(`Pass ${i + 1}: ${swaps.join(', ')}`);
      } else {
        log.push(`Pass ${i + 1}: No swaps`);
      }
      setPassLog([...log]);
    }

    setIsSorting(false);
    isSortingRef.current = false;
  };

  return (
    <div className='screen'>
      <h2>Bubble Sort Visualizer</h2>

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
        <button onClick={bubbleSort} disabled={isSorting}>Start</button>
        <button onClick={handlePause} disabled={!isSorting || isPaused}>Pause</button>
        <button onClick={handleResume} disabled={!isSorting || !isPaused}>Resume</button>
        <button onClick={() => setShowPassLog(!showPassLog)} disabled={passLog.length === 0}>
          {showPassLog ? 'Hide Passes' : 'Show Passes'}
        </button>
        {showPassLog && (                             //this is conditional rendering
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

export default BubbleSort;
