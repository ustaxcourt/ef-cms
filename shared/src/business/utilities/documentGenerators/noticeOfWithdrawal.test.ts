import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { noticeOfWithdrawal } from './noticeOfWithdrawal';

describe('noticeOfWithdrawal', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Notice_of_Withdrawal.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return noticeOfWithdrawal({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner',
          caseTitle: 'John Doe, et al',
          docketNumberWithSuffix: '123-45S',
          filers: ['John Doe', 'Jane Doe'],
          practitionerInformation: {
            contact: {
              address1: '23456 Side St',
              address2: 'Suite 202',
              address3: 'address line 3',
              city: 'Arlington',
              state: 'VA',
              postalCode: '23456',
              country: 'United States',
              countryType: 'domestic',
              phone: '555-123-4567',
            },
            barNumber: 'AB1234',
            email: 'janesmith@example.com',
            name: 'Jane Smith',
          },
        },
      });
    },
    testDescription: 'generates a Notice of Withdrawal document',
  });
});
