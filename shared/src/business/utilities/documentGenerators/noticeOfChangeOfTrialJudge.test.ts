import {
  PROCEDURE_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { noticeOfChangeOfTrialJudge } from './noticeOfChangeOfTrialJudge';

describe('noticeOfChangeOfTrialJudge', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Notice_Of_Change_Of_Trial_Judge.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return noticeOfChangeOfTrialJudge({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Jerad Mayer',
          docketNumberWithSuffix: '123-45S',
          nameOfClerk: 'Stephanie A. Servoss',
          titleOfClerk: 'Clerk of the Court',
          trialInfo: {
            caseProcedureType: PROCEDURE_TYPES.SMALL,
            chambersPhoneNumber: '1-721-740-9885 x4239',
            docketNumber: '999-99',
            formattedStartDate: '01/01/2001',
            priorJudgeTitleWithFullName: 'Special Trial Judge Judifer Judy',
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
            startDate: '2019-08-25T05:00:00.000Z',
            trialLocation: 'Mobile, Alabama',
            trialLocationAndProceedingType: `Mobile, Alabama, ${TRIAL_SESSION_PROCEEDING_TYPES.inPerson}`,
            updatedJudgeTitleWithFullName: 'Chief Judge Lady Macbeth',
          },
        },
      });
    },
    testDescription: 'generates a Notice of Change of Trial Judge document',
  });
});
