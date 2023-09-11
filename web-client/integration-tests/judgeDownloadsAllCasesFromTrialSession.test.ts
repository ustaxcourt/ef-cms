import { judgeViewsTrialSessionWorkingCopy } from './journey/judgeViewsTrialSessionWorkingCopy';
import { loginAs, setupTest, waitForExpectedItemToExist } from './helpers';
import AdmZip from 'adm-zip';
import fs from 'fs';
import http from 'http';

describe('Judge downloads all cases from trial session', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'judgecolvin@example.com');
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
    const ZIP_PATH =
      './web-client/integration-tests/test-output/trial-session.zip';
    fs.mkdirSync('./web-client/integration-tests/test-output', {
      recursive: true,
    });
    const expectedFiles = [
      '108-19, Garrett Carpenter, Leslie Bullock, Trustee/0_Docket Record.pdf',
      '101-20, Bill Burr/0_Docket Record.pdf',
      '103-20, Reuben Blair/0_Docket Record.pdf',
      '103-20, Reuben Blair/2020-01-23_0001_Petition.pdf',
      '103-20, Reuben Blair/2020-01-23_0004_Administrative Record.pdf',
      '103-20, Reuben Blair/2020-01-23_0003_Notice of Trial on 11272020 at Houston, Texa.pdf',
      '101-20, Bill Burr/2020-01-02_0001_Petition.pdf',
      '103-20, Reuben Blair/2020-09-21_0005_Notice of Election to Intervene.pdf',
      '108-19, Garrett Carpenter, Leslie Bullock, Trustee/2019-08-16_0001_Petition.pdf',
    ];

    const writer = fs.createWriteStream(ZIP_PATH);
    const response = await new Promise(resolve =>
      http.get(cerebralTest.url, resolve),
    );

    const filesInDownloadedZip = await new Promise(resolve =>
      response.pipe(writer).on('close', () => {
        const zip = new AdmZip(ZIP_PATH);
        const zipEntries = zip.getEntries();
        const files = [];

        zipEntries.forEach(zipEntry => {
          files.push(zipEntry.entryName);
        });
        resolve(files);
      }),
    );

    expect(filesInDownloadedZip).toEqual(expect.arrayContaining(expectedFiles));
  });
});
