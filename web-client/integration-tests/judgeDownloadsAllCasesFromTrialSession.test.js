import { judgeViewsTrialSessionWorkingCopy } from './journey/judgeViewsTrialSessionWorkingCopy';

import { loginAs, setupTest, waitForExpectedItemToExist } from './helpers';

const cerebralTest = setupTest();
const checksum = require('checksum');
const fs = require('fs');

const axios = require('axios');

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
    expect(url).toBeDefined();

    cerebralTest.url = url;
  });

  it('verifies the zip contains the exjpected files', async () => {
    const EXPECTED_HASH_FOR_SEED_DATA_ZIP =
      'b9d18a44dcdab0e1908156f5e5464d54b8303b0d';
    console.log('cerebralTest.url', cerebralTest.url);
    const { data } = await axios.get(cerebralTest.url, {
      responseType: 'blob',
    });
    const hash = checksum(data);
    fs.writeFileSync('my-zip.zip', data, 'binary');
    expect(hash).toEqual(EXPECTED_HASH_FOR_SEED_DATA_ZIP);
  });
});
