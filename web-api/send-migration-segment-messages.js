const AWS = require('aws-sdk');
const { shuffle } = require('lodash');

// Seth said 200 for segment constant?
const [ENV, SEGMENT_SIZE] = process.argv.slice(2);

if (!ENV) {
  throw new Error('Please provide an environment.');
}

if (!SEGMENT_SIZE) {
  throw new Error('Please provide a segment size.');
}

if (!process.env.AWS_ACCOUNT_ID) {
  throw new Error('Please set AWS_ACCOUNT_ID in your environment.');
}

const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-1' });

const getItemCount = async () => {
  const dynamo = new AWS.DynamoDB({
    endpoint: 'dynamodb.us-east-1.amazonaws.com',
    region: 'us-east-1',
  });

  try {
    const { Table } = await dynamo
      .describeTable({ TableName: `efcms-${ENV}` })
      .promise();
    return Table.ItemCount;
  } catch (e) {
    console.error('Error retrieving dynamo item count.', e);
  }
};

const sendSegmentMessage = async ({ segment, totalSegments }) => {
  const messageBody = { segment, totalSegments: totalSegments };
  const params = {
    MessageBody: JSON.stringify(messageBody),
    QueueUrl: `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_queue_${ENV}`,
  };

  try {
    await sqs.sendMessage(params).promise();
  } catch (e) {
    console.error(`Error sending message ${segment + 1}/${totalSegments}.`, e);
  }
};

const now = Date.now().toString();

(async () => {
  const itemCount = await getItemCount();
  // let waitTime = 5000;

  const totalSegments = Math.ceil(itemCount / SEGMENT_SIZE);

  const segments = shuffle(
    new Array(totalSegments).fill(null).map((v, i) => ({
      segment: i,
      timestamp: now,
      totalSegments: totalSegments,
    })),
  );

  let sent = 0;
  for (let segment of segments) {
    await sendSegmentMessage(segment);
    console.log(`Message ${sent}/${totalSegments} sent successfully.`);
    sent++;
    // waitTime = Math.max(0, waitTime - 500);
    // await new Promise(resolve => {
    //   setTimeout(resolve, waitTime);
    // });
  }
})();
