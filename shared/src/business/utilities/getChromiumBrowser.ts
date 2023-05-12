import puppeteer from 'puppeteer';

export const getChromiumBrowser = async () => {
  return await puppeteer.launch({
    args: ['--no-sandbox'],
  });
};

export const getChromiumBrowserAWS = async () => {};
