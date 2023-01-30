import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { petitionServiceEmail } from './petitionServiceEmail';

describe('petitionServiceEmail', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Petition_Service_Email.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      petitionServiceEmail({
        applicationContext,
        data: {
          caseDetail: {
            caseTitle: 'Test Case Title',
            docketNumber: '123-45',
            docketNumberWithSuffix: '123-45S',
            trialLocation: 'Birmingham, AL',
          },
          contactPrimary: {
            address1: '123 Some St',
            address2: 'Unit B',
            city: 'Somecity',
            name: 'Test Petitioner',
            phone: '1234567890',
            postalCode: '12345',
            serviceIndicator: 'Electronic',
            state: 'AL',
          },
          contactSecondary: {
            address1: '123 Some St',
            address2: 'Unit B',
            city: 'Somecity',
            name: 'Secondary Petitioner',
            postalCode: '12345',
            serviceIndicator: 'Paper',
            state: 'AL',
          },
          currentDate: '2022-01-01',
          docketEntryNumber: 1,
          documentDetail: {
            docketEntryId: '1234',
            documentTitle: 'Petition',
            eventCode: 'P',
            filingDate: '02/05/20',
            formattedMailingDate: '02/02/20',
            servedAtFormatted: '02/03/2020 12:00am EST',
          },
          practitioners: [
            {
              address1: '999 Legal Way',
              barNumber: 'OP20001',
              city: 'Somecity',
              email: 'practitioner.one@example.com',
              name: 'Practitioner One',
              phoneNumber: '123-123-1234',
              postalCode: '12345',
              representingFormatted: 'Test Petitioner',
              state: 'AL',
            },
            {
              address1: '543 Barrister Ct',
              barNumber: 'TP20001',
              city: 'Somecity',
              email: 'practitioner.one@example.com',
              name: 'Practitioner Two',
              phoneNumber: '123-123-4321',
              postalCode: '12345',
              representingFormatted: 'Secondary Petitioner',
              state: 'AL',
            },
          ],
          taxCourtLoginUrl: 'http://example.com/login',
        },
      }),
    testDescription: 'generates a PetitionServiceEmail document',
  });
});
