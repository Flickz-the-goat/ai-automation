import prisma from "@/lib/prisma"

export async function POST(req: Request){

	const {ownerId, name} = await req.json()
	
	const workspace = await prisma.workspaces.create({
		data: {
			ownerid: Number(ownerId),
			name: name,
		}
	})

	return Response.json({workspaceId: workspace.id});
}
