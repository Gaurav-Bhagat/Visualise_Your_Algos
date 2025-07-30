import React, { useState, useRef, useEffect } from 'react';
import './Visualiser.css';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const InsertionSort = () => {
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

  const insertionSort = async () => {
    if (isSortingRef.current) return;

    cancelRef.current = false;
    isSortingRef.current = true;
    setIsSorting(true);

    setPassLog([]);
    let arr = [...array];
    let log = [];

    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      let moves = [];

      while (j >= 0 && arr[j] > key) {
        if (cancelRef.current) {
          setIsSorting(false);
          isSortingRef.current = false;
          return;
        }

        while (isPausedRef.current) {
          await sleep(100);
        }

        arr[j + 1] = arr[j];
        moves.push(`${arr[j]} → index ${j + 1}`);
        j--;
        setArray([...arr]);
        await sleep(200);
      }
      arr[j + 1] = key;
      moves.push(`${key} → index ${j + 1}`);
      setArray([...arr]);
      await sleep(200);
      log.push(`Pass ${i}: ${moves.join(', ')}`);
      setPassLog([...log]);
    }

    setIsSorting(false);
    isSortingRef.current = false;
  };

  return (
    <div>
      <h2>Insertion Sort Visualizer</h2>

      <div className="array-container">
        {array.map((val, idx) => (
          <div className="bar" key={idx} style={{ height: `${val * 3}px` }}>
            <div className="bar-value">{val}</div>
          </div>
        ))}
      </div>

      <div className="buttons">
        <button onClick={generateArray} disabled={isSorting && !isPaused}>Generate New</button>
        <button onClick={insertionSort} disabled={isSorting}>Start</button>
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

export default InsertionSort;


