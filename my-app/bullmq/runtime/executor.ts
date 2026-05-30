import { Edge, Node } from '@xyflow/react';
import { handleHttp } from '../handler/handleHttp';
import prisma from '@/lib/prisma';
import { handleAi, refineOutput } from '../handler/handleAi';
import { HttpRequestNodeType, AiNodeType } from '@/types/NodeTypes';
import { executionReturnType } from '@/types/RuntimeType';

export async function execute(nodes: Node[], edges: Edge[], executionid: number): Promise<executionReturnType> {
	
	const 
	let data: executionReturnType = { status: "Completed", message: "init", data: null, tool: "base" }
	const nodesOutput: executionReturnType[] = [data]

	for(const node of nodes){
			const input = nodesOutput.pop()
			switch (node.type) {
				case "httpRequest":
					data = await handleHttp(node as HttpRequestNodeType)
					break
				case "aiNode":
					data = await handleAi(node as AiNodeType, input)
					break
				default:
					data = { status: "Completed", message: "Trigger Node IGNORE", data: null, tool: "Manual Trigger" }
					break
			}
			if(node.type !== "aiNode") nodesOutput.push(data)
			else nodesOutput.push(await refineOutput(data));console.log("Refined AI Output", nodesOutput[0])

			if (node.type != "manualTrigger") {
				try {
					const nodeData = await prisma.executionnodedata.create({
						data: {
							executionid: executionid,
							nodeid: node.id,
							nodetype: node.type || "Unknown Type",
							status: data.status,
							inputdata: JSON.stringify(input),
							outputdata: JSON.stringify(data.data),
							errormessage: data.message,
						}
					})
					if (nodeData.status == "Unsuccessfull") {
						return data
					}
				}
				catch (e) {
					data = { status: "Unsuccessfull", message: "ERROR ENCOUNTERED", data: e, tool: "ErrorCatcher" }
					return data
				}
			}
		}
	return { status: "Completed", message: "Workflow successfully finished", data: null, tool: "Executor" }

}
