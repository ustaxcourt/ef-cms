exports.getChromiumBrowser = async () => {
  // Notice: this require is here to only have the lambdas that need it call it.
  // This dependency is only available on lambdas with the 'puppeteer' layer,
  // which means including it globally causes the other lambdas to fail.
  // This also needs to have the string split to cause parcel to NOT bundle this dependency,
  // which is wanted as bundling would have the dependency to not be searched for
  // and found at the layer level and would cause issues.
  // eslint-disable-next-line security/detect-non-literal-require
  const chromium = require('chrome-' + 'aws-lambda');

  return await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
  });
};
