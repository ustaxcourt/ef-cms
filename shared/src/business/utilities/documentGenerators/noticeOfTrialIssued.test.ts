import { TRIAL_SESSION_SCOPE_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { noticeOfTrialIssued } from './noticeOfTrialIssued';

describe('documentGenerators', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Notice_Trial_Issued.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      applicationContext.getUtilities().formatNow = () => '05/28/26';

      return noticeOfTrialIssued({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner',
          caseTitle: 'John Doe',
          docketNumberWithSuffix: '123-45S',
          nameOfClerk: 'Charles G. Jeane',
          titleOfClerk: 'Clerk of the Court',
          trialInfo: {
            formattedJudge: 'Buch',
            formattedStartDate: 'Monday, December 8, 2025',
            formattedStartTime: '10:00 am',
            joinPhoneNumber: '(202) 521-4611',
            meetingId: '123456',
            password: '22222',
            trialLocation: 'Birmingham, Alabama',
            startDate: '2025-12-08T05:00:00.000Z',
            startTime: '2025-12-08T10:00:00.000Z',
            judge: { name: 'Buch', userId: '123' },
            chambersPhoneNumber: '(555) 555-5555',
            caseOrder: [],
            hasNottBeenServed: false,
            isCalendared: true,
            proceedingType: 'Remote' as const,
            sessionType: 'Regular',
            sessionStatus: 'Scheduled',
            sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
            term: 'Fall',
            termYear: '2025',
            trialSessionId: '123',
            paperServicePdfs: [],
          },
        },
      });
    },
    testDescription: 'generates a Notice of Trial Issued document',
  });
});
