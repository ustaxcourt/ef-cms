import chromium from '@sparticuz/chrome-aws-lambda';

export const getChromiumBrowser = async () => {
  return await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
  });
};
