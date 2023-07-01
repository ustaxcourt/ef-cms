import { addToQueue } from '../../../../shared/admin-tools/aws/sqsHelper';
import { listAllObjects } from '../../../../shared/admin-tools/aws/s3Helper';

const Bucket = process.env.SOURCE_BUCKET_NAME;
const QueueUrl = process.env.SOURCE_BUCKET_OBJECTS_QUEUE_URL;

(async () => {
  const allObjects = await listAllObjects({ Bucket });
  const objectKeys = allObjects.map(object => {
    return { Key: object.Key };
  });
  await addToQueue({ QueueUrl, messages: objectKeys });
})();
