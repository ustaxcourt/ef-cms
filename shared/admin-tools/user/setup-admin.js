const { createAdminAccount, deactivate } = require('./admin');

(async () => {
  console.log('== Creating Admin account');
  await createAdminAccount();
  console.log('== Deactivating Admin account');
  await deactivate();
  console.log('== Done');
})();
