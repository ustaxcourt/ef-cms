import { DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { addToQueue } from '../shared/admin-tools/aws/sqsHelper';
import { shuffle } from 'lodash';

// We found that 200 seems to be a good number to choose.  Anything too high and migrations stop working well.
const SEGMENT_SIZE = 200;

const [ENV] = process.argv.slice(2);

if (!ENV) {
  throw new Error('Please provide an environment.');
}

if (!process.env.AWS_ACCOUNT_ID) {
  throw new Error('Please set AWS_ACCOUNT_ID in your environment.');
}

if (!process.env.SOURCE_TABLE) {
  throw new Error('Please set SOURCE_TABLE in your environment.');
}

const QueueUrl = `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_queue_${ENV}`;

const dynamodb = new DynamoDBClient({
  maxAttempts: 10,
  region: 'us-east-1',
});

const getItemCount = async () => {
  const describeTableCommand = new DescribeTableCommand({
    TableName: process.env.SOURCE_TABLE,
  });
  try {
    const { Table } = await dynamodb.send(describeTableCommand);
    return Table.ItemCount || 0;
  } catch (e) {
    console.error('Error retrieving dynamo item count.', e);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const itemCount = await getItemCount();

  const totalSegments = Math.max(1, Math.ceil(itemCount / SEGMENT_SIZE));

  const segments = shuffle(
    new Array(totalSegments).fill(null).map((v, i) => ({
      segment: i,
      totalSegments,
    })),
  );

  const { failed } = await addToQueue({ QueueUrl, messages: segments });
  if (failed.length) {
    // TODO: bail?
    // process.exit(1);
  }
})();
