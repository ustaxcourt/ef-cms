const AWS = require('aws-sdk');
const { chunk, shuffle } = require('lodash');

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

const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'us-east-1' });

const getItemCount = async () => {
  const dynamo = new AWS.DynamoDB({
    endpoint: 'dynamodb.us-east-1.amazonaws.com',
    region: 'us-east-1',
  });

  try {
    const { Table } = await dynamo
      .describeTable({ TableName: process.env.SOURCE_TABLE })
      .promise();
    return Table.ItemCount;
  } catch (e) {
    console.error('Error retrieving dynamo item count.', e);
  }
};

let sent = 0;

(async () => {
  const itemCount = await getItemCount();

  const totalSegments = Math.ceil(itemCount / SEGMENT_SIZE);

  const segments = shuffle(
    new Array(totalSegments).fill(null).map((v, i) => ({
      segment: i,
      totalSegments,
    })),
  );

  const chunks = chunk(segments, 10);
  let done = 0;
  const promises = [];
  for (let chunk of chunks) {
    promises.push(
      sqs
        .sendMessageBatch({
          Entries: chunk.map(segment => ({
            Id: `${sent++}`,
            MessageBody: JSON.stringify(segment),
          })),
          QueueUrl: `https://sqs.us-east-1.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/migration_segments_queue_${ENV}`,
        })
        .promise()
        .then(() => {
          done += chunk.length;
          console.log(
            `${done} out of ${totalSegments} messages sent successfully.`,
          );
        })
        .catch(err => {
          console.log(err);
        }),
    );
  }
  await Promise.all(promises);
})();
