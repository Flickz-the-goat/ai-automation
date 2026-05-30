"use client";

import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useState } from "react"
import Link from "next/link";
import { Folder, Home, Save } from "lucide-react";
import { Workflows } from "@/app/generated/prisma/client";
import { useReactFlow, Panel } from "@xyflow/react";
import { Button } from "@/components/ui/button";

export default function WorkspacesNavbar({ workflow, setWorkflow, setShowExecution }: { workflow: Workflows, setWorkflow: any, setShowExecution: any }) {
	if (!workflow.name) workflow.name = "Untitled"

	const [n, setName] = useState(workflow.name)
	const { getNodes, getEdges, setNodes } = useReactFlow()

	const updateWorkflow = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/workflows/update`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				workspaceid: workflow.workspaceid,
				id: workflow.id,
				name: n,
				nodes: getNodes(),
				edges: getEdges(),
			}),
		})
		if (!res.ok) console.log(await res.json())

		const { updatedWorkflow } = await res.json()
		console.log("updatedWorkflow", updatedWorkflow)
		setWorkflow(updatedWorkflow)
	}

	return (
		<Panel position="top-center" className="-translate-y-5 rounded-md w-full">
			<header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
				<div className="flex h-14 w-full items-center justify-between px-6">


					<div className="w-full flex items-center gap-6 justify-center">
						<Input
							className="text-2xl font-semibold text-center tracking-tight text-zinc-900 border-none w-fit h-fit focus:border-none"
							value={n}
							onChange={(e) => { setName(e.target.value) }}
						/>

						<Link href={"/"} className="cursor-pointer text-zinc-500 group relative hover:text-zinc-800 duration-300"><Home className="w-5 h-5" />
							<span
								className="
		absolute left-1/2 top-0 hidden
		-translate-x-1/2 translate-y-3/4
		whitespace-nowrap rounded-md
		border border-zinc-200 bg-white
		px-2 py-1
		text-xs font-medium text-zinc-700
		shadow-sm
		group-hover:block
	"
							>
								Back home
							</span>
						</Link>
						<div onClick={() => { updateWorkflow() }} className="relative group cursor-pointer text-zinc-500 hover:text-zinc-800 duration-300"><Save className="w-5 h-5" />
							<span
								className="
		absolute left-1/2 top-0 hidden
		-translate-x-1/2 translate-y-3/4
		whitespace-nowrap rounded-md
		border border-zinc-200 bg-white
		px-2 py-1
		text-xs font-medium text-zinc-700
		shadow-sm
		group-hover:block
	"
							>
								Save Workflow
							</span>
						</div>

						<div className="group cursor-pointer text-zinc-500 hover:text-zinc-800 duration-300 relative" onClick={() => setShowExecution(true)}><Folder className="w-5 h-5" /> <span
							className="
		absolute left-1/2 top-0 hidden
		-translate-x-1/2 translate-y-3/4
		whitespace-nowrap rounded-md
		border border-zinc-200 bg-white
		px-2 py-1
		text-xs font-medium text-zinc-700
		shadow-sm
		group-hover:block
	"
						>
							Executions
						</span></div>
					</div>
				</div>
			</header>
		</Panel>
	);
}
