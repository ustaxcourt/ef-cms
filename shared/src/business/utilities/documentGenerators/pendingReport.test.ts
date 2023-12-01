import { CHIEF_JUDGE } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { pendingReport } from './pendingReport';

describe('pendingReport', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Pending_Report.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      pendingReport({
        applicationContext,
        data: {
          pendingItems: [
            {
              associatedJudgeFormatted: CHIEF_JUDGE,
              caseTitle: 'Test Petitioner',
              docketNumberWithSuffix: '123-45S',
              formattedFiledDate: '02/02/20',
              formattedName: 'Order',
              formattedStatus: 'Closed',
              inConsolidatedGroup: false,
              isLeadCase: false,
            },
            {
              associatedJudgeFormatted: CHIEF_JUDGE,
              caseTitle: 'Test Petitioner',
              docketNumberWithSuffix: '123-45S',
              formattedFiledDate: '02/22/20',
              formattedName: 'Motion for a New Trial',
              formattedStatus: 'Closed',
              inConsolidatedGroup: false,
              isLeadCase: false,
            },
            {
              associatedJudgeFormatted: CHIEF_JUDGE,
              caseTitle: 'Other Petitioner',
              docketNumberWithSuffix: '321-45S',
              formattedFiledDate: '03/03/20',
              formattedName: 'Order',
              formattedStatus: 'Closed',
              inConsolidatedGroup: true,
              isLeadCase: false,
            },
            {
              associatedJudgeFormatted: CHIEF_JUDGE,
              caseTitle: 'Other Petitioner',
              docketNumberWithSuffix: '321-45S',
              formattedFiledDate: '03/23/20',
              formattedName: 'Order to Show Cause',
              formattedStatus: 'Closed',
              inConsolidatedGroup: true,
              isLeadCase: true,
            },
          ],
          subtitle: 'Chief Judge',
        },
      }),
    testDescription: 'generates a Pending Report document',
  });
});
