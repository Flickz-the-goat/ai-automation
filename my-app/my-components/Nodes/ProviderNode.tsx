import { BaseNode } from "@/components/base-node";
import { Position, type NodeProps, type Node,} from "@xyflow/react";
import LimitHandle from "../misc/LimitHandle";
import Image from "next/image";
import { ProviderNodeType } from "@/types/NodeTypes";

export default function Provider({ id, data }: NodeProps<ProviderNodeType>) {
	return (
		<>
			<BaseNode
				className="h-12 w-12 flex items-center justify-center rounded-full  border-dashed border bg-white border-zinc-500 cursor-pointer transition-colors duration-150"
			>
				<div className="h-4 w-4 stroke-zinc-700 relative">
					<Image src={`/${data.type}.svg`} alt="open ai svg" fill />
				</div>
			</BaseNode>
			<LimitHandle
				connectionCount={1}
				position={Position.Top}
				type="target"
			/>
		</>


	)
}
