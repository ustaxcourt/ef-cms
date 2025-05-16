import { environment } from '@web-api/environment';
import { Browser } from 'puppeteer-core';

let browser: Promise<Browser> | null = null;

const getChromiumBrowserLocal = async (): Promise<Browser> => {
  const { default: puppeteer } = await import('puppeteer');
  const theBrowser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });

  return theBrowser as unknown as Browser;
};

const getChromiumBrowserAWS = async (): Promise<Browser> => {
  // we need to import these as external dependencies to allow us to reuse the application
  // context in lambdas that DO NOT have the layer.

  const { default: chromium } = await import('@sparticuz/chromium');
  const { default: puppeteerCore } = await import('puppeteer-core');

  return await puppeteerCore.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless as 'shell' | boolean,
  });
};

export async function getChromiumBrowser(
  {
    resetSingleton = false,
  }: {
    resetSingleton?: boolean;
  } = { resetSingleton: false },
): Promise<Browser> {
  if (!browser || resetSingleton) {
    browser =
      environment.stage === 'local'
        ? getChromiumBrowserLocal()
        : getChromiumBrowserAWS();
  }

  return await browser;
}
