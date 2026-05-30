import 'dotenv/config'
import prisma from '@/lib/prisma';
import { type Edge, type Node } from '@xyflow/react';
import { Worker } from 'bullmq';
import { execute } from './executor';
import { refine } from '../refine';
import { recuriseExecute } from './recursiveExecutor';

const worker = new Worker(
	'executionsQueue',
	async job => {
		console.log('Processing job:', job.name);
		console.log('Workflow ID: ', job.data)

		const { workflowId } = job.data

		const workflow = await prisma.workflows.findUnique({
			where: {
				id: workflowId,
			}
		})
		if (!workflow) return 'Workflow not found'

		const nodes = workflow.nodes as unknown as Node[]
		const edges = workflow.edges as unknown as Edge[]
		
		const {updatedNodes, updatedEdges } = refine(nodes, edges)

		const execution = await prisma.executions.create({
			data:{
				workflowid: workflow.id,
				status: "Started",
			}
		})
		const executionResult = await recuriseExecute(job, updatedNodes, updatedEdges, execution.id)
		const updatedExecution = await prisma.executions.update({
			where: {
				id: execution.id,
			},
			data: {
				status: executionResult.status,
				errormessage: executionResult.message,
			}
		})

		return 'done';
	},
	{
		connection: {
			host: '127.0.0.1',
			port: 6379,
		},
	}
);

worker.on('completed', job => {
	console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
	console.log(`Job ${job?.id} failed`, err);
});

console.log('Worker started');
