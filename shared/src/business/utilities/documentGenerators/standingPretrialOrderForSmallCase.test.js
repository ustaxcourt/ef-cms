jest.mock('./combineTwoPdfs');
const fs = require('fs');
const path = require('path');
const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const {
  standingPretrialOrderForSmallCase,
} = require('./standingPretrialOrderForSmallCase');
const { combineTwoPdfs } = require('./combineTwoPdfs');

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

    combineTwoPdfs.mockReturnValue(testPdfDoc);
  });

  describe('standingPretrialOrderForSmallCase', () => {
    it('generates a Standing Pre-trial Order for Small Case document', async () => {
      const pdf = await standingPretrialOrderForSmallCase({
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

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Standing_Pretrial_Notice', pdf);
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
