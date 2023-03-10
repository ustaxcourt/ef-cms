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
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          contact: {
            address1: '123 Some St.',
            city: 'Somecity',
            country: '',
            name: 'Test Petitioner',
            postalCode: '80008',
            state: 'ZZ',
          },
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

  generateAndVerifyPdfDiff({
    fileName: 'Notice_Receipt_Petition_E_Access.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return noticeOfReceiptOfPetition({
        applicationContext,
        data: {
          accessCode: '123456',
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          contact: {
            address1: '123 Some St.',
            city: 'Somecity',
            country: '',
            hasConsentedToEService: true,
            name: 'Test Petitioner',
            paperPetitionEmail: 'testing@example.com',
            postalCode: '80008',
            state: 'ZZ',
          },
          docketNumberWithSuffix: '123-45S',
          preferredTrialCity: 'Birmingham, Alabama',
          receivedAtFormatted: 'December 1, 2019',
          servedDate: 'June 3, 2020',
        },
      });
    },
    testDescription:
      'generates a Notice of Receipt of Petition document with dynamic Electronic Access section',
  });
});
