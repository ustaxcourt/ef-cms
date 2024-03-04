import { createAndEnableSmoketestUser } from './create-and-enable-smoketest-user-helpers';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await createAndEnableSmoketestUser();
})();
