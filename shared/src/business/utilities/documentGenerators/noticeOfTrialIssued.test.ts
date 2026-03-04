import { TRIAL_SESSION_SCOPE_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { noticeOfTrialIssued } from './noticeOfTrialIssued';

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
          nameOfClerk: 'Stephanie A. Servoss',
          titleOfClerk: 'Clerk of the Court',
          trialInfo: {
            formattedJudge: 'Chief Special Trial Judge Carluzzo',
            formattedStartDate: '01/01/2001',
            formattedStartTime: '12:00 am',
            joinPhoneNumber: '444-444-4444',
            meetingId: 'sdsd',
            password: '123',
            trialLocation: 'Birmingham, Alabama',
            startDate: '2001-01-01T05:00:00.000Z',
            startTime: '2001-01-01T05:00:00.000Z',
            judge: { name: 'Carluzzo', userId: '123' },
            chambersPhoneNumber: '1-721-740-9885 x4239',
            caseOrder: [],
            hasNottBeenServed: false,
            isCalendared: true,
            proceedingType: 'In Person' as const,
            sessionType: 'Regular',
            sessionStatus: 'Scheduled',
            sessionScope: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
            term: 'Fall',
            termYear: '2020',
            trialSessionId: '123',
            paperServicePdfs: [],
          },
        },
      });
    },
    testDescription: 'generates a Notice of Trial Issued document',
  });
});
