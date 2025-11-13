import { sleep } from '@shared/tools/helpers';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { Browser } from 'puppeteer-core';

export const getChromiumBrowserAWS = async (): Promise<Browser> => {
  // we need to import these as external dependencies to allow us to reuse the application
  // context in lambdas that DO NOT have the layer.

  const { default: chromium } = await import('@sparticuz/chromium');
  const { default: puppeteerCore } = await import('puppeteer-core');

  for (let i = 0; i < 5; i++) {
    try {
      // There is a 1/1000 chance that launching a browser will spontaneously fail. In that event we can recover simply by retrying
      const theBrowser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: {
          deviceScaleFactor: 1,
          hasTouch: false,
          height: 1080,
          isLandscape: true,
          isMobile: false,
          width: 1920,
        },
        dumpio: true,
        executablePath: await chromium.executablePath(
          'https://github.com/Sparticuz/chromium/releases/download/v141.0.0/chromium-v141.0.0-pack.x64.tar',
        ),
        headless: 'shell',
        env: {
          LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH, // be careful editing this; see 10658
          PATH: process.env.PATH,
          FONTCONFIG_PATH: process.env.FONTCONFIG_PATH,
        },
      });
      return theBrowser;
    } catch (e) {
      getDawsonLogger().error(
        `Unable to launch chromium browser on attempt: ${i}`,
        e,
      );
      getDawsonLogger().error(
        `${JSON.stringify({
          args: chromium.args,
          defaultViewport: {
            deviceScaleFactor: 1,
            hasTouch: false,
            height: 1080,
            isLandscape: true,
            isMobile: false,
            width: 1920,
          },
          executablePath: await chromium.executablePath(),
          headless: 'shell',
          env: {
            LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH, // be careful editing this; see 10658
            PATH: process.env.PATH,
            FONTCONFIG_PATH: process.env.FONTCONFIG_PATH,
          },
        })}`,
        e,
      );
      await sleep(100);
    }
  }

  throw new Error('Error: Failed to launch chromium, so cannot produce a pdf');
};
