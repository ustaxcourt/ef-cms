import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { noticeOfTrialIssuedInPerson } from './noticeOfTrialIssuedInPerson';

describe('noticeOfTrialIssuedInPerson', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Notice_Trial_Issued_In_Person.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      noticeOfTrialIssuedInPerson({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Milton Schwartz, Deceased, Neil Schwartz, Fiduciary and Ada Schwartz, Deceased, Neil Schwartz, Fiduciary, Petitioners',
          docketNumberWithSuffix: '123-45S',
          nameOfClerk: 'Stephanie A. Servoss',
          titleOfClerk: 'Clerk of the Court',
          trialInfo: {
            address1: '123 Candy Cane Lane',
            address2: '22222',
            city: 'troutville',
            formattedJudge: 'Chief Special Trial Judge Carluzzo',
            formattedStartDate: '01/01/2001',
            formattedStartTime: '12:00 am',
            postalCode: 'Boise, Idaho',
            state: '33333',
            trialLocation: 'Birmingham, Alabama',
          },
        },
      }),
    testDescription: 'generates a Notice of Trial Issued document',
  });
});
