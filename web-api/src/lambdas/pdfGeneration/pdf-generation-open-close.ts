import { logLambdaStats } from '@web-api/lambdas/pdfGeneration/lambdaStats';

export const openAndCloseAlot = async () => {
  logLambdaStats('About to get chromium browser');
  try {
    for (let index = 0; index < 30; index++) {
      const browser = await getChromiumBrowserAWS();
      logLambdaStats(`Created chromium browser ${index}`);
      await Promise.race([browser.close(), browser.close(), browser.close()]);
      logLambdaStats(`closed browser ${index}`);
    }
  } catch (err) {
    logLambdaStats('launch error');
    throw err;
  }
  logLambdaStats('exiting');
};

const getChromiumBrowserAWS = async () => {
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
