const { disableUser } = require('../shared/admin-tools/user/admin');

(async () => {
  try {
    await disableUser('testAdmissionsClerk@example.com');
    console.log('Successfully disabled test user!');
  } catch (e) {
    console.log('Unable to disable test user. Error was: ', e);
    process.exit(1);
  }
})();
