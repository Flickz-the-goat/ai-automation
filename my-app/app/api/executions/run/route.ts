import { addJob } from "@/bullmq/queue"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
	const { workspaceId } = await req.json()

	try {
		const workflow = await prisma.workflows.findFirst({
			where: {
				workspaceid: workspaceId,
			}
		})

		if (!workflow) return Response.json({ data: "No workflow found" })
		const job = await addJob(workflow.id)
		return Response.json({ job: "Sent" })
	}
	catch (e) {
		return Response.json({ error: e })
	}
}
