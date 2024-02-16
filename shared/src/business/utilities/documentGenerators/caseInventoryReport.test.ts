import {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
} from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { caseInventoryReport } from './caseInventoryReport';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';

describe('caseInventoryReport', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Case_Inventory_Report.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return caseInventoryReport({
        applicationContext,
        data: {
          formattedCases: [
            {
              associatedJudge: 'Judge Colvin',
              caseTitle: 'rick james b',
              docketNumber: '101-20',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
              isLeadCase: true,
              status: CASE_STATUS_TYPES.closed,
            },
          ],
          reportTitle: 'General Docket - Not at Issue',
          showJudgeColumn: true,
          showStatusColumn: true,
        },
      });
    },
    testDescription: 'generates a Case Inventory Report document',
  });
});
