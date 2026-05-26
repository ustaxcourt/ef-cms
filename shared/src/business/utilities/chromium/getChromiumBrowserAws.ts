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
      const browser = await puppeteerCore.launch({
        args: puppeteerCore.defaultArgs({
          args: chromium.args,
          headless: 'shell',
        }),
        executablePath: await chromium.executablePath(),
        headless: 'shell',
        // Security: this env object is an explicit allowlist. Do NOT widen it
        // without review. The Lambda process holds AWS credentials in env vars
        // (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN); inheriting
        // them into the Chromium subprocess would put them within reach of any
        // future renderer escape or feature change that lets user-supplied HTML
        // observe the process environment. Only pass what Chromium needs to run.
        env: {
          LD_LIBRARY_PATH: process.env.LD_LIBRARY_PATH, // be careful editing this; see 10658
          PATH: process.env.PATH,
          FONTCONFIG_PATH: process.env.FONTCONFIG_PATH,
        },
      });
      return browser;
    } catch (e) {
      getDawsonLogger().error(
        `Unable to launch chromium browser on attempt: ${i}`,
        e,
      );
      await sleep(100);
    }
  }

  throw new Error('Error: Failed to launch chromium, so cannot produce a pdf');
};
