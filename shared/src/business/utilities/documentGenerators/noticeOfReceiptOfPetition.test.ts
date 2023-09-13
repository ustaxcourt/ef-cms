import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { noticeOfReceiptOfPetition } from './noticeOfReceiptOfPetition';

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
    fileName: 'Notice_Receipt_Petition_Long_Address.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return noticeOfReceiptOfPetition({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner and A Second Test Petitioner',
          contact: {
            additionalName: 'Oliver Ellsworth',
            address1: '123 Some St.',
            address2: 'Building #45',
            address3: 'Apartment #56788',
            city: 'Jeffersonville',
            country: '',
            inCareOf: 'John Marshall Harlan',
            name: 'Test Petitioner',
            postalCode: '12345',
            state: 'IN',
            title: 'The Esteemed',
          },
          docketNumberWithSuffix: '764-23S',
          preferredTrialCity: 'Seattle, Washington',
          receivedAtFormatted: 'April 12, 2016',
          servedDate: 'January 19, 2018',
        },
      });
    },
    testDescription:
      'generates a Notice of Receipt of Petition document with a long address label',
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

  generateAndVerifyPdfDiff({
    fileName: 'Notice_Receipt_Petition_E_Access_Long_Address.pdf',
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
            address2: '456 Bld Avenue',
            address3: '789 Street Way',
            city: 'Whistler',
            country: 'Canada',
            hasConsentedToEService: true,
            inCareOf: 'Another Person',
            name: 'Test Petitioner',
            paperPetitionEmail: 'testing@example.com',
            postalCode: '80008',
            state: 'B.C.',
          },
          docketNumberWithSuffix: '123-45S',
          preferredTrialCity: 'Birmingham, Alabama',
          receivedAtFormatted: 'December 1, 2019',
          servedDate: 'June 3, 2020',
        },
      });
    },
    testDescription:
      'generates a Notice of Receipt of Petition document with dynamic Electronic Access section for a petitioner with a long address label',
  });
});
