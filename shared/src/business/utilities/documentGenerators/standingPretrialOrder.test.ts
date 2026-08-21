import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { standingPretrialOrder } from './standingPretrialOrder';

describe('standingPretrialOrder', () => {
  for (let i = 1; i <= 6; i++) {
    generateAndVerifyPdfDiff({
      fileName: 'Standing_Pretrial_Order.pdf',
      pageNumber: i,
      pdfGenerateFunction: () =>
        standingPretrialOrder({
          applicationContext,
          data: {
            caseCaptionExtension: 'Petitioner(s)',
            caseTitle: 'Test Petitioner',
            docketNumberWithSuffix: '123-45S',
            trialInfo: {
              city: 'Some City',
              fullStartDate: 'Friday May 8, 2020',
              judge: {
                name: 'Test Judge',
              },
              state: 'AL',
            },
          },
        }),
      testDescription: 'generates a Standing Pre-trial Order document',
    });
  }
});
