const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const { getChromiumBrowser } = require('../getChromiumBrowser');
const { petitionServiceEmail } = require('./petitionServiceEmail');

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

      applicationContext.getChromiumBrowser.mockImplementation(
        getChromiumBrowser,
      );

      applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor.mockImplementation(
          generatePdfFromHtmlInteractor,
        );
    }
  });

  describe('petitionServiceEmail', () => {
    it('generates a PetitionServiceEmail document', async () => {
      const pdf = await petitionServiceEmail({
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
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Petition_Service_Email', pdf);
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
