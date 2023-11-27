import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { noticeOfChangeToInPersonProceeding } from './noticeOfChangeToInPersonProceeding';

describe('noticeOfChangeToInPersonProceeding', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Notice_Of_Change_To_In_Person_Proceeding.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return noticeOfChangeToInPersonProceeding({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Jerad Mayer',
          docketNumberWithSuffix: '123-45S',
          nameOfClerk: 'Stephanie A. Servoss',
          titleOfClerk: 'Clerk of the Court',
          trialInfo: {
            address1: 'Some Street',
            address2: 'another street',
            chambersPhoneNumber: '1-721-740-9885 x4239',
            city: 'Ancho-rage',
            courthouseName: 'McDonalds',
            formattedJudge: 'Chief Special Trial Judge Carluzzo',
            formattedStartDate: '01/01/2001',
            formattedStartTime: '12:00 am',
            judgeName: 'Judge Judy',
            state: 'Alaska',
            trialLocation: 'Birmingham, Alabama',
            zip: '33333',
          },
        },
      });
    },
    testDescription:
      'generates a Notice of Change to In Person Proceeding document',
  });
});
