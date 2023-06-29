import { PARTIES_CODES, PARTY_TYPES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketRecord } from './docketRecord';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';

describe('docketRecord', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Docket_Record.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return docketRecord({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseDetail: {
            irsPractitioners: [
              {
                barNumber: 'PT20002',
                contact: {
                  address1: 'Address 1',
                  address2: 'Address 2',
                  address3: 'Address 3',
                  city: 'City',
                  country: 'USA',
                  phone: '234-123-4567',
                  postalCode: '12345',
                  state: 'AL',
                },
                name: 'Test IRS Practitioner',
                userId: 'abc',
              },
            ],
            partyType: PARTY_TYPES.petitioner,
            petitioners: [
              {
                address1: 'Address 1',
                address2: 'Address 2',
                address3: 'Address 3',
                city: 'City',
                contactId: '65c932cc-8ada-4c2c-9a8c-7314b05fd0c0',
                counselDetails: [{ name: 'Test Private Practitioner' }],
                country: 'USA',
                name: 'Test Petitioner',
                phone: '123-124-1234',
                postalCode: '12345',
                state: 'AL',
              },
            ],
            privatePractitioners: [
              {
                barNumber: 'PT20001',
                contact: {
                  address1: 'Address 1',
                  address2: 'Address 2',
                  address3: 'Address 3',
                  city: 'City',
                  country: 'USA',
                  phone: '234-123-4567',
                  postalCode: '12345',
                  state: 'AL',
                },
                formattedName: 'Test Private Practitioner (PT20001)',
                name: 'Test Private Practitioner',
              },
            ],
          },
          caseTitle: 'Test Petitioner',
          docketNumber: '123-45',
          docketNumberWithSuffix: '123-45S',
          entries: [
            {
              action: 'Axun',
              createdAtFormatted: '01/01/20',
              description: 'Test Description',
              eventCode: 'T',
              filedBy: 'Test Filer',
              filingsAndProceedings: 'Test Filings And Proceedings',
              index: 1,
              isNotServedDocument: false,
              isStatusServed: true,
              servedAtFormatted: '02/02/20',
              servedPartiesCode: PARTIES_CODES.BOTH,
            },
          ],
        },
      });
    },
    testDescription: 'Generates a Printable Docket Record document',
  });
});
