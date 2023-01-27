const fs = require('fs');
const path = require('path');
const pixelmatch = require('pixelmatch');
const { fromPath } = require('pdf2pic');
const { PNG } = require('pngjs');

const outputPath = './shared/test-output/document-generation';

export const verifyPdfAgainstExpected = async ({ fileName, pageNumber }) => {
  const storeOutputImage = fromPath(path.join(outputPath, fileName), {
    density: 100,
    format: 'png',
    height: 1000,
    saveFilename: fileName,
    savePath: './shared/test-output',
    width: 800,
  });
  await storeOutputImage(pageNumber);

  const actualImage = PNG.sync.read(
    fs.readFileSync(`./shared/test-output/${fileName}.${pageNumber}.png`),
  );
  const expectedImage = PNG.sync.read(
    fs.readFileSync(
      `./shared/test-pdf-expected-images/${fileName}.${pageNumber}.png`,
    ),
  );

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

  fs.mkdirSync('./shared/test-output/diff', { recursive: true });
  fs.writeFileSync(
    `./shared/test-output/diff/${fileName}.${pageNumber}.png`,
    PNG.sync.write(diff),
  );

  expect(percentDifference).toBeLessThan(0.1);
};
