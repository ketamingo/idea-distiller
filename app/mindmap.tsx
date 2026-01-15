"use client";

import React, { useCallback, useMemo } from 'react';
import { ReactFlow, Background, Controls, Node, Edge, useNodesState, useEdgesState, Position, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface IdeaNode {
    id: string;
    product: string;
    pivots: { label: string; description: string }[];
    parentId?: string;
    prompt: string;
}

const nodeDefaults = {
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: {
        background: '#1e293b',
        color: '#f8fafc',
        border: '1px solid #4f46e5',
        borderRadius: '16px',
        padding: '16px',
        fontSize: '14px',
        width: 200,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        fontFamily: 'inherit'
    }
};

export default function MindMap({
    history,
    onPivot
}: {
    history: IdeaNode[],
    onPivot: (prompt: string, parentId: string) => void
}) {

    const { nodes: layoutNodes, edges: layoutEdges } = useMemo(() => {
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        // Build tree structure
        history.forEach((idea, index) => {
            const level = history.filter(h => {
                // Count how many ancestors this node has
                let current = idea;
                let depth = 0;
                while (current.parentId) {
                    depth++;
                    current = history.find(h => h.id === current.parentId)!;
                    if (!current) break;
                }
                return depth;
            }).length;

            const yPosition = index * 150;
            const xPosition = level * 400;

            // Add idea node
            nodes.push({
                id: idea.id,
                position: { x: xPosition, y: yPosition },
                data: { label: idea.product.substring(0, 50) + (idea.product.length > 50 ? '...' : '') },
                type: index === 0 ? 'input' : 'default',
                style: {
                    ...nodeDefaults.style,
                    background: index === history.length - 1 ? '#4338ca' : '#1e293b',
                    borderColor: index === history.length - 1 ? '#818cf8' : '#334155',
                    borderWidth: index === history.length - 1 ? '2px' : '1px',
                    fontWeight: index === history.length - 1 ? 'bold' : 'normal',
                }
            });

            // Add edge from parent if exists
            if (idea.parentId) {
                edges.push({
                    id: `e-${idea.parentId}-${idea.id}`,
                    source: idea.parentId,
                    target: idea.id,
                    animated: index === history.length - 1,
                    style: {
                        stroke: index === history.length - 1 ? '#6366f1' : '#475569',
                        strokeWidth: index === history.length - 1 ? 2 : 1
                    },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: index === history.length - 1 ? '#6366f1' : '#475569'
                    },
                });
            }
        });

        // Add pivot nodes for the most recent idea
        const latestIdea = history[history.length - 1];
        if (latestIdea && latestIdea.pivots) {
            latestIdea.pivots.forEach((pivot, i) => {
                const pivotId = `pivot-${latestIdea.id}-${i}`;
                const latestNode = nodes.find(n => n.id === latestIdea.id);

                if (latestNode) {
                    nodes.push({
                        id: pivotId,
                        position: {
                            x: latestNode.position.x + 350,
                            y: latestNode.position.y + (i - latestIdea.pivots.length / 2) * 120
                        },
                        data: { label: pivot.label, desc: pivot.description, parentId: latestIdea.id },
                        style: {
                            ...nodeDefaults.style,
                            cursor: 'pointer',
                            background: '#0f172a',
                            borderColor: '#334155',
                            transition: 'all 0.2s ease-in-out',
                        },
                    });

                    edges.push({
                        id: `e-${latestIdea.id}-${pivotId}`,
                        source: latestIdea.id,
                        target: pivotId,
                        animated: true,
                        style: { stroke: '#6366f1', strokeWidth: 2 },
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
                    });
                }
            });
        }

        return { nodes, edges };
    }, [history]);

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutEdges);

    // Update nodes when history changes
    React.useEffect(() => {
        setNodes(layoutNodes);
        setEdges(layoutEdges);
    }, [layoutNodes, layoutEdges, setNodes, setEdges]);

    const onNodeClick = useCallback((event: any, node: Node) => {
        if (node.id.startsWith('pivot-')) {
            const pivotData = node.data as any;
            onPivot(`Better version: ${pivotData.label} - ${pivotData.desc}`, pivotData.parentId);
        }
    }, [onPivot]);

    return (
        <div style={{ width: '100%', height: '600px' }} className="border border-slate-800 rounded-xl overflow-hidden mt-8 bg-slate-900/50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                fitView
                proOptions={{ hideAttribution: true }}
                nodesDraggable={true}
                panOnScroll={false}
                zoomOnScroll={true}
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
