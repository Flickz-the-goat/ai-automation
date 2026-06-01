import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HttpRequestNodeType } from "@/types/NodeTypes";
import { Check } from "lucide-react";
import { useState } from "react";

type Props = {
	node: HttpRequestNodeType,
	onChange: (data: any) => void;
};

export default function HttpRequestSettings({ node, onChange }: Props) {
	const data = node.data
	const [url, setUrl] = useState(data.endpoint)
	const [changed, setChanged] = useState(false)

	return (
		<div className="flex flex-col gap-4 p-4">
			{/* URL */}
			<div className="flex flex-col gap-1">
				<Label className="text-xs text-zinc-500">URL</Label>
				<div className="flex gap-2">
					<Input
						value={url || ""}
						onChange={(e) => {
							setChanged(true)
							setUrl(e.target.value)
						}
						}
						placeholder="https://api.example.com"
						className="h-9"
					/>
					<div className={`${changed ? "flex" : "hidden"} items-center text-zinc-400 justify-center border border-zinc-300 rounded-md p-2 cursor-pointer hover:bg-green-300/50 hover:border-green-800 duration-300`} onClick={(e) => {onChange({ endpoint: url }); setChanged(false)}}>
						<Check className="w-5 h-5 stroke-green-800" />
					</div>
				</div>

			</div>

			{/* METHOD */}
			<div className="flex flex-col gap-1">
				<Label className="text-xs text-zinc-500">Method</Label>

				<Select
					value={"GET"}
					onValueChange={(value) =>
						onChange({ method: value })
					}
				>
					<SelectTrigger className="h-9">
						<SelectValue placeholder="Select method" />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="GET">GET</SelectItem>
						<SelectItem value="POST">POST</SelectItem>
						<SelectItem value="PUT">PUT</SelectItem>
						<SelectItem value="DELETE">DELETE</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
