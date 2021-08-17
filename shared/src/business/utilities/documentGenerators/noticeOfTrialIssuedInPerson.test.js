const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const {
  noticeOfTrialIssuedInPerson,
} = require('./noticeOfTrialIssuedInPerson');

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

  describe('noticeOfTrialIssuedInPerson', () => {
    it('generates a Notice of Trial Issued document', async () => {
      const pdf = await noticeOfTrialIssuedInPerson({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Milton Schwartz, Deceased, Neil Schwartz, Fiduciary and Ada Schwartz, Deceased, Neil Schwartz, Fiduciary, Petitioners',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            address1: '123 Candy Cane Lane',
            address2: '22222',
            city: 'troutville',
            formattedJudge: 'Chief Special Trial Judge Carluzzo',
            formattedStartDate: '01/01/2001',
            formattedStartTime: '12:00 am',
            postalCode: 'Boise, Idaho',
            state: '33333',
            trialLocation: 'Birmingham, Alabama',
          },
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Notice_Trial_Issued', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
        const { PDFDocument } = await applicationContext.getPdfLib();
        const pdfDoc = await PDFDocument.load(new Uint8Array(pdf));
        expect(pdfDoc.getPages().length).toEqual(1);
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });
});
