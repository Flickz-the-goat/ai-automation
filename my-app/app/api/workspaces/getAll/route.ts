import prisma from "@/lib/prisma";

export async function GET(req: Request){
	const workspaces = await prisma.workspaces.findMany()
	return Response.json({workspaces: workspaces})
}
