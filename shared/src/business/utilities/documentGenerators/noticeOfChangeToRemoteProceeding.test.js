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
          caseTitle: 'Jerad Mayer',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            chambersPhoneNumber: '1-721-740-9885 x4239',
            formattedJudge: 'Chief Special Trial Judge Carluzzo',
            formattedStartDate: '01/01/2001',
            formattedStartTime: '12:00 am',
            joinPhoneNumber: '444-444-4444',
            meetingId: 'sdsd',
            password: '123',
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
        expect(pdfDoc.getPages().length).toEqual(2);
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });
});
