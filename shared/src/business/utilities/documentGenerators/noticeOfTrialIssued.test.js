const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { noticeOfTrialIssued } = require('./noticeOfTrialIssued');
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';

describe('documentGenerators', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Notice_Trial_Issued.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return noticeOfTrialIssued({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Milton Schwartz, Deceased, Neil Schwartz, Fiduciary and Ada Schwartz, Deceased, Neil Schwartz, Fiduciary, Petitioners',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            formattedJudge: 'Chief Special Trial Judge Carluzzo',
            formattedStartDate: '01/01/2001',
            formattedStartTime: '12:00 am',
            joinPhoneNumber: '444-444-4444',
            meetingId: 'sdsd',
            password: '123',
            trialLocation: 'Birmingham, Alabama',
          },
        },
      });
    },
    testDescription: 'generates a Notice of Trial Issued document',
  });
});
