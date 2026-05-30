import { useReactFlow } from "@xyflow/react";
import React from "react";

interface CardProps {
	icon: string | React.ReactNode;
	text: string;
	type: string;
	providerType: string;
}

export default function Card({ icon, text, type, providerType }: CardProps) {
	const { addNodes, getNodes } = useReactFlow();
	
	const typeCount = getNodes().filter((n) => n.type === type).length
	const onClick = () => {
		const id = `${type}-${typeCount}`;

		switch (type) {
			case "httpRequest":
				addNodes({
					id,
					position: { x: 0, y: 0 },
					data: { endpoint: "", method: "GET", status: "initial" },
					type,
				});
				break;
			case "aiNode":
				addNodes({
					id,
					position: { x: 0, y: 0 },
					data: {
						provider: "",
						apiKey: "",
						prompt: "",
						status: "initial"
					},
					type,
				})
				break
			case "provider":
				addNodes({
				id,
				position: {x:0, y:0},
				data: {type: providerType},
				type,
				selectable: false,
			})
			break
			default:
				break;
		}
	};

	return (
		<div
			onClick={onClick}
			className="
				group flex w-full cursor-pointer items-center gap-3
				rounded-sm border border-zinc-200 bg-white
				px-3 py-2 space-x-2
				transition-colors duration-150 ease-out
				hover:border-zinc-300 hover:bg-zinc-50
			"
		>
			{/* Icon */}
			<div className="relative flex h-7 w-7 items-center justify-center text-zinc-600">
				{typeof icon === "string" ? (
					<span className="text-xs font-medium tracking-wide text-zinc-500">
						{icon}
					</span>
				) : (
					icon
				)}
			</div>

			{/* Text */}
			<div className="flex flex-col leading-tight">
				<p className="text-sm font-medium text-zinc-900">{text}</p>
			</div>
		</div>
	);
}
