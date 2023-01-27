const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const { getChromiumBrowser } = require('../getChromiumBrowser');
const { verifyPdfAgainstExpected } = require('./verifyPdfAgainstExpected');

export const generateAndVerifyPdfDiff = ({
  fileName,
  pageNumber,
  pdfGenerateFunction,
  testDescription,
}) => {
  const testOutputPath = path.resolve(
    __dirname,
    '../../../../test-output/document-generation',
  );

  const writePdfFile = data => {
    fs.writeFileSync(`${testOutputPath}/${fileName}`, data);
  };

  beforeAll(() => {
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
  });

  it(`${testDescription}`, async () => {
    const pdf = await pdfGenerateFunction();

    writePdfFile(pdf);

    await verifyPdfAgainstExpected({
      fileName,
      pageNumber,
    });
  });
};
