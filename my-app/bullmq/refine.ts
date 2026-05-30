import {  type Edge, type Node } from '@xyflow/react';

export const refine = (nodes: Node[], edges: Edge[]): {updatedNodes: Node[], updatedEdges: Edge[]} => {
	const removeThese = nodes.filter((node) => node.type === "provider")
	const removeIds = removeThese.map((node)=> {
		return node.id
	})

	const updatedEdges = edges.filter((edge) => !removeIds.includes(edge.target))

	const updatedNodes = nodes.filter((node) => node.type !== "provider")

	return {updatedNodes: updatedNodes , updatedEdges: updatedEdges}
}
