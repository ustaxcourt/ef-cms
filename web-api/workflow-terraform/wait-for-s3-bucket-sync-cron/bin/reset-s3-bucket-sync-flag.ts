import { putItem } from '../../../../shared/admin-tools/aws/dynamoDeployTableHelper';

(async () => {
  await putItem({
    env: process.env.ENV,
    key: 's3-bucket-sync-queue-is-not-empty',
    value: false,
  });
})();
