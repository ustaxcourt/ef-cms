import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { standingSchedulingOrder } from '@web-api/business/utilities/documentGenerators/standingSchedulingOrder';

describe('standingSchedulingOrder', () => {
  for (let pageNumber = 1; pageNumber <= 4; pageNumber++) {
    generateAndVerifyPdfDiff({
      fileName: 'Standing_Scheduling_Order.pdf',
      pageNumber,
      pdfGenerateFunction: () =>
        standingSchedulingOrder({
          applicationContext,
          data: {
            caseCaptionExtension: 'Petitioner',
            caseTitle: 'Test Petitioner',
            docketNumberWithSuffix: '123-45L',
            trialInfo: {
              chambersPhoneNumber: '(202) 521-0810',
              formattedDueDate: 'May 18, 2026',
              formattedDueDateWithDayOfWeek: 'Monday, May 18, 2026',
              formattedJudgeName: 'Judge Test Judge',
              formattedServedDate: '05/15/26',
              trialLocation: 'San Diego, California',
            },
          },
        }),
      testDescription: `generates page ${pageNumber} of a Standing Scheduling Order document`,
    });
  }
});
