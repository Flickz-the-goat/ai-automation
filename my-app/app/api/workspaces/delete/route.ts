import prisma from "@/lib/prisma"

export async function POST(req: Request){
	const {workspaceId} = await req.json()

	const deletedWorkspace = await prisma.workspaces.delete({
		where: {
			id: workspaceId,
		}
	})

	return Response.json({deletedId: deletedWorkspace.id})
}
