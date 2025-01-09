import { TrialSessionLocationChangePDFInfo } from '@shared/business/utilities/pdfGenerator/documentTemplates/NoticeOfChangeOfTrialLocation';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { noticeOfChangeOfTrialLocation } from '@shared/business/utilities/documentGenerators/noticeOfChangeOfTrialLocation';

describe('noticeOfChangeOfTrialLocation', () => {
  const TRIAL_SESSION = {
    trialSessionId: 'abc123',
  } as TrialSessionLocationChangePDFInfo;

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
          trialSession: TRIAL_SESSION,
        },
      });
    },
    testDescription: 'generates a Notice of Change of Trial Judge document',
  });
});
