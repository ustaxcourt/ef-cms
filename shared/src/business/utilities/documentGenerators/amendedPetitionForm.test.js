const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const { amendedPetitionForm } = require('./amendedPetitionForm');
const { getChromiumBrowser } = require('../getChromiumBrowser');

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

  describe('amendedPetitionForm', () => {
    it('generates an Address Label Cover Sheet document', async () => {
      const pdf = await amendedPetitionForm({
        applicationContext,
        data: '',
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Amended_Petition_Form', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
    });
  });
});
