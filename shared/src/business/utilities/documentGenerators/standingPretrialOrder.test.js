jest.mock('./combineTwoPdfs');
const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const { combineTwoPdfs } = require('./combineTwoPdfs');
const { getChromiumBrowser } = require('../getChromiumBrowser');
const { standingPretrialOrder } = require('./standingPretrialOrder');

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

    combineTwoPdfs.mockImplementation(async ({ firstPdf, secondPdf }) => {
      if (!process.env.PDF_OUTPUT) {
        // Do not write PDF when running on CircleCI
        return;
      }
      writePdfFile('Standing_Pretrial_Order_Page_1', firstPdf);
      writePdfFile('Standing_Pretrial_Order_Page_2', secondPdf);
    });
  });

  describe('standingPretrialOrder', () => {
    it('generates a Standing Pre-trial Order document', async () => {
      await standingPretrialOrder({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Test Petitioner',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            city: 'Some City',
            fullStartDate: 'Friday May 8, 2020',
            judge: {
              name: 'Test Judge',
            },
            state: 'AL',
          },
        },
      });

      //doesn't run any expects on the PDF from standingPretrialOrder because the combineTwoPdfs is mocked out

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });
});
