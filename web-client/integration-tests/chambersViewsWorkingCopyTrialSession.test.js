import { chambersViewsTrialSessionWorkingCopy } from './journey/chambersViewsTrialSessionWorkingCopy';
import { loginAs, setupTest } from './helpers';

const cerebralTest = setupTest();

describe('Chambers dashboard', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    cerebralTest.trialSessionId = '959c4338-0fac-42eb-b0eb-d53b8d0195cc';
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'colvinsChambers@example.com');
  chambersViewsTrialSessionWorkingCopy(cerebralTest);
});
