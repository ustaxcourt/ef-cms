import { chambersViewsTrialSessionWorkingCopy } from './journey/chambersViewsTrialSessionWorkingCopy';
import { loginAs, setupTest } from './helpers';

const test = setupTest();

describe('Chambers dashboard', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    test.trialSessionId = '959c4338-0fac-42eb-b0eb-d53b8d0195cc';
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'colvinsChambers@example.com');
  chambersViewsTrialSessionWorkingCopy(test);
});
