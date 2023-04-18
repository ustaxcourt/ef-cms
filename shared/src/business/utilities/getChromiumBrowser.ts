exports.getChromiumBrowser = async () => {
  const puppeteer = require('puppeteer');
  return await puppeteer.launch();
};

// exports.getChromiumBrowserAWS = async () => {
//   const chromium = require('@sparticuz/chromium');
//   const puppeteer = require('puppeteer');
//   return await puppeteer.launch({
//     args: chromium.args,
//     defaultViewport: chromium.defaultViewport,
//     executablePath: await chromium.executablePath(),
//     headless: chromium.headless,
//   });
// };
