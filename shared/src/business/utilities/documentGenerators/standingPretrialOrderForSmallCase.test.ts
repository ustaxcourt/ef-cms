import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { standingPretrialOrderForSmallCase } from './standingPretrialOrderForSmallCase';

describe('standingPretrialOrderForSmallCase', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Standing_Pretrial_Order_For_Small_Case.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      standingPretrialOrderForSmallCase({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Test Petitioner, Another Petitioner, and Yet Another Petitioner',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            address1: '123 Some St.',
            address2: '3rd Floor',
            address3: 'Suite B',
            city: 'Some City',
            courthouseName: 'Hall of Justice',
            fullStartDate: 'Friday May 8, 2020',
            judge: {
              name: 'Test Judge',
            },
            postalCode: '12345',
            startDay: 'Friday',
            startTime: '10:00am',
            state: 'AL',
          },
        },
      }),
    testDescription:
      'generates a Standing Pre-trial Order for Small Case document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Standing_Pretrial_Order_For_Small_Case.pdf',
    pageNumber: 2,
    pdfGenerateFunction: () =>
      standingPretrialOrderForSmallCase({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Test Petitioner, Another Petitioner, and Yet Another Petitioner',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            address1: '123 Some St.',
            address2: '3rd Floor',
            address3: 'Suite B',
            city: 'Some City',
            courthouseName: 'Hall of Justice',
            fullStartDate: 'Friday May 8, 2020',
            judge: {
              name: 'Test Judge',
            },
            postalCode: '12345',
            startDay: 'Friday',
            startTime: '10:00am',
            state: 'AL',
          },
        },
      }),
    testDescription:
      'generates a Standing Pre-trial Order for Small Case document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Standing_Pretrial_Order_For_Small_Case.pdf',
    pageNumber: 3,
    pdfGenerateFunction: () =>
      standingPretrialOrderForSmallCase({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Test Petitioner, Another Petitioner, and Yet Another Petitioner',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            address1: '123 Some St.',
            address2: '3rd Floor',
            address3: 'Suite B',
            city: 'Some City',
            courthouseName: 'Hall of Justice',
            fullStartDate: 'Friday May 8, 2020',
            judge: {
              name: 'Test Judge',
            },
            postalCode: '12345',
            startDay: 'Friday',
            startTime: '10:00am',
            state: 'AL',
          },
        },
      }),
    testDescription:
      'generates a Standing Pre-trial Order for Small Case document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Standing_Pretrial_Order_For_Small_Case.pdf',
    pageNumber: 4,
    pdfGenerateFunction: () =>
      standingPretrialOrderForSmallCase({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Test Petitioner, Another Petitioner, and Yet Another Petitioner',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            address1: '123 Some St.',
            address2: '3rd Floor',
            address3: 'Suite B',
            city: 'Some City',
            courthouseName: 'Hall of Justice',
            fullStartDate: 'Friday May 8, 2020',
            judge: {
              name: 'Test Judge',
            },
            postalCode: '12345',
            startDay: 'Friday',
            startTime: '10:00am',
            state: 'AL',
          },
        },
      }),
    testDescription:
      'generates a Standing Pre-trial Order for Small Case document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Standing_Pretrial_Order_For_Small_Case.pdf',
    pageNumber: 5,
    pdfGenerateFunction: () =>
      standingPretrialOrderForSmallCase({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Test Petitioner, Another Petitioner, and Yet Another Petitioner',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            address1: '123 Some St.',
            address2: '3rd Floor',
            address3: 'Suite B',
            city: 'Some City',
            courthouseName: 'Hall of Justice',
            fullStartDate: 'Friday May 8, 2020',
            judge: {
              name: 'Test Judge',
            },
            postalCode: '12345',
            startDay: 'Friday',
            startTime: '10:00am',
            state: 'AL',
          },
        },
      }),
    testDescription:
      'generates a Standing Pre-trial Order for Small Case document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Standing_Pretrial_Order_For_Small_Case.pdf',
    pageNumber: 6,
    pdfGenerateFunction: () =>
      standingPretrialOrderForSmallCase({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Test Petitioner, Another Petitioner, and Yet Another Petitioner',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            address1: '123 Some St.',
            address2: '3rd Floor',
            address3: 'Suite B',
            city: 'Some City',
            courthouseName: 'Hall of Justice',
            fullStartDate: 'Friday May 8, 2020',
            judge: {
              name: 'Test Judge',
            },
            postalCode: '12345',
            startDay: 'Friday',
            startTime: '10:00am',
            state: 'AL',
          },
        },
      }),
    testDescription:
      'generates a Standing Pre-trial Order for Small Case document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Standing_Pretrial_Order_For_Small_Case.pdf',
    pageNumber: 7,
    pdfGenerateFunction: () =>
      standingPretrialOrderForSmallCase({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Test Petitioner, Another Petitioner, and Yet Another Petitioner',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            address1: '123 Some St.',
            address2: '3rd Floor',
            address3: 'Suite B',
            city: 'Some City',
            courthouseName: 'Hall of Justice',
            fullStartDate: 'Friday May 8, 2020',
            judge: {
              name: 'Test Judge',
            },
            postalCode: '12345',
            startDay: 'Friday',
            startTime: '10:00am',
            state: 'AL',
          },
        },
      }),
    testDescription:
      'generates a Standing Pre-trial Order for Small Case document',
  });
});
