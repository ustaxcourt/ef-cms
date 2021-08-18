const { createAdminAccount, deactivateAdminAccount } = require('./admin');

(async () => {
  console.log('== Creating Admin account');
  await createAdminAccount();
  console.log('== Deactivating Admin account');
  await deactivateAdminAccount();
  console.log('== Done');
})();
