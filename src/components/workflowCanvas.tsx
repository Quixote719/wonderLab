import React from 'react';
// ✅ 关键：全部用命名导出，没有 default
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMasStore } from '../store/useMasStore';
import { clsx } from 'clsx';
import type { WorkflowNode, WorkflowEdge } from '../types';

const CustomNode = ({ data, selected }: { data: WorkflowNode; selected: boolean }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-blue-500 bg-blue-50';
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  return (
    <div
      className={clsx(
        'px-4 py-2 rounded-lg border-2 shadow-sm min-w-[120px] text-center',
        getStatusColor(data.status),
        selected && 'ring-2 ring-blue-400'
      )}
    >
      {data.type !== 'start' && (
        <Handle type="target" position={Position.Top} className="w-3 h-3" />
      )}
      <div className="font-medium text-sm">{data.label}</div>
      {data.status === 'active' && <div className="text-xs text-blue-600 mt-1">执行中...</div>}
      {data.status === 'completed' && <div className="text-xs text-green-600 mt-1">✓ 完成</div>}
      {data.type !== 'end' && (
        <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
      )}
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

export const WorkflowCanvas = () => {
  const { nodes, edges } = useMasStore();

  const reactFlowNodes: Node[] = nodes.map((n: WorkflowNode) => ({
    id: n.id,
    type: 'custom',
    position: {
      x: n.id === 'start' || n.id === 'end' ? 150 : 100,
      y: nodes.findIndex((node) => node.id === n.id) * 120 + 50,
    },
    data: { label: n.label, status: n.status, type: n.type },
    width: 120,
    height: 40,
  }));

  const reactFlowEdges: Edge[] = edges.map((e: WorkflowEdge) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    markerEnd: { type: MarkerType.ArrowClosed },
    animated: true,
  }));

  return (
    <div className="h-full w-full bg-gray-50">
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch ((node.data as WorkflowNode).status) {
              case 'active':
                return '#3b82f6';
              case 'completed':
                return '#22c55e';
              case 'error':
                return '#ef4444';
              default:
                return '#d1d5db';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
};
