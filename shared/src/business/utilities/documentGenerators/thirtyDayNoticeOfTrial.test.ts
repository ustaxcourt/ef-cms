import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { thirtyDayNoticeOfTrial } from './thirtyDayNoticeOfTrial';

describe('thirtyDayNoticeOfTrial', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Thirty_Day_Notice_Of_Trial.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      thirtyDayNoticeOfTrial({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Davonte McGill',
          docketNumberWithSuffix: '123-45S',
          judgeName: 'Chief Special Trial Judge Carluzzo',
          trialDate: '2022-02-15T16:52:14.080Z',
          trialLocation: {
            address1: '321 Fakey St.',
            address2: 'Apt #4',
            city: 'Seattle',
            courthouseName: 'Hall of Justice',
            isInPerson: true,
            postalCode: '98346',
            state: 'WA',
          },
        },
      }),
    testDescription: 'generates a Thirty Day Notice of Trial document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Thirty_Day_Notice_Of_Trial.pdf',
    pageNumber: 2,
    pdfGenerateFunction: () =>
      thirtyDayNoticeOfTrial({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Davonte McGill',
          docketNumberWithSuffix: '123-45S',
          judgeName: 'Chief Special Trial Judge Carluzzo',
          trialDate: '2022-02-15T16:52:14.080Z',
          trialLocation: {
            address1: '321 Fakey St.',
            address2: 'Apt #4',
            city: 'Seattle',
            courthouseName: 'Hall of Justice',
            isInPerson: true,
            postalCode: '98346',
            state: 'WA',
          },
        },
      }),
    testDescription: 'generates a Thirty Day Notice of Trial document, page 2',
  });
});
