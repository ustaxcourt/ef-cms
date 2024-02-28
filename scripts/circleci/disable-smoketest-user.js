import { disableUser } from '../../shared/admin-tools/user/admin';

export const disableSmoketestUser = async () => {
  try {
    await disableUser('testAdmissionsClerk@example.com');
    console.log('Successfully disabled test user!');
  } catch (e) {
    console.log('Unable to disable test user. Error was: ', e);
    process.exit(1);
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await disableSmoketestUser();
})();
