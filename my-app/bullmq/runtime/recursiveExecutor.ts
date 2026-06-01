import { executionReturnType, nodeHandlers } from '@/types/RuntimeType'
import { Edge, Node } from '@xyflow/react';
import { execute } from './executor';
import prisma from '@/lib/prisma';
import { Job } from 'bullmq';

const visited = new Map<string, boolean>()

export async function recuriseExecute(job: Job, nodes: Node[], edges: Edge[], executionid: number): Promise<executionReturnType> {
	// Create outgoing and incomming Map
	const outgoing = new Map<string, string[]>()
	const incoming = new Map<string, string[]>()
	const outputs = new Map<string, executionReturnType>()

	edges.forEach((e) => {
		const source = e.source
		const target = e.target

		if (!outgoing.has(source)) outgoing.set(source, [])

		outgoing.get(source)!.push(target)

		if (!incoming.has(target)) incoming.set(target, [])

		incoming.get(target)!.push(source)
	})

	// Build Node Map
	const nodeMap = new Map<string, Node>()
	nodes.forEach((n) => {
		nodeMap.set(n.id, n)
	})

	// Handle If Nodes
	for(const [id, node] of nodeMap){
		if(node.type! === "ifNode"){
			outgoing.delete(id)
			outgoing.set(id, [`true-${id}`, `false-${id}`])
			outgoing.set(`true-${id}`, [])
			outgoing.set(`false-${id}`, [])

			edges.map((e) => {
				e.source == id && e.sourceHandle! == "true" ? (
					outgoing.get(`true-${id}`)!.push(e.target)
				) : (
					outgoing.get(`false-${id}`)!.push(e.target)
				)
			})

		}
	}
	console.log(outgoing)

	const triggerOut = outgoing.get("node_0")!
	if (!triggerOut) {
		job.updateProgress({ nodeid: "node_0", status: "error" })
		return { status: "Failed", nodeid: nodes[0].id, message: "Build a graph before you execute it", inputdata: [], data: [], tool: "Error Check" }
	}
	await job.updateProgress({ nodeid: "node_0", status: "success" })
	const firstNode = nodeMap.get(triggerOut[0])
	const res = await executeNode(outputs, job, firstNode!, incoming, outgoing, nodeMap)

	for (const [nodeId, o] of outputs) {
		if (o) {
			const nodeData = await prisma.executionnodedata.create({
				data: {
					executionid: executionid,
					nodeid: o.nodeid,
					nodetype: o.tool,
					status: o.status,
					inputdata: JSON.stringify(o.inputdata),
					outputdata: JSON.stringify(o),
					errormessage: o.message,
				}
			})
		}
	}
	outputs.clear()
	return res
}

async function executeNode(outputs: Map<string, executionReturnType>, job: Job, node: Node, incoming: Map<string, string[]>, outgoing: Map<string, string[]>, nodeMap: Map<string, Node>): Promise<executionReturnType> {
	await job.updateProgress({ nodeid: node.id, status: "loading" })
	const handler = nodeHandlers[node.type!]
	const input: executionReturnType[] = [];
	incoming.get(node.id)!.forEach((n) => {
		input.push(outputs.get(n)!)
	})

	const res = await handler(node, input)
	outputs.set(node.id, res)
	if (res.status === "Failed") {
		await job.updateProgress({ nodeid: node.id, status: "error" })
		return res
	}
	if(node.type! == "ifNode"){
		res.data == true ? (
			outgoing.set(node.id, outgoing.get(`true-${node.id}`)!)
		) : (
			outgoing.set(node.id, outgoing.get(`false-${node.id}`)!)
		)
	}
	const children = outgoing.get(node.id)
	console.log("Bache", children)

	if (children) {
		for (const child in children) {
			const res = await executeNode(outputs, job, nodeMap.get(children[child])!, incoming, outgoing, nodeMap)
			if (res.status === "Failed") return res
		}
	}
	await job.updateProgress({ nodeid: node.id, status: "success" })
	return { status: "Success", message: `${node.id} node successfully finished running`, tool: node.type!, data: outputs.get(node.id), nodeid: node.id, inputdata: input }

}


