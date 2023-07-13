import { putItem } from '../../../../shared/admin-tools/aws/deployTableHelper';

(async () => {
  await putItem({
    env: process.env.ENV,
    key: 's3-queue-is-empty',
    value: false,
  });
})();
