const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const { documentServiceEmail } = require('./documentServiceEmail');
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

  describe('documentServiceEmail', () => {
    it('generates a DocumentServiceEmail document', async () => {
      const pdf = await documentServiceEmail({
        applicationContext,
        data: {
          caseDetail: {
            caseTitle: 'Test Case Title',
            docketNumber: '123-45',
            docketNumberWithSuffix: '123-45L',
          },
          currentDate: '2022-01-01',
          docketEntryNumber: 1,
          documentDetail: {
            documentTitle: 'Answer',
            eventCode: 'A',
            filedBy: 'Petr. Guy Fieri',
            servedAtFormatted: '02/03/2020 12:00am EST',
          },
          name: 'Guy Fieri',
          taxCourtLoginUrl: 'http://example.com/login',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Document_Service_Email', pdf);
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
