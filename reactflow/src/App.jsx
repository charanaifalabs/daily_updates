import React, { useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import "./App.css";

// Initial nodes
const initialNodes = [
  { id: "1", data: { label: "choose" }, position: { x: 0, y: 0 } },
  { id: "2", data: { label: "your" }, position: { x: 100, y: 100 } },
  { id: "3", data: { label: "desired" }, position: { x: 0, y: 200 } },
  { id: "4", data: { label: "edge" }, position: { x: 100, y: 300 } },
  { id: "5", data: { label: "type" }, position: { x: 0, y: 400 } },
];

// Initial edges
const initialEdges = [
  {
    id: "1",
    source: "1",
    target: "2",
    type: "straight",
    label: "straight",
    animated: true,
    style: { stroke: "blue", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.Arrow,
      color: "blue",
    },
  },
  {
    id: "2",
    source: "2",
    target: "3",
    type: "step",
    label: "step",
    animated: true,
    style: { stroke: "blue", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.Arrow,
      color: "blue",
    },
  },
  {
    id: "3",
    source: "3",
    target: "4",
    type: "smoothstep",
    label: "smoothstep",
    animated: true,
    style: { stroke: "blue", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.Arrow,
      color: "blue",
    },
  },
  {
    id: "4",
    source: "4",
    target: "5",
    type: "bezier",
    label: "bezier",
    animated: true,
    style: { stroke: "blue", strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.Arrow,
      color: "blue",
    },
  },
];

function App() {
  const [variant, setVariant] = useState("dots"); // background variant
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* Buttons to switch background */}
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}>
        <button onClick={() => setVariant("dots")}>Dots</button>
        <button onClick={() => setVariant("line")}>Line</button>
        <button onClick={() => setVariant("cross")}>Cross</button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background variant={variant} gap={16} size={1} color="red" />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
