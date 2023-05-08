import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';

let browserInstance;

export const getChromiumBrowser = async () => {
  return await puppeteer.launch({
    args: ['--no-sandbox'],
  });
};

export const getChromiumBrowserAWS = async () => {
  if (browserInstance) {
    return browserInstance;
  } else {
    browserInstance = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    return browserInstance;
  }
};
