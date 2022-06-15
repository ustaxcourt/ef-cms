const { verifyAdminUserDisabled } = require('./admin');

(async () => {
  console.log('== Verifying USTC admin user is disabled');
  await verifyAdminUserDisabled();
  console.log('== Done');
})();
