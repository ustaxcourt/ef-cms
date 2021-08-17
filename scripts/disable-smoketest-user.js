const { disableUser } = require('../shared/admin-tools/user/admin');

(async () => {
  await disableUser('testAdmissionsClerk@example.com');
})();
