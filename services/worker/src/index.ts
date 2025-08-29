import { Queue, Worker, JobsOptions } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const queues = {
  campaigns: new Queue('campaigns', { connection }),
  messages: new Queue('messages', { connection }),
};

// BullMQ v5: QueueSchedulers are internal; not required explicitly.

new Worker(
  'campaigns',
  async job => {
    // TODO: implement campaign processing logic
    console.log('Process campaign job', job.id, job.data);
  },
  { connection }
);

new Worker(
  'messages',
  async job => {
    // TODO: implement message send/receipt handling
    console.log('Process message job', job.id, job.data);
  },
  { connection }
);

console.log('Worker running. Queues: campaigns, messages');

