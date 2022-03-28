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
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const {
  standingPretrialOrderForSmallCase,
} = require('./standingPretrialOrderForSmallCase');
const { combineTwoPdfs } = require('./combineTwoPdfs');
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
    } else {
      combineTwoPdfs.mockReturnValue(testPdfDoc);
    }

    // combineTwoPdfs.mockReturnValue(testPdfDoc);
    combineTwoPdfs.mockImplementation(async ({ firstPdf, secondPdf }) => {
      if (!process.env.PDF_OUTPUT) {
        // Do not write PDF when running on CircleCI
        return;
      }
      writePdfFile('Standing_Pretrial_Order_For_Small_Case_Page_1', firstPdf);
      writePdfFile('Standing_Pretrial_Order_For_Small_Case_Page_2', secondPdf);
    });
  });

  describe('standingPretrialOrderForSmallCase', () => {
    it('generates a Standing Pre-trial Order for Small Case document', async () => {
      await standingPretrialOrderForSmallCase({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Test Petitioner, Another Petitioner, and Yet Another Petitioner',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            address1: '123 Some St.',
            address2: '3rd Floor',
            address3: 'Suite B',
            city: 'Some City',
            courthouseName: 'Hall of Justice',
            fullStartDate: 'Friday May 8, 2020',
            judge: {
              name: 'Test Judge',
            },
            postalCode: '12345',
            startDay: 'Friday',
            startTime: '10:00am',
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
