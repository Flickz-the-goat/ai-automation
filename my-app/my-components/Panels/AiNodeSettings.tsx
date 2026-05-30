import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useReactFlow } from "@xyflow/react";
import { useEffect, useState } from "react";
import { Check, Eye, EyeClosed } from "lucide-react";

type Props = {
	id: string,
	data: {
		provider: string,
		apiKey: string,
		prompt: string,
	};
	onChange: (data: any) => void;
};

export default function AiNodeSettings({ id, data, onChange }: Props) {
	const [provider, setProvider] = useState(data.provider)
	const [apiKey, setApiKey] = useState(data.apiKey)
	const [prompt, setPrompt] = useState(data.prompt)
	const { getEdges, getNode } = useReactFlow()
	const [changed, setChanged] = useState(false)

	const updateProvider = () => {
		const aiId = () => {
			let edges = getEdges()

			edges = edges.filter((edge) => edge.source === id)
			if (edges.length > 0)
				return edges[0].target
			else return null

		}
		const sourceId = aiId()
		if (sourceId) {
			const node = getNode(sourceId)
			if (node) {
				onChange({ provider: node.data.type })
				setProvider(data.provider?.charAt(0).toUpperCase() + data.provider?.slice(1))
			}
		}
	};

	useEffect(() => updateProvider(), [data.provider])

	const showPassword = () => {
		const input = document.querySelector("#apikey")

		const type = input?.getAttribute('type') === "password" ? 'type' : 'password'
		input?.setAttribute('type', type)
	}

	return (
		<div className="flex flex-col gap-4 p-4">
			<div>
				<p className="text-xs text-zinc-500 mb-1">Provider:</p>
				<p className="text-xs text-zinc">{provider || "No Provider Attached"}</p>
			</div>
			<div className="flex flex-col gap-1">
				<Label className="text-xs text-zinc-500">{provider} API Key:</Label>
				<div className="flex gap-2 items-center">
					<Input value={apiKey}
						onChange={(e) => {
							setChanged(true)
							setApiKey(e.target.value)
						}}
						placeholder="API Key"
						id="apikey"
					/>
					{
						changed &&
								<Check onClick={() => { onChange({apiKey: apiKey}); setChanged(false)}} className="text-zinc-500 cursor-pointer hover:text-zinc-800" />
					}
				</div>

			</div>
			<div className="flex flex-col gap-1">
				<Label className="text-xs text-zinc-500">Prompt:</Label>
				<textarea value={prompt}
					onChange={(e) => {
						setPrompt(e.target.value)
						onChange({ prompt: prompt })
					}}
					placeholder="Write your prompt here"
					className="py-1 px-2 rounded-md border border-zinc-200 h-64"
				/>

			</div>

		</div>
	)
}
