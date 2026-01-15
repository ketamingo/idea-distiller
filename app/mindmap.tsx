"use client";

import React, { useCallback } from 'react';
import { ReactFlow, Background, Controls, Node, Edge, useNodesState, useEdgesState, Position, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// ... imports ...

const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: {
        background: '#1e293b', // Slate 800
        color: '#f8fafc', // Slate 50
        border: '1px solid #4f46e5', // Indigo 600
        borderRadius: '16px',
        padding: '16px',
        fontSize: '14px',
        width: 200,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        fontFamily: 'inherit'
    }
};

export default function MindMap({ data, onPivot }: { data: any, onPivot: (prompt: string) => void }) {
    // Center node
    const initialNodes: Node[] = [
        {
            id: 'root',
            position: { x: 0, y: 200 }, // Center vertically relative to 4 items
            data: { label: "Current Idea" }, // Simplified label
            type: 'input',
            style: {
                ...nodeDefaults.style,
                background: '#4338ca', // Indigo 700
                borderColor: '#818cf8', // Indigo 400
                borderWidth: '2px',
                width: 180,
                fontWeight: 'bold',
                textAlign: 'center'
            }
        },
        ...data.pivots.map((pivot: any, i: number) => ({
            id: `p-${i}`,
            position: { x: 350, y: i * 120 }, // Increased spacing
            data: { label: pivot.label, desc: pivot.description },
            style: {
                ...nodeDefaults.style,
                cursor: 'pointer',
                background: '#0f172a', // Slate 900
                borderColor: '#334155', // Slate 700
                transition: 'all 0.2s ease-in-out',
            },
            // We can add a custom class via className if we had CSS modules, but style is fine.
        }))
    ];

    const pivotEdges: Edge[] = data.pivots.map((_: any, i: number) => ({
        id: `e-root-${i}`,
        source: 'root',
        target: `p-${i}`,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
    }));

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(pivotEdges);

    const onNodeClick = useCallback((event: any, node: Node) => {
        if (node.id.startsWith('p-')) {
            const pivotData = node.data as any;
            onPivot(`Better version: ${pivotData.label} - ${pivotData.desc}`);
        }
    }, [onPivot]);

    return (
        <div style={{ width: '100%', height: '500px' }} className="border border-slate-800 rounded-xl overflow-hidden mt-8 bg-slate-900/50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                fitView
                // Remove attribution to clean up UI
                proOptions={{ hideAttribution: true }}
                nodesDraggable={false}
                // Snappy interaction
                panOnScroll={false}
                zoomOnScroll={false}
                panOnDrag={true}
                elementsSelectable={true}
            >
                <Background color="#334155" gap={20} size={1} />
                <Controls
                    className="!bg-slate-800 !border-slate-700 [&>button]:!fill-slate-200 [&>button:hover]:!bg-slate-700"
                    showInteractive={false}
                />
            </ReactFlow>
        </div>
    );
}
