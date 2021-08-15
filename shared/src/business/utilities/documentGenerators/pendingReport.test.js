const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const { CHIEF_JUDGE } = require('../../entities/EntityConstants');
const { pendingReport } = require('./pendingReport');

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

  describe('pendingReport', () => {
    it('generates a Pending Report document', async () => {
      const pdf = await pendingReport({
        applicationContext,
        data: {
          pendingItems: [
            {
              associatedJudgeFormatted: CHIEF_JUDGE,
              caseTitle: 'Test Petitioner',
              docketNumberWithSuffix: '123-45S',
              formattedFiledDate: '02/02/20',
              formattedName: 'Order',
              status: 'closed',
            },
            {
              associatedJudgeFormatted: CHIEF_JUDGE,
              caseTitle: 'Test Petitioner',
              docketNumberWithSuffix: '123-45S',
              formattedFiledDate: '02/22/20',
              formattedName: 'Motion for a New Trial',
              status: 'closed',
            },
            {
              associatedJudgeFormatted: CHIEF_JUDGE,
              caseTitle: 'Other Petitioner',
              docketNumberWithSuffix: '321-45S',
              formattedFiledDate: '03/03/20',
              formattedName: 'Order',
              status: 'closed',
            },
            {
              associatedJudgeFormatted: CHIEF_JUDGE,
              caseTitle: 'Other Petitioner',
              docketNumberWithSuffix: '321-45S',
              formattedFiledDate: '03/23/20',
              formattedName: 'Order to Show Cause',
              status: 'closed',
            },
          ],
          subtitle: 'Chief Judge',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Pending_Report', pdf);
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
