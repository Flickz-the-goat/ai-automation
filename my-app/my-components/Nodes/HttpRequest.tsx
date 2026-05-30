import { BaseNode } from "@/components/base-node";
import { Position, type Node, type NodeProps } from "@xyflow/react";
import { Check, Globe, X } from "lucide-react";
import LimitHandle from "../misc/LimitHandle";
import { useNodeEditor } from "@/context/NodeEditorContext";
import { HttpRequestNodeType } from "@/types/NodeTypes";
import { NodeStatusIndicator } from "@/components/node-status-indicator";

export default function HttpRequest({ id, data }: NodeProps<HttpRequestNodeType>) {
	const { setSelectedNode } = useNodeEditor()

	const onClick = () => {
		setSelectedNode(
			{
				id: id,
				type: "httpRequest",
				data,
			})
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
				<Globe className="h-4 w-4 stroke-zinc-700" />
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

			<LimitHandle
				connectionCount={1}
				position={Position.Left}
				type="target"
			/>

			<LimitHandle
				connectionCount={1}
				position={Position.Right}
				type="source"
			/>
		</NodeStatusIndicator>
	);
}
