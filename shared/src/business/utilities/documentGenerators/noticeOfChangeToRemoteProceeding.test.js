const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const {
  noticeOfChangeToRemoteProceeding,
} = require('./noticeOfChangeToRemoteProceeding');
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

  describe('noticeOfChangeToRemoteProceeding', () => {
    it('generates a Notice of Change to Remote Proceeding document', async () => {
      const pdf = await noticeOfChangeToRemoteProceeding({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle:
            'Milton Schwartz, Deceased, Neil Schwartz, Fiduciary and Ada Schwartz, Deceased, Neil Schwartz, Fiduciary, Petitioners',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            formattedJudge: 'Chief Special Trial Judge Carluzzo',
            formattedStartDate: '01/01/2001',
            formattedStartTime: '12:00 am',
            joinPhoneNumber: '444-444-4444',
            meetingId: 'sdsd',
            passcode: '123',
            trialLocation: 'Birmingham, Alabama',
          },
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Notice_Of_Change_To_Remote_Proceeding', pdf);
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
