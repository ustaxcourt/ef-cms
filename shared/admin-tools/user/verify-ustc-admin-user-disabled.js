const { verifyAdminUserDisabled } = require('./admin');

(async () => {
  console.log('== Verifying USTC admin user is disabled');
  await verifyAdminUserDisabled({ attempt: 0 });
  console.log('== Done');
})();
