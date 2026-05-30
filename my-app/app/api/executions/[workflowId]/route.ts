import prisma from "@/lib/prisma";
import { use } from "react";

export async function GET(req: Request, { params }: { params: { workflowId: string } }) {
	const { workflowId } = await params;

	try {
		const executions = await prisma.executions.findMany({
			where: {
				workflowid: Number(workflowId),
			},
			include: {
				executionnodedata: true
			},
			orderBy:{
				id: "desc",
			}
		})

		return Response.json({ executions: executions })
	}
	catch (e) {
		return Response.json({ error: e })
	}
}
