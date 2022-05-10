const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const {
  PROCEDURE_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const { getChromiumBrowser } = require('../getChromiumBrowser');
const { noticeOfChangeOfTrialJudge } = require('./noticeOfChangeOfTrialJudge');

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

  describe('noticeOfChangeOfTrialJudge', () => {
    it('generates a Notice of Change of Trial Judge document', async () => {
      const pdf = await noticeOfChangeOfTrialJudge({
        applicationContext,
        data: {
          caseCaptionExtension: 'Petitioner(s)',
          caseTitle: 'Jerad Mayer',
          docketNumberWithSuffix: '123-45S',
          trialInfo: {
            caseProcedureType: PROCEDURE_TYPES.SMALL,
            chambersPhoneNumber: '1-721-740-9885 x4239',
            docketNumber: '999-99',
            formattedStartDate: '01/01/2001',
            priorJudgeTitleWithFullName: 'Special Trial Judge Judifer Judy',
            proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
            startDate: '2019-08-25T05:00:00.000Z',
            trialLocation: 'Mobile, Alabama',
            updatedJudgeTitleWithFullName: 'Chief Judge Lady Macbeth',
          },
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Notice_Of_Change_Of_Trial_Judge', pdf);
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
