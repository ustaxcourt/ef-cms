import { Browser } from 'puppeteer-core';

export const getChromiumBrowserLocal = async (): Promise<Browser> => {
  const { default: puppeteer } = await import('puppeteer');
  const theBrowser = await puppeteer.launch({
    // Extra flags keep Chrome stable in constrained/dev-shm-poor environments (e.g. Docker/Jest)
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
      '--disable-gpu',
    ],
  });

  return theBrowser as unknown as Browser;
};
