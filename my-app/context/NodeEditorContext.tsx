"use client";

import { createContext, useContext } from "react";

type SelectedNode = {
	id: string;
	type: string;
	data: any;
} | null;

type NodeEditorContextType = {
	selectedNode: SelectedNode;
	setSelectedNode: (node: SelectedNode) => void;
	setNodes: any;
};

export const NodeEditorContext = createContext<NodeEditorContextType | null>(null);

export const useNodeEditor = () => {
	const context = useContext(NodeEditorContext);
	if (!context) {
		throw new Error("useNodeEditor must be used inside NodeEditorProvider");
	}
	return context;
};
