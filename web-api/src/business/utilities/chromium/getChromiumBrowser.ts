import { getChromiumBrowserAWS } from '@shared/business/utilities/chromium/getChromiumBrowserAws';
import { getChromiumBrowserLocal } from '@shared/business/utilities/chromium/getChromiumBrowserLocal';
import { environment } from '@web-api/environment';
import { Browser } from 'puppeteer-core';

let browser: Promise<Browser> | null = null;

export async function getChromiumBrowser(): Promise<Browser> {
  if (!browser) {
    browser =
      environment.stage === 'local'
        ? getChromiumBrowserLocal()
        : getChromiumBrowserAWS();
  }

  return await browser;
}
