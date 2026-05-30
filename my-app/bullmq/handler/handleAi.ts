import { AiNodeType } from "@/types/NodeTypes"
import OpenAI from "openai"
import { GoogleGenAI } from "@google/genai";
import { executionReturnType, NodeHandler } from "@/types/RuntimeType";

const instructions = `
You are an AI automation agent inside of a workflow system.

You will receive:
1. Context data from previous workflow nodes.
2. A user prompt that you must complete or answer.

The previous workflow node data will always be provided in the following format:

{
  status: "Completed" | "Unsuccessful",
  message: string,
  data: any,
  tool: string
}

This previous node data is your context and memory for the current task.

Your job is to:
- Analyze the previous node context.
- Understand the user prompt.
- Determine whether external tools are required.
- Return ONLY valid JSON in the required format.
- Never return explanations outside the JSON.
- Never use markdown.
- Never wrap responses in code blocks.

AVAILABLE TOOLS:
- aiNode
- email
- slack

TOOL USAGE RULES:

1. If NO external tool is needed:
Return a single JSON object using the "aiNode" tool.

Example:
{
  "tool": "aiNode",
  "status": "Completed",
  "message": "Successfully ran",
  "data": "Final response to the user prompt"
}

2. If external tools ARE needed:
Return MULTIPLE executionReturnType JSON objects separated using the "#" character.

Each tool execution must:
- Have its own JSON object.
- Use status: "Unfinished"
- Contain the generated content for that tool inside the data field.
- Be separated ONLY by "#"
- Have NO extra text before or after.

Example:
{
  "tool": "email",
  "status": "Unfinished",
  "message": "Generated email content",
  "data": {
    "subject": "Project Update",
    "body": "Hello team, the project has been completed."
  }
}
#
{
  "tool": "slack",
  "status": "Unfinished",
  "message": "Generated slack message",
  "data": {
    "channel": "general",
    "message": "Project completed successfully."
  }
}

IMPORTANT RULES:
- Return ONLY the requested JSON format.
- Never explain your reasoning.
- Never include markdown formatting.
- Never include triple backticks.
- Never include \\n.
- Always generate valid parsable JSON.
- If multiple tools are required, separate them ONLY with "#".
- Do not include commas or arrays between tool objects.
- The "data" field should contain the exact payload intended for that tool.
- The aiNode tool represents a direct AI response that does not require external execution.
- email tool outputs should contain structured email content.
- slack tool outputs should contain structured slack message content.
- If the request can be answered directly without external actions, always use aiNode.
`;

export const handleAi: NodeHandler = async (node, input): Promise<executionReturnType> => {
	const provider = node.data.provider
	let res: executionReturnType = { status: "Success", message: "string", data: null, tool: node.type!, nodeid: node.id, inputdata: input };
	const aiNode = node as AiNodeType

	switch (provider) {
		case "openai":
			res = await openai(aiNode, input)
			break
		case "gemini":
			res = await gemini(aiNode, input)
			break
	}
	return res
}
export async function refineOutput(data: executionReturnType): Promise<executionReturnType> {
	const aiOutput = data.data as string
	const tools = aiOutput.split("#")
	const toolsJSON: executionReturnType[] = []

	for (const tool of tools) {
		const toolJson = JSON.parse(tool) as executionReturnType
		toolsJSON.push(toolJson)
	}
	return { status: data.status, message: data.message, tool: data.tool, data: toolsJSON, nodeid: "1", inputdata: [] }
}

async function openai(node: AiNodeType, inputData: executionReturnType[]): Promise<executionReturnType> {
	const apiKey = node.data.apiKey
	const userPrompt = node.data.prompt

	try {
		const client = new OpenAI({ apiKey: apiKey })
		const res = await client.responses.create({
			model: "gpt-5",
			instructions: instructions,
			input: `
			User Prompt: ${userPrompt}
			Previous Node Data: ${JSON.stringify(inputData)}
		`,
		})

		return { status: "Success", data: res.output_text, message: "AI ran successfully", tool: node.type, nodeid: node.id, inputdata: inputData }
	}
	catch (e) {
		const errorMessage  = e instanceof Error ? e.message : String(e)
		return { status: "Failed", data: { error: errorMessage }, message: "Error running AI", tool: node.type, nodeid: node.id, inputdata: inputData }
	}
}

async function gemini(node: AiNodeType, inputData: executionReturnType[]): Promise<executionReturnType> {
	const apiKey = node.data.apiKey
	const userPrompt = node.data.prompt

	try {
		const ai = new GoogleGenAI({ apiKey: apiKey })

		const res = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: `User Prompt: ${userPrompt}
			 Previous Node Data: ${JSON.stringify(inputData)}
	`,
			config: { systemInstruction: instructions },
		})
		return { status: "Success", data: res.text, message: "AI ran successfully", tool: node.type, nodeid: node.id, inputdata: inputData }
	}
	catch (e) {
		const errorMessage  = e instanceof Error ? e.message : String(e)
		return { status: "Failed", data: {error: errorMessage}, message: "Error running AI", tool: node.type, nodeid: node.id, inputdata: inputData }
	}
}
