const {
  addToQueue,
} = require('../../../../../shared/admin-tools/aws/sqsHelper');
const {
  copyObjects,
  deleteObjects,
} = require('../../../../../shared/admin-tools/aws/s3Helper');

const QueueUrl = process.env.S3_BUCKET_SYNC_DL_QUEUE_URL;

exports.handler = async (event, context) => {
  if (!event || !('action' in event) || !event.action) {
    return succeed({ context, results: undefined });
  }

  let results;

  if (event.action === 'DELETE') {
    const { Bucket, Objects } = event;
    results = await deleteObjects({ Bucket, Objects });
  } else if (event.action === 'COPY') {
    const { destinationBucket, Objects, sourceBucket } = event;
    results = await copyObjects({ Objects, destinationBucket, sourceBucket });
  }

  if (results && 'Errors' in results && results.Errors) {
    // TODO: retry somehow?
    await addToQueue({ QueueUrl, messages: [{ event, results }] });
  }

  return succeed({ context, results });
};

const succeed = ({ context, results }) => {
  console.log(results);
  return context.succeed(results);
};
