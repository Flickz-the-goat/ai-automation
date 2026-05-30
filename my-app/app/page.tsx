"use client";
import { Button } from "@/components/ui/button";
import Navbar from "@/my-components/misc/Navbar";
import WorkspacesTable from "@/my-components/misc/WorkspacesTable";

export default function Home(){
	const  createWorkspace = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/workspaces/create`, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({ownerId: 1, name: "Untitled"}),
		})
		if(!res.ok)
			console.log(await res.json())
		
		const {workspaceId} = await res.json()

		window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}workspaces/${workspaceId}`
	}

	return (
		<div className="min-h-screen w-full from-background to-zinc-50/40 dark:to-zinc-950/20">
	<Navbar />
			<div className="mx-auto flex min-h-[90vh] w-full max-w-6xl flex-col items-center justify-center px-6 py-5">
				<div className="flex w-full flex-col items-center gap-10">
					<div className="flex flex-col items-center gap-3 text-center">
						<div className="inline-flex items-center rounded-full border border-zinc-200/80 bg-white/70 px-3 py-1 text-xs font-medium tracking-wide text-zinc-500 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
							AI Workflow Builder
						</div>

						<div className="space-y-2">
							<h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
								Your Workspaces
							</h1>

							<p className="max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400 sm:text-base">
								Create, organize, and manage automation workflows in a
								clean collaborative environment.
							</p>
						</div>
					</div>

					<Button
						onClick={() => createWorkspace()}
						className="h-12 rounded-md border border-zinc-200 bg-zinc-900 px-6 text-sm font-medium tracking-tight text-white shadow-sm transition-all duration-200 ease-out hover:shadow-md hover:brightness-120 cursor-pointer"
					>
						Create Workspace
					</Button>

						<WorkspacesTable ownerId={1} />
				</div>
			</div>
		</div>
	);	
}
