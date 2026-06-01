import { IfNodeType } from "@/types/NodeTypes"
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
	node: IfNodeType,
	onChange: (data: any) => void;

}
export default function IfNodeSettings({ node, onChange }: Props) {
	const data = node.data
	const [left, setLeft] = useState(data.left)
	const [operator, setOperator] = useState(data.operator)
	const [right, setRight] = useState(data.right)
	const [changed, setChanged] = useState(false)

	return (
		<div className="flex flex-col gap-4 p-4">
			<div className="flex flex-col gap-1">
				<Label className="text-xs text-zinc-500">Left expression</Label>
				<div className="flex gap-2">
					<Input
						value={left || ""}
						onChange={(e) => {
							setChanged(true)
							setLeft(e.target.value)
						}
						}
						placeholder="{{http.status}}"
						className="h-9"
					/>
					<div className={`${changed ? "flex" : "hidden"} items-center text-zinc-400 justify-center border border-zinc-300 rounded-md p-2 cursor-pointer hover:bg-green-300/50 hover:border-green-800 duration-300`} onClick={(e) => { onChange({ left: left }); setChanged(false) }}>
						<Check className="w-5 h-5 stroke-green-800" />
					</div>
				</div>

			</div>
			<div className="flex flex-col gap-1">
				<Label className="text-xs text-zinc-500">Operator</Label>
				<Select
					value={data.operator}
					onValueChange={(value) =>
						onChange({ operator: value })
					}
				>
					<SelectTrigger className="h-9">
						<SelectValue placeholder="Select operator" />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value="==">==</SelectItem>
						<SelectItem value="!=">!=</SelectItem>
						<SelectItem value=">">&gt;</SelectItem>
						<SelectItem value="<">&lt;</SelectItem>
						<SelectItem value="<=">&le;</SelectItem>
						<SelectItem value=">=">&ge;</SelectItem>
					</SelectContent>
				</Select>

			</div>
			<div className="flex flex-col gap-1">
				<Label className="text-xs text-zinc-500">Right expression</Label>
				<div className="flex gap-2">
					<Input
						value={right || ""}
						onChange={(e) => {
							setChanged(true)
							setRight(e.target.value)
						}
						}
						placeholder="200"
						className="h-9"
					/>
					<div className={`${changed ? "flex" : "hidden"} items-center text-zinc-400 justify-center border border-zinc-300 rounded-md p-2 cursor-pointer hover:bg-green-300/50 hover:border-green-800 duration-300`} onClick={(e) => { onChange({ right: right }); setChanged(false) }}>
						<Check className="w-5 h-5 stroke-green-800" />
					</div>
				</div>

			</div>


		</div>
	)
}
