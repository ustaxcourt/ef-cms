const fs = require('fs');
const path = require('path');
const sass = require('sass');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
} = require('../../entities/EntityConstants');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const { caseInventoryReport } = require('./caseInventoryReport');
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

  describe('caseInventoryReport', () => {
    it('generates a Case Inventory Report document', async () => {
      const pdf = await caseInventoryReport({
        applicationContext,
        data: {
          formattedCases: [
            {
              associatedJudge: 'Judge Colvin',
              caseTitle: 'rick james b',
              docketNumber: '101-20',
              docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.LIEN_LEVY,
              status: CASE_STATUS_TYPES.closed,
            },
          ],
          reportTitle: 'General Docket - Not at Issue',
          showJudgeColumn: true,
          showStatusColumn: true,
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Case_Inventory_Report', pdf);
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
