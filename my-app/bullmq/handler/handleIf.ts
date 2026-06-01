import { IfNodeType } from "@/types/NodeTypes";
import { executionReturnType, NodeHandler } from "@/types/RuntimeType";
import { Boogaloo } from "next/font/google";
import { defaultHead } from "next/head";
export const handleIf: NodeHandler = async (node, input) => {
	const ifNode = node as IfNodeType
	const left = parseString(node.data.left as string)
	const operator = node.data.operator as string
	const right = parseString(node.data.right as string)

	const res = handleExp(left, operator, right)

	const o: executionReturnType = { tool: node.type!, status: "Success", message: "Endpoint data recieved", data: res, nodeid: node.id, inputdata: [] }


	return o

}
const handleExp = (left: any, operator: string, right: any): boolean => {

	switch (operator) {
		case "!=":
			return left != right
		case ">=":
			return left >= right
		case "<=":
			return left <= right
		case "<":
			return left < right
		case ">":
			return left > right
		default:
			return left == right
	}

}

const parseString = (exp: string) => {

	if (exp == "true") return true
	if (exp == "false") return false

	const num = Number(exp)
	if (!Number.isNaN(num)) return num

	return exp

}
