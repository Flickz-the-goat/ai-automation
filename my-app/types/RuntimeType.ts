import { handleAi } from "@/bullmq/handler/handleAi";
import { handleHttp } from "@/bullmq/handler/handleHttp";
import { Node } from "@xyflow/react";

export interface executionReturnType {
	status: "Success" | "Failed" | "Started",
	message: string,
	data: any,
	tool: string,
	nodeid: string,
	inputdata: executionReturnType[]
}

export type NodeHandler = (
	node: Node,
	input: executionReturnType[],
	
) => Promise<executionReturnType>

export const nodeHandlers: Record<string, NodeHandler> = {
	"httpRequest": handleHttp,
	"aiNode": handleAi,
}

