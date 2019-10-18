const fs = require('fs');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const filesToTest = fs.readdirSync('./web-client/pa11y/pa11y-screenshots/new');

filesToTest.forEach(filename => {
  const isNewFile =
    fs.existsSync(`./web-client/pa11y/pa11y-screenshots/new/${filename}`) &&
    fs
      .lstatSync(`./web-client/pa11y/pa11y-screenshots/new/${filename}`)
      .isFile();
  const isOldFile =
    fs.existsSync(`./web-client/pa11y/pa11y-screenshots/old/${filename}`) &&
    fs
      .lstatSync(`./web-client/pa11y/pa11y-screenshots/old/${filename}`)
      .isFile();

  if (isNewFile && isOldFile) {
    const oldImg = PNG.sync.read(
      fs.readFileSync(`./web-client/pa11y/pa11y-screenshots/old/${filename}`),
    );
    const newImg = PNG.sync.read(
      fs.readFileSync(`./web-client/pa11y/pa11y-screenshots/new/${filename}`),
    );
    const { height, width } = oldImg;
    const diff = new PNG({ height, width });

    pixelmatch(oldImg.data, newImg.data, diff.data, width, height, {
      threshold: 0.1,
    });

    fs.writeFileSync(
      `./web-client/pa11y/pa11y-screenshots/diffs/${filename}`,
      PNG.sync.write(diff),
    );
  }
});
