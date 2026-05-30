import { BaseNode } from "@/components/base-node";
import { Position, useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { Check, MousePointer2, X } from "lucide-react";
import LimitHandle from "../misc/LimitHandle";
import { useState } from "react";
import { NodeStatusIndicator } from "@/components/node-status-indicator";
import { ManualTriggerNodeType } from "@/types/NodeTypes";

export default function ManualTrigger({ data }: NodeProps<ManualTriggerNodeType>) {
	const { getNodes, toObject, setNodes } = useReactFlow()

	const clearNodes = () => {
		setNodes((nodes) => (
			nodes.map((n) => {
				return {
					...n,
					data: {
						...n.data,
						status: "initial",
					}
				}

			})
		))
	}


	const onClick = async () => {

		const nodes = getNodes()
		if (nodes.length == 1) {
			return
		}
		const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/executions/run`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ workspaceId: data.workspaceId })
		})
		if (!res.ok)
			console.log(res)

		const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BASE_URL}api/executions/realtime`)

		eventSource.onmessage = (event) => {
			const progress = JSON.parse(event.data)
			console.log(progress)

			if (progress.nodeid) {
				setNodes((nodes) => (
					nodes.map((n) => {
						if (n.id === progress.nodeid) {
							return {
								...n,
								data: {
									...n.data,
									status: progress.status
								}
							}
						}
						return n
					}
					)
				))
			}
			if (progress.status === "Completed" || progress.status === "Failed") {
				eventSource.close()
			}
		}
		setTimeout(() => clearNodes(), 30000)

	};

	return (
		<NodeStatusIndicator status={data.status} variant="overlay">
			<BaseNode
				onClick={onClick}
				className={`
					h-12 w-12
					flex items-center justify-center
					rounded-md
				${data.status == "initial" ? "border-zinc-500" : "border-none"
					}
					bg-white
					cursor-pointer
					transition-colors duration-150
					relative
				`}
			>
				<MousePointer2 className="h-4 w-4 stroke-green-700" />
				{
					data.status === "error" && (
						<div className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full border border-red-200 bg-red-50">
							<X className="h-2 w-2 stroke-[2.5] text-red-700" />
						</div>
					)
				}
				{
					data.status === "success" && (
						<div className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full border border-green-200 bg-green-50">
							<Check className="h-2 w-2 stroke-[2.5] text-green-700" />
						</div>
					)
				}


			</BaseNode>

			<LimitHandle
				position={Position.Right}
				type="source"
				connectionCount={1}
			/>
		</NodeStatusIndicator>
	);
}
