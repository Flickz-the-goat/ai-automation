import { Clock, Play, Webhook } from "lucide-react";

export default function SelectTrigger({ createWorkflow }: { createWorkflow: any }) {
	return (
		<div className="w-full max-w-xl space-y-6">

			<div className="space-y-1 text-center">
				<h1 className="text-lg font-semibold tracking-tight text-zinc-900">
					Create Workflow
				</h1>
				<p className="text-sm text-zinc-500">
					Choose a trigger to start building your automation.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

				{/* Manual */}
				<button
					onClick={() => createWorkflow("manualTrigger")}
					className="flex flex-col items-center cursor-pointer text-center gap-3 rounded-md border border-zinc-200 bg-white p-4 transition-colors hover:border-green-700 hover:bg-green-300/20"
				>
					<Play className="h-6 w-6 text-zinc-700 stroke-green-800" />
					<div>
						<p className="text-sm font-medium text-zinc-900">
							Manual
						</p>
						<p className="text-xs text-zinc-500">
							Run manually
						</p>
					</div>
				</button>

				<button
					onClick={() => { () => createWorkflow("webHookTrigger") }}
					className="flex flex-col items-center gap-3 rounded-md border border-zinc-200 bg-white p-4 text-center transition-colors hover:border-blue-800 hover:bg-blue-300/20 cursor-pointer">
					<Webhook className="h-6 w-6 text-zinc-700 stroke-blue-800" />
					<div>
						<p className="text-sm font-medium text-zinc-900">
							Webhook
						</p>
						<p className="text-xs text-zinc-500">
							API triggered
						</p>
					</div>
				</button>

				<button
					onClick={() => { () => { createWorkflow("scheduleTrigger") } }}
					className="flex flex-col items-center gap-3 rounded-md border border-zinc-200 bg-white p-4 text-left transition-colors hover:border-purple-800 hover:bg-purple-300/20 cursor-pointer"
				>
					<Clock className="h-6 w-6 stroke-purple-800" />
					<div>
						<p className="text-sm font-medium text-zinc-900">
							Schedule
						</p>
						<p className="text-xs text-zinc-500">
							Time-based
						</p>
					</div>
				</button>
			</div>
		</div>
	)
}
