const fs = require('fs');
const path = require('path');
const sass = require('sass');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const { getChromiumBrowser } = require('../getChromiumBrowser');
const { noticeOfReceiptOfPetition } = require('./noticeOfReceiptOfPetition');

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

      applicationContext.getNodeSass.mockImplementation(() => {
        return sass;
      });

      applicationContext.getPug.mockImplementation(() => {
        return require('pug');
      });

      applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor.mockImplementation(
          generatePdfFromHtmlInteractor,
        );
    }
  });

  describe('noticeOfReceiptOfPetition', () => {
    it('generates a Notice of Receipt of Petition document', async () => {
      const pdf = await noticeOfReceiptOfPetition({
        applicationContext,
        data: {
          address: {
            address1: '123 Some St.',
            city: 'Somecity',
            countryName: '',
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

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Notice_Receipt_Petition', pdf);
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
