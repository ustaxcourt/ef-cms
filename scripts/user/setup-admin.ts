import { createAdminAccount, deactivateAdminAccount } from './admin';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  console.log('== Creating Admin account');
  await createAdminAccount();
  console.log('== Deactivating Admin account');
  await deactivateAdminAccount();
  console.log('== Done');
})();
