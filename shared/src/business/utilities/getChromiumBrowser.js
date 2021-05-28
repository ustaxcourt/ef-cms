exports.getChromiumBrowser = async () => {
  const chromium = require('chrome-aws-lambda');
  return await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
  });
};
