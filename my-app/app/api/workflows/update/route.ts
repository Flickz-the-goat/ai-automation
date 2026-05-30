import prisma from "@/lib/prisma"

export async function POST(req: Request) {
	const data = await req.json()

	try {
		const updatedWorkflow = await prisma.workflows.update({
			where: {
				id: data.id,
			},
			data: {
				...data
			}
		})
		const space = await prisma.workspaces.update({
			where:{
				id: data.workspaceid,
			},
			data: {
				name: data.name,
			}
		})
		console.log(space)

		return Response.json({ updatedWorkflow: updatedWorkflow })
	}
	catch (e) {
		console.log("Error", e)
		return Response.json({ error: e })
	}

}
