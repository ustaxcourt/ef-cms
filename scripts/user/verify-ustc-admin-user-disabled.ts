import { verifyAdminUserDisabled } from '../../shared/admin-tools/user/admin';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  console.log('== Verifying USTC admin user is disabled');
  await verifyAdminUserDisabled({ attempt: 0 });
  console.log('== Done');
})();
