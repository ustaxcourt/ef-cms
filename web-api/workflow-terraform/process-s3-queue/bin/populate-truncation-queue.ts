import { addToQueue } from '../../../../shared/admin-tools/aws/sqsHelper';
import { generateBucketTruncationQueueEntries } from '../main/utilities/generate-truncation-queue';

const Bucket = process.env.BUCKET_NAME;
const QueueUrl = process.env.S3_BUCKET_QUEUE_URL;

(async () => {
  const messages = await generateBucketTruncationQueueEntries({ Bucket });
  await addToQueue({ QueueUrl, messages });
})();
