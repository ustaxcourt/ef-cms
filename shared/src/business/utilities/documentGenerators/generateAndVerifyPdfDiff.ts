import { PNG } from 'pngjs';
import { applicationContext } from '../../test/createTestApplicationContext';
import { fromPath } from 'pdf2pic';
import { generatePdfFromHtmlHelper } from '../../../../../web-api/src/business/useCaseHelper/generatePdfFromHtmlHelper';
import { generatePdfFromHtmlInteractor } from '../../../../../web-api/src/business/useCases/pdf/generatePdfFromHtmlInteractor';
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

const cropImage = ({
  height,
  image,
  width,
}: {
  height: number;
  image: PNG;
  width: number;
}): PNG => {
  // Cropped from (0, 0) (the top left) to (width, height)
  const cropped = new PNG({ height, width });
  PNG.bitblt(image, cropped, 0, 0, width, height, 0, 0);
  return cropped;
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
  croppedHeight,
  croppedWidth,
  fileName,
  pageNumber,
  pdfGenerateFunction,
  testDescription,
}: {
  croppedHeight?: number;
  croppedWidth?: number;
  fileName: string;
  pageNumber: number;
  pdfGenerateFunction: any; // TODO
  testDescription: string;
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

    let actualImage = await convertPdfPageToImageFile({
      fileName,
      pageNumber,
    });

    let expectedImage = PNG.sync.read(
      fs.readFileSync(
        `./shared/test-pdf-expected-images/${fileName}.${pageNumber}.png`,
      ),
    );

    const shouldCropImage = croppedWidth || croppedHeight;
    if (shouldCropImage) {
      const width = croppedWidth || actualImage.width;
      const height = croppedHeight || actualImage.height;
      actualImage = cropImage({ height, image: actualImage, width });
      expectedImage = cropImage({ height, image: expectedImage, width });
    }

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
