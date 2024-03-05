import { disableSmoketestUser } from './disable-smoketest-user-helpers';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await disableSmoketestUser();
})();
