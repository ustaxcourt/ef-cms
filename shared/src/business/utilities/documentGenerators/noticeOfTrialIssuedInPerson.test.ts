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
    pdfGenerateFunction: () => {
      applicationContext.getUtilities().formatNow = () => '05/28/26';

      return noticeOfTrialIssuedInPerson({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner',
          caseTitle: 'John Doe',
          docketNumberWithSuffix: '123-45S',
          nameOfClerk: 'Charles G. Jeane',
          titleOfClerk: 'Clerk of the Court',
          trialInfo: {
            address1: '400 Second St., NW',
            address2: '',
            city: 'Washington',
            formattedJudge: 'Buch',
            chambersPhoneNumber: '(555) 555-5555',
            formattedStartDate: 'Monday, December 8, 2025',
            formattedStartTime: '10:00 am',
            postalCode: '20217',
            state: 'DC',
            trialLocation: 'Birmingham, Alabama',
            caseOrder: [],
            isCalendared: true,
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
            sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
            sessionStatus: SESSION_STATUS_TYPES.new,
            sessionType: SESSION_TYPES.regular,
            startDate: '2025-12-08T00:00:00Z',
            term: 'Fall',
            termYear: '2025',
            trialSessionId: '111-111-112',
            paperServicePdfs: [],
            hasNottBeenServed: false,
          },
        },
      });
    },
    testDescription: 'generates a Notice of Trial Issued document',
  });
});
