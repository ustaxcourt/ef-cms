const fs = require('fs');
const path = require('path');
const sass = require('sass');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');
const { getChromiumBrowser } = require('../getChromiumBrowser');
const { practitionerCaseList } = require('./practitionerCaseList');

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

  describe('practitionerCaseList', () => {
    it('generates a Pending Report document', async () => {
      const pdf = await practitionerCaseList({
        applicationContext,
        data: {
          barNumber: 'PT1234',
          closedCases: [
            {
              caseTitle: 'Test Closed Case 1',
              docketNumberWithSuffix: '123-45S',
              status: CASE_STATUS_TYPES.closed,
            },
            {
              caseTitle: 'Test Closed Case 2',
              docketNumberWithSuffix: '223-45S',
              status: CASE_STATUS_TYPES.closed,
            },
          ],
          openCases: [
            {
              caseTitle: 'Test Open Case 1',
              docketNumberWithSuffix: '323-45S',
              status: CASE_STATUS_TYPES.generalDocket,
            },
          ],
          practitionerName: 'Ben Matlock',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Practitioner_Case_List', pdf);
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
