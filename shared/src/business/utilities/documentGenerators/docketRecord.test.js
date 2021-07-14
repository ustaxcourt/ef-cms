const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const {
  PARTY_TYPES,
  SERVED_PARTIES_CODES,
} = require('../../entities/EntityConstants');
const { docketRecord } = require('./docketRecord');

describe('documentGenerators', () => {
  const testOutputPath = path.resolve(
    __dirname,
    '../../../../test-output/document-generation',
  );

  const writePdfFile = (name, data) => {
    const pdfPath = `${testOutputPath}/${name}.pdf`;
    fs.writeFileSync(pdfPath, data);
  };

  beforeAll(() => {
    if (process.env.PDF_OUTPUT) {
      fs.mkdirSync(testOutputPath, { recursive: true }, err => {
        if (err) throw err;
      });

      applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor.mockImplementation(
          generatePdfFromHtmlInteractor,
        );
    }
  });

  describe('docketRecord', () => {
    it('Generates a Printable Docket Record document', async () => {
      const pdf = await docketRecord({
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
              servedPartiesCode: SERVED_PARTIES_CODES.BOTH,
            },
          ],
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Docket_Record', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });
});
