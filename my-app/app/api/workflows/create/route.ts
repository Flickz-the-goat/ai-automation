import { Prisma } from "@/app/generated/prisma/client"
import prisma from "@/lib/prisma"

export async function POST(req: Request){
	const {workspaceId, triggerType} = await req.json()
	
	const triggerNode = {
		id: "node_0",
		position: {x:-250, y:0},
		type: triggerType,
		data: {activated: false, workspaceId: workspaceId, status: "initial"},
		deletable: false,
	}

	const workflow = await prisma.workflows.create({
		data: {
			workspaceid: Number(workspaceId),
			ownerid: 1,
			triggertype: triggerType,
			nodes: [triggerNode],
			edges: [],
			active: true,
		}
	})

	return Response.json({workflow: workflow})


}
