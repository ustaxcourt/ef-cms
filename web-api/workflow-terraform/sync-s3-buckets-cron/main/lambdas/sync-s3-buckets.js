// const {
//   approvePendingJob,
// } = require('../../../../../shared/admin-tools/circleci/circleci-helper');

// const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
// const jobName = 'wait-for-s3-sync';
// const workflowId = process.env.CIRCLE_WORKFLOW_ID;
// const Bucket = process.env.DESTINATION_BUCKET_NAME;
// const QueueUrl = process.env.SOURCE_BUCKET_OBJECTS_QUEUE_URL;

exports.handler = async (input, context) => {
  let remainingTimeInMillis = context.getRemainingTimeInMillis();

  let i = 0;
  while (remainingTimeInMillis > 1000) {
    i++;
    console.time(`iteration ${i}`);
    // read s3 object ids from the sqs queue
    // copy files from source to destination
    console.timeEnd(`iteration ${i}`);
    remainingTimeInMillis = context.getRemainingTimeInMillis();
  }

  return succeed({ context, results: { iterations: i } });
};

const succeed = ({ context, results }) => {
  console.log(results);
  return context.succeed(results);
};
