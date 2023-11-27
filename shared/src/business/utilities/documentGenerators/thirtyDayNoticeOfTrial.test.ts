import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { thirtyDayNoticeOfTrial } from './thirtyDayNoticeOfTrial';

describe('ThirtyDayNoticeOfTrial In Person', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Thirty_Day_Notice_Of_Trial_In_Person.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      thirtyDayNoticeOfTrial({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Davonte McGill',
          docketNumberWithSuffix: '123-45S',
          judgeName: 'Chief Special Trial Judge Carluzzo',
          nameOfClerk: 'Stephanie A. Servoss',
          proceedingType: 'In Person',
          scopeType: 'Location-based',
          titleOfClerk: 'Clerk of the Court',
          trialDate: '2022-02-15T16:52:14.080Z',
          trialLocation: {
            address1: '321 Fakey St.',
            address2: 'Apt #4',
            cityState: 'Seattle, WA',
            courthouseName: 'Hall of Justice',
            postalCode: '98346',
          },
        },
      }),
    testDescription: 'generates a Thirty Day Notice of Trial In Person, page 1',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Thirty_Day_Notice_Of_Trial_In_Person.pdf',
    pageNumber: 2,
    pdfGenerateFunction: () =>
      thirtyDayNoticeOfTrial({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Davonte McGill',
          docketNumberWithSuffix: '123-45S',
          judgeName: 'Chief Special Trial Judge Carluzzo',
          nameOfClerk: 'Stephanie A. Servoss',
          proceedingType: 'In Person',
          scopeType: 'Location-based',
          titleOfClerk: 'Clerk of the Court',
          trialDate: '2022-02-15T16:52:14.080Z',
          trialLocation: {
            address1: '321 Fakey St.',
            address2: 'Apt #4',
            cityState: 'Seattle, WA',
            courthouseName: 'Hall of Justice',
            postalCode: '98346',
          },
        },
      }),
    testDescription: 'generates a Thirty Day Notice of Trial In Person, page 2',
  });
});

describe('ThirtyDayNoticeOfTrial Standalone Remote', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Thirty_Day_Notice_Of_Trial_Standalone_Remote.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      thirtyDayNoticeOfTrial({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Davonte McGill',
          docketNumberWithSuffix: '123-45S',
          judgeName: 'Chief Special Trial Judge Carluzzo',
          nameOfClerk: 'Stephanie A. Servoss',
          proceedingType: 'Remote',
          scopeType: 'Standalone Remote',
          titleOfClerk: 'Clerk of the Court',
          trialDate: '2022-02-15T16:52:14.080Z',
          trialLocation: {},
        },
      }),
    testDescription:
      'generates a Thirty Day Notice of Trial Standalone Remote, page 1',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Thirty_Day_Notice_Of_Trial_Standalone_Remote.pdf',
    pageNumber: 2,
    pdfGenerateFunction: () =>
      thirtyDayNoticeOfTrial({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Davonte McGill',
          docketNumberWithSuffix: '123-45S',
          judgeName: 'Chief Special Trial Judge Carluzzo',
          nameOfClerk: 'Stephanie A. Servoss',
          proceedingType: 'Remote',
          scopeType: 'Standalone Remote',
          titleOfClerk: 'Clerk of the Court',
          trialDate: '2022-02-15T16:52:14.080Z',
          trialLocation: {},
        },
      }),
    testDescription:
      'generates a Thirty Day Notice of Trial Standalone Remote, page 2',
  });
});

describe('ThirtyDayNoticeOfTrial Remote', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Thirty_Day_Notice_Of_Trial_Remote.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      thirtyDayNoticeOfTrial({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Davonte McGill',
          docketNumberWithSuffix: '123-45S',
          judgeName: 'Chief Special Trial Judge Carluzzo',
          nameOfClerk: 'Stephanie A. Servoss',
          proceedingType: 'Remote',
          scopeType: 'Location-based',
          titleOfClerk: 'Clerk of the Court',
          trialDate: '2022-02-15T16:52:14.080Z',
          trialLocation: {
            cityState: 'Seattle, WA',
          },
        },
      }),
    testDescription: 'generates a Thirty Day Notice of Trial Remote, page 1',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Thirty_Day_Notice_Of_Trial_Remote.pdf',
    pageNumber: 2,
    pdfGenerateFunction: () =>
      thirtyDayNoticeOfTrial({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Davonte McGill',
          docketNumberWithSuffix: '123-45S',
          judgeName: 'Chief Special Trial Judge Carluzzo',
          nameOfClerk: 'Stephanie A. Servoss',
          proceedingType: 'Remote',
          scopeType: 'Location-based',
          titleOfClerk: 'Clerk of the Court',
          trialDate: '2022-02-15T16:52:14.080Z',
          trialLocation: {
            cityState: 'Seattle, WA',
          },
        },
      }),
    testDescription: 'generates a Thirty Day Notice of Trial Remote, page 2',
  });
});
