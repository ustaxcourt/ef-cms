import { judgeViewsTrialSessionWorkingCopy } from './journey/judgeViewsTrialSessionWorkingCopy';

import { loginAs, setupTest, waitForExpectedItemToExist } from './helpers';

const cerebralTest = setupTest();

describe('Judge downloads all cases from trial session', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'judgeColvin@example.com');
  it('set the trial session', () => {
    cerebralTest.trialSessionId = '959c4338-0fac-42eb-b0eb-d53b8d0195cc';
  });
  judgeViewsTrialSessionWorkingCopy(cerebralTest, false, false, 3);

  it('Judge downloads all the cases', async () => {
    cerebralTest.runSequence('batchDownloadTrialSessionSequence', {
      allowRetry: false,
    });

    await waitForExpectedItemToExist({
      cerebralTest,
      currentItem: 'batchTrialSessionAllCasesDownloadUrl',
    });
    const url = cerebralTest.getState('batchTrialSessionAllCasesDownloadUrl');
    console.log(`batchTrialSessionAllCasesDownloadUrl ${url}`);
  });
});
