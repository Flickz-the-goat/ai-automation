import prisma from "@/lib/prisma"
import { warn } from "console"

export async function POST(req: Request){
	const {workspaceId} = await req.json()
	
	const workspace = await prisma.workspaces.findUnique({
		where: {
			id: Number(workspaceId),
		}
	})
	const workflow = await prisma.workflows.findFirst({
		where: {
			workspaceid: Number(workspaceId),
		}
	})
	return Response.json({workspace: workspace, workflow: workflow})
}
