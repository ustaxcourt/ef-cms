import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';

export const getChromiumBrowser = async () => {
  return await puppeteer.launch({
    args: ['--no-sandbox'],
  });
};

export const getChromiumBrowserAWS = async () => {
  chromium.setHeadlessMode = true;
  chromium.setGraphicsMode = false;
  return await puppeteerCore.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
  });
};
