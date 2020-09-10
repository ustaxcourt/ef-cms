const AWS = require('aws-sdk');

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

const sendSegmentMessage = async ({ numSegments, segment }) => {
  const messageBody = { segment, totalSegments: numSegments };
  const params = {
    MessageBody: JSON.stringify(messageBody),
    QueueUrl: `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_queue_${ENV}`,
  };

  try {
    await sqs.sendMessage(params).promise();
    console.log(`Message ${segment}/${numSegments} sent successfully.`);
  } catch (e) {
    console.error(`Error sending message ${segment}/${numSegments}.`, e);
  }
};

(async () => {
  const itemCount = await getItemCount();

  const numSegments = Math.ceil(itemCount / SEGMENT_SIZE);

  for (let segment = 0; segment < numSegments; segment++) {
    await sendSegmentMessage({ numSegments, segment });
  }
})();
