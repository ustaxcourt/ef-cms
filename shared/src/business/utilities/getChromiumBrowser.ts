import { sleep } from '@shared/tools/helpers';
import { environment } from '@web-api/environment';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { Browser } from 'puppeteer-core';

let browser: Promise<Browser> | null = null;

const getChromiumBrowserLocal = async (): Promise<Browser> => {
  const { default: puppeteer } = await import('puppeteer');
  const theBrowser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });

  return theBrowser as unknown as Browser;
};

export const getChromiumBrowserAWS = async (): Promise<Browser> => {
  const { default: chromium } = await import('@sparticuz/chromium');
  const { default: puppeteerCore } = await import('puppeteer-core');

  for (let i = 0; i < 5; i++) {
    try {
      // There is a 1/1000 chance that launching a browser will spontaneously fail. In that event we can recover simply by retrying
      const theBrowser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless as 'shell' | boolean,
      });
      return theBrowser;
    } catch (e) {
      getLogger().error(
        `Unable to launch chromium browser on attempt: ${i}`,
        e,
      );
      await sleep(100);
    }
  }

  throw new Error('Error: Failed to launch chromium, so cannot produce a pdf');
};

export async function getChromiumBrowser(): Promise<Browser> {
  if (!browser) {
    browser =
      environment.stage === 'local'
        ? getChromiumBrowserLocal()
        : getChromiumBrowserAWS();
  }

  return await browser;
}
