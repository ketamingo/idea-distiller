"use client";

import React, { useCallback } from 'react';
import { ReactFlow, Background, Controls, Node, Edge, useNodesState, useEdgesState, Position, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: {
        background: '#0f172a',
        color: '#fff',
        border: '1px solid #6366f1',
        borderRadius: '12px',
        padding: '10px',
        fontSize: '12px',
        width: 150,
    }
};

const initialEdges: Edge[] = [];

export default function MindMap({ data, onPivot }: { data: any, onPivot: (prompt: string) => void }) {
    // Center node
    const initialNodes: Node[] = [
        {
            id: 'root',
            position: { x: 0, y: 150 },
            data: { label: data.product },
            type: 'input',
            style: { ...nodeDefaults.style, background: '#4338ca', width: 180, fontSize: '14px', fontWeight: 'bold' }
        },
        ...data.pivots.map((pivot: any, i: number) => ({
            id: `p-${i}`,
            position: { x: 300, y: i * 100 },
            data: { label: pivot.label, desc: pivot.description },
            style: { ...nodeDefaults.style, cursor: 'pointer' },
        }))
    ];

    const pivotEdges: Edge[] = data.pivots.map((_: any, i: number) => ({
        id: `e-root-${i}`,
        source: 'root',
        target: `p-${i}`,
        animated: true,
        style: { stroke: '#6366f1' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
    }));

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(pivotEdges);

    const onNodeClick = useCallback((event: any, node: Node) => {
        if (node.id.startsWith('p-')) {
            // It's a pivot node
            const pivotData = node.data as any; // { label, desc }
            onPivot(`Refine this idea: ${data.product}. Pivot towards: ${pivotData.label} - ${pivotData.desc}`);
        }
    }, [data.product, onPivot]);

    return (
        <div style={{ width: '100%', height: '500px' }} className="border border-slate-800 rounded-xl overflow-hidden mt-8">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                fitView
                nodesDraggable={false}
            >
                <Background color="#1e293b" gap={16} />
                <Controls className="bg-slate-800 border-slate-700 text-white" />
            </ReactFlow>
        </div>
    );
}
