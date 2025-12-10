import { applicationContext } from '../../test/createTestApplicationContext';
import { certificateOfService } from './certificateOfService';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';

describe('certificateOfService', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Certificate_of_Service.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return certificateOfService({
        applicationContext,
        data: {
          partyInformation: {
            name: 'John Doe',
            address1: '12345 Main St',
            address2: 'Apt 101',
            address3: 'address line 3',
            city: 'Richmond',
            state: 'VA',
            postalCode: '12345',
            country: 'United States',
          },
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
          docketNumberWithSuffix: '123-45S',
        },
      });
    },
    testDescription: 'generates a Certificate of Service document',
  });
});
