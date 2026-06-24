import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '@shared/business/entities/EntityConstants';
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
          caseTitle: 'John Smith and Jane Smith',
          docketNumberWithSuffix: '123-45S',
          nameOfClerk: 'Stephanie A. Servoss',
          titleOfClerk: 'Clerk of the Court',
          trialInfo: {
            address1: '123 Candy Cane Lane',
            address2: '22222',
            city: 'Troutville',
            formattedJudge: 'Carluzzo',
            chambersPhoneNumber: '(202) 521-3339',
            formattedStartDate: '01/01/2001',
            formattedStartTime: '12:00 am',
            postalCode: 'Boise, Idaho',
            state: '33333',
            trialLocation: 'Birmingham, Alabama',
            caseOrder: [],
            isCalendared: true,
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
            sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
            sessionStatus: SESSION_STATUS_TYPES.new,
            sessionType: SESSION_TYPES.regular,
            startDate: '2001-01-01T00:00:00Z',
            term: 'Winter',
            termYear: '2001',
            trialSessionId: '111-111-112',
            paperServicePdfs: [],
            hasNottBeenServed: false,
          },
        },
      }),
    testDescription: 'generates a Notice of Trial Issued document',
  });
});
