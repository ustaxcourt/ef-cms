const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { noticeOfDocketChange } = require('./noticeOfDocketChange');
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';

describe('noticeOfDocketChange', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Notice_Of_Docket_Change.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return noticeOfDocketChange({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketEntryIndex: '1',
          docketNumberWithSuffix: '123-45S',
          filingsAndProceedings: {
            after: 'Filing and Proceedings After',
            before: 'Filing and Proceedings Before',
          },
        },
      });
    },
    testDescription: 'generates a Notice of Docket Change document',
  });
});
