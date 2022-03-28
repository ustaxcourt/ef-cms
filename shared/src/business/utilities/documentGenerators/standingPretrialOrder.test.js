jest.mock('./combineTwoPdfs', () => {
  const actualModule = jest.requireActual('./combineTwoPdfs');
  return {
    combineTwoPdfs: jest.fn().mockImplementation(actualModule.combineTwoPdfs),
  };
});
const fs = require('fs');
const path = require('path');
const {
  applicationContext,
  testPdfDoc,
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
    } else {
      combineTwoPdfs.mockReturnValue(testPdfDoc);
    }
  });

  describe('standingPretrialOrder', () => {
    it('generates a Standing Pre-trial Order document', async () => {
      const pdf = await standingPretrialOrder({
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

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Standing_Pretrial_Order', pdf);
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
