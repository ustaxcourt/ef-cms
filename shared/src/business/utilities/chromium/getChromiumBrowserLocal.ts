import { Browser } from 'puppeteer-core';

export const getChromiumBrowserLocal = async (): Promise<Browser> => {
  const { default: puppeteer } = await import('puppeteer');
  const theBrowser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });

  return theBrowser as unknown as Browser;
};
