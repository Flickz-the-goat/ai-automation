import { Position, type NodeProps } from "@xyflow/react"
import { IfNodeType } from "@/types/NodeTypes"
import { NodeStatusIndicator } from "@/components/node-status-indicator"
import { BaseNode } from "@/components/base-node"
import { Split, X, Check } from "lucide-react"
import { useNodeEditor } from "@/context/NodeEditorContext"
import LimitHandle from "../misc/LimitHandle"

export default function IfNode({ id, data }: NodeProps<IfNodeType>) {
	const { setSelectedNode } = useNodeEditor()
	const onClick = () => {

		setSelectedNode({
			id: id,
			type: "ifNode",
			data,

		})
	}

	return (
		<NodeStatusIndicator status={data.status} variant="overlay">
			<BaseNode
				onClick={() => { onClick() }}
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
				<Split className="h-4 w-4 stroke-linear-to-b rotate-90 from-purple-500 to-pink-500" />
				{
					data.status === "error" && (
						<div className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full border border-red-200 bg-red-50">
							<X className="h-2 w-2 stroke-[2.5] text-green-700" />
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

			<LimitHandle connectionCount={1} type="target" position={Position.Left} />

			<LimitHandle connectionCount={2} type="source" position={Position.Right} className="-translate-y-3" id="true"/>
		
			<LimitHandle connectionCount={2} type="source" position={Position.Right} className="translate-y-3" id="false"/>

		</NodeStatusIndicator>
	)
}
