const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { noticeOfReceiptOfPetition } = require('./noticeOfReceiptOfPetition');
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';

describe('noticeOfReceiptOfPetition', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Notice_Receipt_Petition.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return noticeOfReceiptOfPetition({
        applicationContext,
        data: {
          address: {
            address1: '123 Some St.',
            city: 'Somecity',
            country: '',
            name: 'Test Petitioner',
            postalCode: '80008',
            state: 'ZZ',
          },
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          preferredTrialCity: 'Birmingham, Alabama',
          receivedAtFormatted: 'December 1, 2019',
          servedDate: 'June 3, 2020',
        },
      });
    },
    testDescription:
      'generates a Notice of Receipt of Petition document with a country included',
  });
});
