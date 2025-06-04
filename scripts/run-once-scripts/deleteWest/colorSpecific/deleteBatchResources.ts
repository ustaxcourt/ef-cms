import {
  BatchClient,
  DescribeJobQueuesCommand,
  UpdateJobQueueCommand,
  DeleteJobQueueCommand,
  DescribeComputeEnvironmentsCommand,
  UpdateComputeEnvironmentCommand,
  DeleteComputeEnvironmentCommand,
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
  requireActiveAwsSession: false,
};
const { env, deployingColor } = parseArgsAndEnvVars(scriptConfig) as {
  env: string;
  deployingColor: string;
};
const REGION = 'us-west-1';
const client = new BatchClient({ region: REGION });

async function deleteJobQueue() {
  const JOB_QUEUE_NAME = `aws-batch-job-queue-${env}-${deployingColor}-us-west-1`;

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
      await new Promise(res => setTimeout(res, 10000));
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

export async function deleteComputeEnvironment() {
  try {
    await deleteJobQueue();
    const computeEnvName = `compute_environment_${env}_${deployingColor}_us-west-1`;

    // Step 1: Check if the compute environment exists
    const describeResponse = await client.send(
      new DescribeComputeEnvironmentsCommand({
        computeEnvironments: [computeEnvName],
      }),
    );

    const computeEnv = describeResponse.computeEnvironments?.[0];
    if (!computeEnv) {
      console.error(`Compute Environment "${computeEnvName}" not found.`);
      return;
    }

    console.log(
      `Found Compute Environment: ${computeEnv.computeEnvironmentArn}`,
    );

    // Step 2: Disable the compute environment if it's ENABLED
    if (computeEnv.state === 'ENABLED') {
      console.log('Disabling compute environment...');
      await client.send(
        new UpdateComputeEnvironmentCommand({
          computeEnvironment: computeEnvName,
          state: 'DISABLED',
        }),
      );

      // Wait for state transition to take effect
      await new Promise(res => setTimeout(res, 5000));
    }

    // Step 3: Delete the compute environment
    console.log('Deleting compute environment...');
    await client.send(
      new DeleteComputeEnvironmentCommand({
        computeEnvironment: computeEnvName,
      }),
    );
    // Step 4: Poll until deleted or an error occurs
    for (let i = 0; i < 20; i++) {
      // Limit to 20 iterations to prevent potential infinite loop
      try {
        const { computeEnvironments } = await client.send(
          new DescribeComputeEnvironmentsCommand({
            computeEnvironments: [computeEnvName],
          }),
        );
        if (computeEnvironments?.[0]?.status === 'INVALID') {
          throw new Error(
            'compute environment has invalid status, likely due to missing delete permissions',
          );
        }
        if (!computeEnvironments || computeEnvironments.length === 0) {
          console.log(`${computeEnvName} has been deleted.`);
          return;
        }
        console.log(
          `Waiting for to ${computeEnvName} to delete, current status: ${computeEnvironments[0].status}`,
        );
      } catch (err: any) {
        if (err.name === 'ClientException' && /not found/i.test(err.message)) {
          console.log(`${computeEnvName} not found.`);
          return;
        }
        throw err;
      }
      await new Promise(r => setTimeout(r, 5000));
    }
    throw new Error('Failed to delete compute environment after 20 iterations');
  } catch (error) {
    console.error('Error deleting compute environment:', error);
  }
}
