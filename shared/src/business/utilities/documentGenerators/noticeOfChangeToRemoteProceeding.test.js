const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  noticeOfChangeToRemoteProceeding,
} = require('./noticeOfChangeToRemoteProceeding');
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';

describe('noticeOfChangeToRemoteProceeding', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Notice_Of_Change_To_Remote_Proceeding.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return noticeOfChangeToRemoteProceeding({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Jerad Mayer',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            chambersPhoneNumber: '1-721-740-9885 x4239',
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
    testDescription:
      'generates a Notice of Change to Remote Proceeding document',
  });
});
