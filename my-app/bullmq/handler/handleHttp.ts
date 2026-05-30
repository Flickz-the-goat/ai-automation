import { HttpRequestNodeType } from "@/types/NodeTypes";
import { executionReturnType, NodeHandler } from "@/types/RuntimeType";

export const handleHttp: NodeHandler = async (node, input) => {
	const httpNode = node as HttpRequestNodeType
	const method = httpNode.data.method

	switch (method) {
		case "POST":
			break
		case "PUT":
			break
		case "DELETE":
			break
		default:
			return await get(httpNode)
	}
	const o: executionReturnType = { status: "Failed", message: "ERROR WITH RESPONSE: CHECK URL!", data: { message: "Response error, check url" }, tool: node.type!, nodeid: node.id, inputdata: [] }

	return o
}

const get = async (node: HttpRequestNodeType): Promise<executionReturnType> => {
	try {
		const res = await fetch(node.data.endpoint)
		if (!res.ok)
			return { status: "Failed", message: "ERROR WITH RESPONSE: CHECK URL!", data: { status: res.status, error: await res.json() }, tool: node.type, nodeid: node.id, inputdata: [] }

		return { tool: node.type, status: "Success", message: "Endpoint data recieved", data: await res.json(), nodeid: node.id, inputdata: [] }
	}

	catch (e) {
		const errorMessage  = e instanceof Error ? e.message : String(e)
		return { tool: node.type, status: "Failed", message: "ERROR CAUGHT", data: {error: errorMessage}, nodeid: node.id, inputdata: [] }
	}
}
