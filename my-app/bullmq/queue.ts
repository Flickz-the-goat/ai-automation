// host: 127.0.0.1
// port: 6379
import { Queue } from 'bullmq';

export const myQueue = new Queue('executionsQueue', {
	connection: {
		host: '127.0.0.1',
		port: 6379,
	},
});

export async function addJob(workflowId: number) {
	const job = await myQueue.add('executionsQueue', {
		workflowId: workflowId,
	});
	console.log('Job set workflowid:', workflowId);

	return job
}


console.log("Queue is listening")
