"use client";
import HttpRequest from "@/my-components/Nodes/HttpRequest";
import ManualTrigger from "@/my-components/Nodes/ManualTriggerNode";
import AiNode from "@/my-components/Nodes/AiNode";
import { addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, Edge, MiniMap, Node, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState, createContext } from "react";
import NodeSettingsPanel from "./Panels/Settings";
import { NodeEditorContext } from "@/context/NodeEditorContext";
import { Workflows } from "@/app/generated/prisma/client";
import WorkspacesNavbar from "./misc/WorkspacesNavbar";
import NodesTable from "./misc/NodesTable";
import Provider from "./Nodes/ProviderNode";
import IfNode from "./Nodes/IfNode";

const nodeTypes =  {
	'httpRequest': HttpRequest,
	'manualTrigger': ManualTrigger,
	'aiNode': AiNode, 
	"ifNode": IfNode,
	'provider': Provider,
	}

export default function Flow({workflow, setWorkflow, setShowExecution}: {workflow: Workflows, setWorkflow: any, setShowExecution: any}) {
	const n: Node[] = workflow.nodes as unknown as Node[]
	const e: Edge[] = workflow.edges as unknown as Edge[]

	const [nodes, setNodes] = useState<Node[]>(n)
	const [edges, setEdges] = useState<Edge[]>(e)
	const [selectedNode, setSelectedNode] = useState<any |null>(null);

	const onNodesChange = useCallback((changes: any) => setNodes((currNodes) => applyNodeChanges(changes, currNodes)),[setNodes],)
	const onEdgesChange = useCallback((changes: any) => setEdges((currEdges) => applyEdgeChanges(changes, currEdges)), [setEdges],)
	const onConnect = useCallback((newEdge: any) => setEdges((currEdges) => addEdge(newEdge, currEdges)), [setEdges],)
	
	  return (
		  <div className="h-screen w-screen">
		  <NodeEditorContext.Provider value={{selectedNode, setSelectedNode, setNodes}}>
		  <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView
		  >
			<WorkspacesNavbar workflow={workflow} setWorkflow={setWorkflow} setShowExecution={setShowExecution}/>
		 	<NodesTable /> 
			<Controls />
		  <MiniMap />
		  <Background />
		  <NodeSettingsPanel />
		  </ReactFlow>
		  </NodeEditorContext.Provider>
		  </div>
		
	  );
}
