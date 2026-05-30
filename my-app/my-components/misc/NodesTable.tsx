import {Panel} from "@xyflow/react"
import Card from "../Card"
import { Bot } from "lucide-react"
import Image from "next/image"

export default function NodesTable(){

	return (
<Panel position="center-left" className="h-full -translate-x-5">
			<div className="flex h-full w-60 flex-col border-r border-zinc-200 bg-white">
				
				<div className="px-4 py-3 border-b border-zinc-200">
					<p className="text-xs font-medium tracking-wide text-zinc-500 text-center">
						NODES
					</p>
				</div>

				<div className="flex flex-col gap-2 p-3">
					<Card icon={"HTTP"} text="HTTP Request" type="httpRequest" providerType="none"/>
					<Card icon={<Bot />} text="AI" type="aiNode" providerType="none"/>
				</div>

				<div className="px-4 py-3 border-b border-zinc-200">
					<p className="text-xs font-medium tracking-wide text-zinc-500 text-center">
						Providers	
					</p>
				</div>

				<div className="flex flex-col gap-2 p-3">
					<Card icon={<Image src={"/openai.svg"} alt="" fill/>} text="Open AI" type="provider" providerType="openai"/>
					<Card icon={<Image src={"/gemini.svg"} alt="" fill/>} text="Google Gemini" type="provider" providerType="gemini"/>
				</div>


			</div>
		</Panel>	
	)
}
