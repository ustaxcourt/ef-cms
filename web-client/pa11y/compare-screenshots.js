const fs = require('fs');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');

const screenshotsPath = './pa11y-screenshots';

const filesToTest = fs.readdirSync(`${screenshotsPath}/new`);

console.log(`Comparing ${filesToTest.length} screenshots`);

filesToTest.forEach(filename => {
  console.log(filename);
  const newFilePath = `${screenshotsPath}/new/${filename}`;
  const oldFilePath = `${screenshotsPath}/old/${filename}`;

  const isNewFile =
    fs.existsSync(newFilePath) && fs.lstatSync(newFilePath).isFile();
  const isOldFile =
    fs.existsSync(oldFilePath) && fs.lstatSync(oldFilePath).isFile();

  if (isNewFile && isOldFile) {
    const oldImg = PNG.sync.read(fs.readFileSync(oldFilePath));
    const newImg = PNG.sync.read(fs.readFileSync(newFilePath));
    const { height, width } = oldImg;
    const diff = new PNG({ height, width });

    pixelmatch(oldImg.data, newImg.data, diff.data, width, height, {
      threshold: 0.1,
    });

    fs.writeFileSync(
      `${screenshotsPath}/diffs/${filename}`,
      PNG.sync.write(diff),
    );
  }
});

console.log(
  'Comparison complete - diffs are at web-client/pa11y/pa11y-screenshots/diffs',
);
