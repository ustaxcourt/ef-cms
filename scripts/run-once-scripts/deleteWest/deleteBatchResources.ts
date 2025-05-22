import {
  BatchClient,
  DescribeJobQueuesCommand,
  UpdateJobQueueCommand,
  DeleteJobQueueCommand,
} from '@aws-sdk/client-batch';
import {
  parseArgsAndEnvVars,
  ScriptConfig,
} from 'scripts/helpers/parseArgsAndEnvVars';

const scriptConfig: ScriptConfig = {
  description:
    'practitioner-stats - Outputs practitioner stats over a given year',
  environment: {
    env: 'ENV',
    deployingColor: 'DEPLOYING_COLOR',
  },
  requireActiveAwsSession: true,
};
const { env, deployingColor } = parseArgsAndEnvVars(scriptConfig) as {
  env: string;
  deployingColor: string;
};

export async function deleteJobQueue() {
  const REGION = 'us-west-1';
  const JOB_QUEUE_NAME = `aws-batch-job-queue-${env}-${deployingColor}-us-west-1`;

  const client = new BatchClient({ region: REGION });
  try {
    // Step 1: Get Job Queue ARN (optional but helpful)
    const describeResponse = await client.send(
      new DescribeJobQueuesCommand({ jobQueues: [JOB_QUEUE_NAME] }),
    );

    const jobQueue = describeResponse.jobQueues?.[0];
    if (!jobQueue) {
      console.error(`Job Queue "${JOB_QUEUE_NAME}" not found.`);
      return;
    }

    console.log(`Found job queue: ${jobQueue.jobQueueArn}`);

    // Step 2: Disable the job queue (required before delete)
    if (jobQueue.state === 'ENABLED') {
      console.log('Disabling job queue...');
      await client.send(
        new UpdateJobQueueCommand({
          jobQueue: JOB_QUEUE_NAME,
          state: 'DISABLED',
        }),
      );

      // Wait a few seconds for state change to propagate
      await new Promise(res => setTimeout(res, 5000));
    }

    // Step 3: Delete the job queue
    console.log('Deleting job queue...');
    await client.send(
      new DeleteJobQueueCommand({
        jobQueue: JOB_QUEUE_NAME,
      }),
    );

    console.log(`Job queue "${JOB_QUEUE_NAME}" deleted successfully.`);
  } catch (error) {
    console.error('Error deleting job queue:', error);
  }
}
