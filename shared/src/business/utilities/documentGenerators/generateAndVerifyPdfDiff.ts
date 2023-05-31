import { PNG } from 'pngjs';
import { applicationContext } from '../../test/createTestApplicationContext';
import { fromPath } from 'pdf2pic';
import { generatePdfFromHtmlHelper } from '../../useCaseHelper/generatePdfFromHtmlHelper';
import { generatePdfFromHtmlInteractor } from '../../useCases/generatePdfFromHtmlInteractor';
import { getChromiumBrowser } from '../getChromiumBrowser';
import fs from 'fs';
import path from 'path';
import pixelmatch from 'pixelmatch';

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
    fs.mkdirSync(testOutputPath, { recursive: true });

    applicationContext.getChromiumBrowser = getChromiumBrowser as any;

    applicationContext.getUseCaseHelpers().generatePdfFromHtmlHelper =
      generatePdfFromHtmlHelper;

    applicationContext.getUseCases().generatePdfFromHtmlInteractor =
      generatePdfFromHtmlInteractor as any;

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
