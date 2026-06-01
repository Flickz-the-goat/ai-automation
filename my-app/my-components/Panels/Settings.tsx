import { useNodeEditor } from "@/context/NodeEditorContext";
import HttpRequestSettings from "./HttpRequestSettings";
import { Panel } from "@xyflow/react";
import { X } from "lucide-react";
import AiNodeSettings from "./AiNodeSettings";
import { HttpRequestNodeType, IfNodeType } from "@/types/NodeTypes";
import IfNodeSettings from "./IfNodeSettings";

export default function NodeSettingsPanel() {
	const {selectedNode, setSelectedNode, setNodes} = useNodeEditor()

	if (!selectedNode) return null;

	const updateNodeData = (patch: any) => {
		setSelectedNode({
			...selectedNode,
			data: {
				...selectedNode.data,
				...patch,
			},
		});

		// sync to react flow
		setNodes((nds: any) =>
			nds.map((n: any) =>
				n.id === selectedNode.id
					? {
							...n,
							data: {
								...n.data,
								...patch,
							},
					  }
					: n
			)
		);
	};

	const renderSettings = () => {
		switch (selectedNode.type) {
			case "httpRequest":
				return (
					<HttpRequestSettings
						node={selectedNode as HttpRequestNodeType}
						onChange={updateNodeData}
					/>
				);
			case "aiNode":
				return (
					<AiNodeSettings id={selectedNode.id} data={selectedNode.data} onChange={updateNodeData}/>
			)
			case "ifNode":
				return (
					<IfNodeSettings node={selectedNode as IfNodeType} onChange={updateNodeData}/>
			)
			default:
				return (
					<div className="p-4 text-sm text-zinc-500">
						No settings available
					</div>
				);
		}
	};

	return (
		<Panel position="center-right" className="translate-x-5 h-full w-80 border-l border-zinc-200 bg-white z-50">
			{/* header */}
			<div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 z-50">
				<p className="text-sm font-medium text-zinc-900">
				{selectedNode.type} Settings
				</p>

				<button
					onClick={() => setSelectedNode(null)}
					className="text-xs text-zinc-500 hover:text-red-900 cursor-pointer"
				>
					<X className="w-4 h-4"/>	
				</button>
			</div>

			{renderSettings()}
		</Panel>
	);
}
