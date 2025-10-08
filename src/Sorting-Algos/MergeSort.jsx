import React, { useState, useEffect, useRef } from 'react';
import './Visualiser.css';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MergeSort = () => {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [passes, setPasses] = useState([]);
  const [mergeLog, setMergeLog] = useState([]);
  const [showPasses, setShowPasses] = useState(false);

  const isSortingRef = useRef(false);
  const isPausedRef = useRef(false);
  const cancelRef = useRef(false);
  const mergeLogRef = useRef([]);

  useEffect(() => {
    generateArray();
  }, []);

  const generateArray = () => {
    cancelRef.current = true;
    isSortingRef.current = false;
    isPausedRef.current = false;
    setIsPaused(false);
    setIsSorting(false);
    setPasses([]);
    setShowPasses(false);
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

  const mergeSortHelper = async (arr, l, r, updateCallback) => {
    if (l >= r) return;

    const mid = Math.floor((l + r) / 2);
    await mergeSortHelper(arr, l, mid, updateCallback);
    await mergeSortHelper(arr, mid + 1, r, updateCallback);
    await merge(arr, l, mid, r, updateCallback);
  };

  const merge = async (arr, l, mid, r, updateCallback) => {
    const left = arr.slice(l, mid + 1);
    const right = arr.slice(mid + 1, r + 1);
    let i = 0, j = 0, k = l;

    const mergingInfo = `Merging [${left.join(', ')}] and [${right.join(', ')}]`;
    mergeLogRef.current.push(mergingInfo);
  
    while (i < left.length && j < right.length) {
      while (isPausedRef.current) await sleep(300);
      if (cancelRef.current) return;
  
      if (left[i] <= right[j]) {
        arr[k++] = left[i++]; 
      } else {
        arr[k++] = right[j++];
      }
      updateCallback([...arr]);                        // can you dirctly setArray also but this style makes is more general and reusable
      await sleep(300);
    }
  
    while (i < left.length) {
      while (isPausedRef.current) await sleep(300);
      arr[k++] = left[i++];
      updateCallback([...arr]);
      await sleep(300);
    }
  
    while (j < right.length) {
      while (isPausedRef.current) await sleep(300);
      arr[k++] = right[j++];
      updateCallback([...arr]);
      await sleep(300);
    }

    const mergedResult = `→ Result: [${arr.slice(l, r + 1).join(', ')}]`;
    mergeLogRef.current.push(mergedResult);

    setPasses(prev => [...prev, [...arr]]);
    
    setMergeLog([...mergeLogRef.current]);
  };
  

  const mergeSort = async () => {
    if (isSortingRef.current) return;
    setIsSorting(true);
    isSortingRef.current = true;
    cancelRef.current = false;
    setPasses([]);

    let arr = [...array];
    await mergeSortHelper(arr, 0, arr.length - 1, setArray);

    setIsSorting(false);
    isSortingRef.current = false;
  };

  return (
    <div>
      <h2 style={{ color: "aliceblue" }}>Merge Sort Visualizer</h2>
      <div className="array-container">
        {array.map((val, idx) => (
          <div className="bar" key={idx} style={{ height: `${val * 3}px` }}>
            <span className="bar-value">{val}</span>
          </div>
        ))}
      </div>

      <div className="buttons">
        <button onClick={generateArray} disabled={isSorting && !isPaused}>Generate New</button>
        <button onClick={mergeSort} disabled={isSorting}>Start</button>
        <button onClick={handlePause} disabled={!isSorting || isPaused}>Pause</button>
        <button onClick={handleResume} disabled={!isSorting || !isPaused}>Resume</button>
        <button onClick={() => setShowPasses(!showPasses)} disabled={passes.length === 0}>Show Passes</button>
      </div>

      {showPasses && (
        <div className="passes-container">
          <h3 style={{ color: 'lightgreen' }}>Merge Passes:</h3>
          {/* {passes.map((pass, index) => (
            <div key={index} className="pass-row">
              <span style={{ color: 'lightblue' }}>Pass {index + 1}:</span> {pass.join(', ')}
            </div>
          ))} */}
          {/* <div className="text-sm font-mono text-green-300 bg-black p-2 rounded"> */}
            {mergeLog.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          {/* </div> */}
        </div>
      )}
    </div>
  );
};

export default MergeSort;
