import { Prisma } from "@/app/generated/prisma/client";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type ExecutionWithNodeData = Prisma.ExecutionsGetPayload<{
	include: {
		executionnodedata: true;
	};
}>;
export default function ExecutionsSection({ workflowId, setShowExecution }: { workflowId: number, setShowExecution: any }) {
	const [executions, setExecutions] = useState<ExecutionWithNodeData[] | []>([])
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		const getExecutions = async () => {
			setLoading(true)
			const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/executions/${workflowId}`)
			if (!res.ok) console.log(await res.json())
			const { executions } = await res.json()

			setLoading(false)
			console.log(executions)
			setExecutions(executions)
		}
		getExecutions()
	}
		, [])

	const [openExecutions, setOpenExecutions] = useState<Set<string>>(new Set());
	const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());

	const toggleExecution = (id: string) => {
		setOpenExecutions((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const toggleNode = (id: string) => {
		setOpenNodes((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const dotColor = (status: string) =>
	status === "Success" ? "bg-green-600" : status === "Failed" ? "bg-red-600" : "bg-yellow-500";

	const statusTextColor = (status: string) =>
		status === "Success" ? "text-green-600" : status === "Failed" ? "text-red-600" : "text-yellow-600";

	const badgeClass = (status: string) =>
		status === "Success"
			? "bg-green-50 text-green-700 border-green-200"
			: status === "Failed"
				? "bg-red-50 text-red-700 border-red-200"
				: "bg-yellow-50 text-yellow-700 border-yellow-200";



	if (loading && !executions) {
		return (<div className="min-h-screen w-full bg-white flex flex-col items-center justify-center">
			<Loader2 className="w-16 h-16 text-zinc-500 animate-spin" />
			<div className="flex gap-2 text-zinc-400 text-md">
				Fetching workflow executions...
			</div>
		</div>
		)
	}
	return (

		<div className="h-full w-full bg-white">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
				<button
					onClick={() => setShowExecution(false)}
					className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-900"
				>
					<svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
						<polyline points="15 18 9 12 15 6" />
					</svg>
					Back to flow
				</button>

				<p className="text-lg font-bold text-zinc-900" style={{ fontFamily: "'Instrument Serif', serif" }}>
					Workflow Executions
				</p>

				<span className="font-mono text-xs text-zinc-400">
					{executions.length} run{executions.length !== 1 ? "s" : ""}
				</span>
			</div>

			{/* Content */}
			<div className="px-6 py-5">
				{executions.length < 1 ? (
					<div className="flex h-56 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-200">
						<svg className="h-6 w-6 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
							<polygon points="5 3 19 12 5 21 5 3" />
						</svg>
						<p className="text-sm font-medium text-zinc-900">No executions yet</p>
						<p className="text-xs text-zinc-400">Execute your workflow to view logs and node data.</p>
					</div>
				) : (
					<div className="flex flex-col gap-2.5 overflow-y-auto">
						{executions.map((execution, index) => {
							const exOpen = openExecutions.has(execution.id.toString());
							return (
								<div key={execution.id} className="overflow-hidden rounded-md border border-zinc-200">

									{/* Execution trigger */}
									<button
										onClick={() => toggleExecution(execution.id.toString())}
										className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-zinc-50"
									>
										<div className="flex items-center gap-3">
											<div className={`h-2 w-2 rounded-full ${dotColor(execution.status)}`} />
											<div className="flex flex-col gap-0.5">
												<span className="text-sm font-medium text-zinc-900">
													Execution #{index +1}
												</span>
												<span className={`font-mono text-[11px] ${statusTextColor(execution.status)}`}>
													{execution.status}
												</span>
											</div>
										</div>

										<div className="flex items-center gap-2.5">
											<span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[11px] ${badgeClass(execution.status)}`}>
												{execution.status === "Success" ? "✓" : execution.status === "Failed" ? "✕" : "…"} {execution.status}
											</span>
											<svg
												className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${exOpen ? "rotate-180" : ""}`}
												fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
											>
												<polyline points="6 9 12 15 18 9" />
											</svg>
										</div>
									</button>

									{/* Execution body */}
									{exOpen && (
										<div className="border-t border-zinc-200 bg-zinc-50">
											{execution.errormessage && (
												<div className={`mx-4 mt-3.5 flex items-start gap-2 rounded-sm border ${execution.status === "Success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"} px-3 py-2`}>
													<svg className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${execution.status === "Success" ? "text-green-500" : "text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
														<circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
													</svg>
													<p className={`font-mono text-xs leading-relaxed ${execution.status === "Success" ? "text-green-700" : "text-red-700"}`}>Execution Result {execution.errormessage}</p>
												</div>
											)}

											<div className="flex flex-col gap-2 p-4">
												{execution.executionnodedata.map((node) => {
													const nodeKey = `${execution.id}-${node.id}`;
													const nodeOpen = openNodes.has(nodeKey);
													return (
														<div key={node.id} className="overflow-hidden rounded-sm border border-zinc-200 bg-white">

															{/* Node trigger */}
															<button
																onClick={() => toggleNode(nodeKey)}
																className="flex w-full items-center justify-between px-3.5 py-2.5 text-left transition-colors hover:bg-zinc-50"
															>
																<div className="flex items-center gap-2.5">
																	<div className={`h-1.5 w-1.5 rounded-full ${dotColor(node.status || "Unkown Status")}`} />
																	<div className="flex flex-col gap-0.5">
																		<span className="text-xs font-medium text-zinc-900">{node.nodeid}</span>
																		<span className={`font-mono text-[11px] ${statusTextColor(node.status || "Unkown Status")}`}>
																			{node.status}
																		</span>
																	</div>
																</div>
																<svg
																	className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${nodeOpen ? "rotate-180" : ""}`}
																	fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
																>
																	<polyline points="6 9 12 15 18 9" />
																</svg>
															</button>
															{node.errormessage && (
																<div className="flex items-start gap-2 bg-zinc-50 px-3 py-2">
																	<p className="font-mono text-xs leading-relaxed text-zinc-800">Message: {node.errormessage}</p>
																</div>
															)}

															{/* Node body */}
															{nodeOpen && (
																<div className="flex flex-col gap-3 border-t border-zinc-200 px-3.5 py-3">
																	<div className="flex flex-col gap-1">
																		<span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">Input</span>
																		<pre className="h-fit max-h-32 overflow-y-scroll rounded-sm border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed text-zinc-700">
																			<code className="text-wrap">{node.inputdata}</code>
																		</pre>
																	</div>
																	<div className="flex flex-col gap-1">
																		<span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">Output</span>
																		<pre className="h-fit max-h-32 overflow-y-scroll rounded-sm border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed text-zinc-700">
																			<code className="text-wrap">{node.outputdata}</code>
																		</pre>
																	</div>
																</div>
															)}
														</div>
													);
												})}
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	)
}
