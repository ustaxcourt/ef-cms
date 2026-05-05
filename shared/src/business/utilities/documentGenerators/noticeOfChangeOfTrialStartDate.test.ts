import {
  SESSION_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_SESSION_SCOPE_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { TrialSessionStartDateChangePDFInfo } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfChangeOfTrialStartDate';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { noticeOfChangeOfTrialStartDate } from '@web-api/business/utilities/documentGenerators/noticeOfChangeOfTrialStartDate';

describe('noticeOfChangeOfTrialStartDate', () => {
  const TRIAL_SESSION: TrialSessionStartDateChangePDFInfo = {
    address1: 'test_address1',
    address2: 'test_address2',
    city: 'test_city',
    courthouseName: 'test_courthouseName',
    judge: {
      name: 'test_judge_name',
      userId: 'test_judge_userId',
    },
    postalCode: 'test_postalCode',
    startDate: '2026-04-06T05:00:00.000Z',
    startTime: '15:00',
    state: 'test_state',
    trialLocation: 'test_trialLocation',
    trialSessionId: 'test_trialSessionId',
    meetingId: 'test_meetingId',
    password: 'test_password',
    caseOrder: [],
    hasNottBeenServed: false,
    isCalendared: true,
    proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
    sessionScope: TRIAL_SESSION_SCOPE_TYPES.locationBased,
    sessionStatus: '',
    sessionType: SESSION_TYPES.regular,
    term: 'Spring',
    termYear: '2026',
    paperServicePdfs: [],
  };

  generateAndVerifyPdfDiff({
    fileName: 'Notice_Of_Change_Of_Trial_Date_In_Person.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return noticeOfChangeOfTrialStartDate({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Jerad Mayer',
          docketNumberWithSuffix: '123-45S',
          previousTrialSession: {
            ...TRIAL_SESSION,
            startDate: '2026-04-13T05:00:00.000Z',
          },
          updatedTrialSession: TRIAL_SESSION,
          clerkOfTheCourtRecord: {
            name: 'Test Clerk',
            title: 'Clerk of the Court',
          },
        },
      });
    },
    testDescription:
      'generates a Notice of Change of Trial Date for In Person session document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Notice_Of_Change_Of_Trial_Date_Remote.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return noticeOfChangeOfTrialStartDate({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Jerad Mayer',
          docketNumberWithSuffix: '123-45S',
          previousTrialSession: {
            ...TRIAL_SESSION,
            startDate: '2026-04-13T05:00:00.000Z',
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
          },
          updatedTrialSession: {
            ...TRIAL_SESSION,
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.remote,
          },
          clerkOfTheCourtRecord: {
            name: 'Test Clerk',
            title: 'Clerk of the Court',
          },
        },
      });
    },
    testDescription:
      'generates a Notice of Change of Trial Date for Remote session document',
  });
});
