import { CASE_STATUS_TYPES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { practitionerCaseList } from './practitionerCaseList';

describe('practitionerCaseList', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Practitioner_Case_List.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      practitionerCaseList({
        applicationContext,
        data: {
          barNumber: 'PT1234',
          closedCases: [
            {
              caseTitle: 'Test Closed Case 1',
              docketNumberWithSuffix: '123-45S',
              status: CASE_STATUS_TYPES.closed,
            },
            {
              caseTitle: 'Test Closed Case 2',
              docketNumberWithSuffix: '223-45S',
              status: CASE_STATUS_TYPES.closed,
            },
          ],
          openCases: [
            {
              caseTitle: 'Test Open Case 1',
              docketNumberWithSuffix: '323-45S',
              status: CASE_STATUS_TYPES.generalDocket,
            },
          ],
          practitionerName: 'Ben Matlock',
        },
      }),
    testDescription: 'generates a Petitioner case list document',
  });
});
