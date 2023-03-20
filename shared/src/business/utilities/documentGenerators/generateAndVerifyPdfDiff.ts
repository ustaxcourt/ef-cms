const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const { fromPath } = require('pdf2pic');
const { getChromiumBrowser } = require('../getChromiumBrowser');
const { PNG } = require('pngjs');

const convertPdfPageToImageFile = async ({ fileName, pageNumber }) => {
  const outputPath = './shared/test-output/document-generation';
  const storeOutputImage = fromPath(path.join(outputPath, fileName), {
    density: 100,
    format: 'png',
    height: 1000,
    saveFilename: fileName,
    savePath: './shared/test-output',
    width: 800,
  });
  await storeOutputImage(pageNumber);
  return PNG.sync.read(
    fs.readFileSync(`./shared/test-output/${fileName}.${pageNumber}.png`),
  );
};

const getImageDiff = ({ actualImage, expectedImage }) => {
  const { height, width } = actualImage;
  const diff = new PNG({ height, width });

  const pixelDifference = pixelmatch(
    actualImage.data,
    expectedImage.data,
    diff.data,
    width,
    height,
    { threshold: 0.2 },
  );

  const totalPixels = height * width;
  const percentDifference = (pixelDifference / totalPixels) * 100;

  // return percentDifference;
  return {
    imageDiff: diff,
    percentDifference,
  };
};

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

    applicationContext.getUtilities().formatNow = () => '01/15/22';
  });

  it(`${testDescription}`, async () => {
    const pdf = await pdfGenerateFunction();
    fs.writeFileSync(`${testOutputPath}/${fileName}`, pdf);

    const actualImage = await convertPdfPageToImageFile({
      fileName,
      pageNumber,
    });

    const expectedImage = PNG.sync.read(
      fs.readFileSync(
        `./shared/test-pdf-expected-images/${fileName}.${pageNumber}.png`,
      ),
    );

    const { imageDiff, percentDifference } = getImageDiff({
      actualImage,
      expectedImage,
    });

    fs.mkdirSync('./shared/test-output/diff', { recursive: true });
    fs.writeFileSync(
      `./shared/test-output/diff/${fileName}.${pageNumber}.png`,
      PNG.sync.write(imageDiff),
    );

    expect(percentDifference).toBeLessThan(0.1);
  });
};
