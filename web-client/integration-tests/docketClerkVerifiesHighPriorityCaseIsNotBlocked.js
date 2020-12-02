import { setupTest } from './helpers';

const test = setupTest();

describe('Docket clerk verifies high priority case is not blocked', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  // if a case is set to high priority, and then one of its docket entries is set to pending, that case should no longer be blocked
  // verify that case is eligible for trial
  // if the high priority label is removed from the case, then the case should be updated to be blocked with blocked reason being pending
  // verify that case is NOT eligible for trial
});
