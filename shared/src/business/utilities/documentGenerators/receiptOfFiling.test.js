import { OBJECTIONS_OPTIONS_MAP } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { receiptOfFiling } from './receiptOfFiling';

describe('receiptOfFiling', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Receipt_of_Filing.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      receiptOfFiling({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          document: {
            attachments: true,
            certificateOfService: true,
            certificateOfServiceDate: '02/22/20',
            documentTitle: 'Primary Document Title',
            objections: OBJECTIONS_OPTIONS_MAP.NO,
          },
          filedAt: '02/22/20 2:22am ET',
          filedBy: 'Mike Wazowski',
          secondaryDocument: {
            attachments: false,
            certificateOfService: true,
            certificateOfServiceDate: '02/22/20',
            documentTitle: 'Secondary Document Title',
            objections: OBJECTIONS_OPTIONS_MAP.NO,
          },
          secondarySupportingDocuments: [
            {
              attachments: true,
              certificateOfService: false,
              certificateOfServiceDate: null,
              documentTitle: 'Secondary Supporting Document One Title',
              objections: OBJECTIONS_OPTIONS_MAP.NO,
            },
            {
              attachments: false,
              certificateOfService: false,
              certificateOfServiceDate: null,
              documentTitle: 'Secondary Supporting Document Two Title',
              objections: OBJECTIONS_OPTIONS_MAP.UNKNOWN,
            },
          ],
          supportingDocuments: [
            {
              attachments: false,
              certificateOfService: false,
              certificateOfServiceDate: null,
              documentTitle: 'Supporting Document One Title',
              objections: null,
            },
            {
              attachments: false,
              certificateOfService: true,
              certificateOfServiceDate: '02/02/20',
              documentTitle: 'Supporting Document Two Title',
              objections: OBJECTIONS_OPTIONS_MAP.NO,
            },
          ],
        },
      }),
    testDescription: 'generates a Receipt of Filing document',
  });
});
