const { verifyAdminUserDisabled } = require('./admin');

(async () => {
  console.log('== Verifying ustc admin user is disabled');
  await verifyAdminUserDisabled();
  console.log('== Done');
})();
