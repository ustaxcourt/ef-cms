export const getChromiumBrowser = async () => {
  const { default: puppeteer } = await import('puppeteer');
  return await puppeteer.launch({
    args: ['--no-sandbox'],
  });
};

export const getChromiumBrowserAWS = async () => {
  // we need to import these as external dependencies to allow us to reuse the application
  // context in lambdas that DO NOT have the layer.
  const { default: chromium } = await import('@sparticuz/chromium');
  const { default: puppeteerCore } = await import('puppeteer-core');

  chromium.setGraphicsMode = false;
  return await puppeteerCore.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
};
