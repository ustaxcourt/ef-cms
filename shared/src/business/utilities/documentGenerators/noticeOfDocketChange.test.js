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
const { noticeOfDocketChange } = require('./noticeOfDocketChange');

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

  describe('noticeOfDocketChange', () => {
    it('generates a Notice of Docket Change document', async () => {
      const pdf = await noticeOfDocketChange({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketEntryIndex: '1',
          docketNumberWithSuffix: '123-45S',
          filingsAndProceedings: {
            after: 'Filing and Proceedings After',
            before: 'Filing and Proceedings Before',
          },
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Notice_Of_Docket_Change', pdf);
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
