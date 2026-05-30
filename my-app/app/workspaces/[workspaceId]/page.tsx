"use client";
import { Workspaces, Workflows } from "@/app/generated/prisma/client";
import ExecutionsSection from "@/my-components/ExecutionsSection";
import Flow from "@/my-components/Flow";
import SelectTrigger from "@/my-components/SelectTrigger";
import { Button } from "@base-ui/react";
import { Bot, Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";

export default function Workspace({ params }: { params: Promise<{ workspaceId: number }> }) {
	const [workspace, setWorkspace] = useState<Workspaces | null>(null)
	const [workflow, setWorkflow] = useState<Workflows | null>(null)
	const [loading, setLoading] = useState<boolean>(true);
	const { workspaceId } = use(params);
	const [showExecution, setShowExecution] = useState(false)

	useEffect(() => {
		const getWorkspace = async () => {
			setLoading(true)
			const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/workspaces/getOne`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ workspaceId }),
			})
			if (!res.ok)
				console.log(await res.json())
			const { workspace, workflow } = await res.json()

			setWorkflow(workflow)
			setWorkspace(workspace)
			setLoading(false)
		}
		getWorkspace()
	}, [])

	const createWorkflow = async (trigger: string) => {
		setLoading(true)
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/workflows/create`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ workspaceId: workspace?.id, triggerType: trigger }),
		})

		if (!res.ok)
			console.log(await res.json())
		const { workflow } = await res.json()
		console.log(workflow)
		setWorkflow(workflow)
		setLoading(false)
	}

	if (loading && !workspace && !workflow) {
		return (
			<div className="min-h-screen w-full bg-white flex flex-col items-center justify-center">
				<Loader2 className="w-16 h-16 text-zinc-500 animate-spin" />
				<div className="flex gap-2 text-zinc-400 text-md">
					<Bot className="w-6 h-6" />
					Setting up your workspace...
				</div>
			</div>
		)
	}
	if (showExecution && workflow){
		return(
		<div className="flex min-h-screen w-full">
			<ExecutionsSection workflowId={workflow.id} setShowExecution={setShowExecution}/>
		</div>
		)
	}
	return (
		<div className="min-h-screen w-full bg-white">
			{!workflow ? (
				<div className="flex h-[80vh] w-full items-center justify-center px-6">
					<SelectTrigger createWorkflow={createWorkflow} />
				</div>
			) : (
				<Flow workflow={workflow} setWorkflow={setWorkflow} setShowExecution={setShowExecution} />
			)}
		</div>
	);
}
