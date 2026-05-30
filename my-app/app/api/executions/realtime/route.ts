import { QueueEvents } from "bullmq"
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
	const stream = new TransformStream()
	const encoder = new TextEncoder()
	const streamWriter = stream.writable.getWriter()

	const events = new QueueEvents("executionsQueue", {
		connection: {
			host: '127.0.0.1',
			port: 6379,
		}
	})
	
	console.log("Streamer set up ")
	const cleanup = async () => {
		await events.close()
		try { streamWriter.close() } catch (e) { }
	}

	events.on("progress", async ({ jobId, data }) => {
		console.log("Progress:", data)
		await streamWriter.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
	})

	events.on("completed", async ({ jobId }) => {
		await streamWriter.write(encoder.encode(`data: ${JSON.stringify({ status: "Completed" })}\n\n`))
		await cleanup()
	})
	events.on("failed", async ({ jobId }) => {
		await streamWriter.write(encoder.encode(`data: ${JSON.stringify({ status: "Failed" })}\n\n`))
		await cleanup()
	})

	req.signal.addEventListener("abort", () => {
		cleanup()
	})

	return new Response(stream.readable, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache, no-transform",
			"Connection": "keep-alive",
		}
	})

}
