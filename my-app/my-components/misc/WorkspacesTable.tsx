"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { BookSearch, Loader2, X } from "lucide-react";
import { Workspaces } from "@/app/generated/prisma/client";

export default function WorkspacesTable({
	ownerId,
}: {
	ownerId: number;
}) {
	const [workspaces, setWorkspaces] = useState<Workspaces[]>([]);
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		const getWorkspaces = async () => {
			setLoading(true)
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_BASE_URL}api/workspaces/getAll`
			);

			if (!res.ok) console.log(await res.json());

			const data = await res.json();

			setWorkspaces(data.workspaces);

			setLoading(false)
		};

		getWorkspaces();
	}, []);

	const deleteWorkspace = async (workspaceId: number) => {
		setLoading(true)
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/workspaces/delete`, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({workspaceId: workspaceId}),
		})

		if(!res.ok) console.log(await res.json())

		const {deletedId} = await res.json()
		setLoading(false)
		setWorkspaces((workspaces: Workspaces[]) => workspaces.filter((w: Workspaces) => w.id !== deletedId))

	}

	return (
		<div className="w-full">
			<div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
				<div className="space-y-1">
					<h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
						Workspaces
					</h2>

					<p className="text-sm text-zinc-500 dark:text-zinc-400">
						Manage and continue your workflow projects.
					</p>
				</div>

				<div className="rounded-full border border-zinc-200 bg-zinc-100/70 px-3 py-1 text-xs font-medium tracking-wide text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
					{workspaces.length} Total
				</div>
			</div>

			<div className="mt-6 flex w-full flex-col gap-3 overflow-y-scroll max-h-50">
			{
				loading && (
					<div className="mx-auto flex items-center flex-col gap-2 text-zinc-500">
						<Loader2 className="animate-spin stroke-zinc-700"/>
						<p className="text-sm flex items-center gap-2">
						<BookSearch className="inline w-4 h-4"/> Fetching Workspaces...
						</p>
					</div>
				)
			}
				{workspaces.length > 0 && !loading ? (
					workspaces.map((workspace) => (
						<div key={workspace.id} className="flex gap-2 px-2">
						<Link
							href={`${process.env.NEXT_PUBLIC_BASE_URL}workspaces/${workspace.id}`}
							className="group flex flex-1 items-center justify-between rounded-sm border border-zinc-200/80 bg-white py-3 px-5 text-sm font-medium tracking-tight text-zinc-700 transition-all duration-200 ease-out hover:border-zinc-300 cursor-pointer"
						>
							<div className="flex items-center gap-3">
								<div className="h-2 w-2 rounded-full bg-zinc-400 transition-colors duration-200 group-hover:bg-zinc-700 dark:bg-zinc-600 dark:group-hover:bg-zinc-300" />

								<span className="truncate">{workspace.name}</span>
							</div>

							<span className="text-xs font-medium text-zinc-400 transition-all duration-200 group-hover:text-green-600 dark:text-zinc-500 dark:group-hover:text-zinc-300">
								Open
							</span>
						</Link>
							<span className="flex items-center justify-center cursor-pointer transition-all duration-200 group-hover:text-green-600 dark:text-zinc-500 dark:group-hover:text-zinc-300" onClick={() => {deleteWorkspace(workspace.id)}}>
							<X className="stroke-red-500 hover:stroke-red-800"/>
							</span>
						</div>
	
					))
				) : (
				!loading &&
					<div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/60 px-6 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
						<div className="space-y-2">
							<h3 className="text-sm font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">
								No workspaces yet
							</h3>

							<p className="max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
								Create your first workspace to begin building automation
								workflows and AI agents.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
