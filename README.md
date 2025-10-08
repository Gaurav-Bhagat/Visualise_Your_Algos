Algorithm Visualizer

A React-based interactive visualizer for sorting algorithms and graph algorithms. This project allows users to explore how algorithms work step by step through dynamic visualization.

Features
Sorting Algorithms

Bubble Sort

Heap Sort

Insertion Sort

Merge Sort

Quick Sort

Selection Sort

Features include:

Step-by-step visualization of sorting.

Dynamic array updates to illustrate comparisons and swaps.

Adjustable array size and speed (optional to implement).

Graph Algorithms

Dijkstra (Directed & Undirected)

Floyd–Warshall

Bellman–Ford

Topological Sort

Graph visualizer features:

Add nodes and edges dynamically.

Random graph generation with positive weights (for Dijkstra).

Step-by-step visualization of visited nodes, distances, and shortest paths.

Correct handling of directed vs undirected graphs.

For topological sort, visualize the ordering of nodes.

Bellman–Ford supports negative weights (except negative cycles).

Floyd–Warshall computes all-pairs shortest paths.

Usage
Sorting Algorithms

Select a sorting algorithm from the menu.

Input the array or use a random array.

Can see the passes for debug purpose.

Click Run to visualize the sorting step by step.

Graph Algorithms

Add nodes and edges dynamically or generate a random graph.

Toggle Directed or Undirected mode.

Set start and/or end nodes if required (for Dijkstra/Bellman-Ford).

Click Run to visualize the algorithm step by step.

View the final result: distances, shortest paths, or topological order.

Clear the graph to start fresh.

Notes

Dijkstra: No negative weights allowed.

Bellman–Ford: Supports negative weights but not negative cycles.

Floyd–Warshall: Computes all-pairs shortest paths.

Topological Sort: Works only on Directed Acyclic Graphs (DAG).

Sorting visualizations show comparisons and swaps dynamically.
