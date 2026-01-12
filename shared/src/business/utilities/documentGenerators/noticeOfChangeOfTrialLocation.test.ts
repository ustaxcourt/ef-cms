import { TrialSessionLocationChangePDFInfo } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfChangeOfTrialLocation';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { noticeOfChangeOfTrialLocation } from '@shared/business/utilities/documentGenerators/noticeOfChangeOfTrialLocation';

describe('noticeOfChangeOfTrialLocation', () => {
  const TRIAL_SESSION: TrialSessionLocationChangePDFInfo = {
    address1: 'test_address1',
    address2: 'test_address2',
    city: 'test_city',
    courthouseName: 'test_courthouseName',
    judge: {
      name: 'test_judge_name',
      userId: 'test_judge_userId',
    },
    postalCode: 'test_postalCode',
    startDate: '2019-12-02T05:00:00.000Z',
    state: 'test_state',
    trialLocation: 'test_trialLocation',
    trialSessionId: 'test_trialSessionId',
  };

  generateAndVerifyPdfDiff({
    fileName: 'Notice_Of_Change_Of_Trial_Location.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return noticeOfChangeOfTrialLocation({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Jerad Mayer',
          docketNumberWithSuffix: '123-45S',
          previousTrialSession: {
            ...TRIAL_SESSION,
            trialLocation: 'old_test_trialLocation',
          },
          updatedTrialSession: TRIAL_SESSION,
        },
      });
    },
    testDescription: 'generates a Notice of Change of Trial Location document',
  });
});
