const fs = require('fs');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const filesToTest = fs.readdirSync('./web-client/pa11y/pa11y-screenshots');

describe('screenshots should match', () => {
  filesToTest.forEach(filename => {
    it(`should match screenshot for ${filename}`, () => {
      const isFile =
        fs.existsSync(`./web-client/pa11y/pa11y-screenshots/${filename}`) &&
        fs
          .lstatSync(`./web-client/pa11y/pa11y-screenshots/${filename}`)
          .isFile();
      if (isFile) {
        const img1 = PNG.sync.read(
          fs.readFileSync(`./web-client/pa11y/pa11y-screenshots/${filename}`),
        );
        const img2 = PNG.sync.read(
          fs.readFileSync(
            `./web-client/pa11y/pa11y-screenshots/new/${filename}`,
          ),
        );
        const { height, width } = img1;
        const diff = new PNG({ height, width });

        const pixelDiff = pixelmatch(
          img1.data,
          img2.data,
          diff.data,
          width,
          height,
          {
            threshold: 0.1,
          },
        );

        if (pixelDiff > 0) {
          fs.writeFileSync(
            `./web-client/pa11y/pa11y-screenshots/diffs/${filename}`,
            PNG.sync.write(diff),
          );
        }

        expect(pixelDiff).toEqual(0);
      }
    });
  });
});
