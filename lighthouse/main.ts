import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';
const lighthouse = require('lighthouse/core/index.cjs');

const main = async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options: any = {
    logLevel: 'info',
    onlyCategories: ['accessibility'],
    output: 'html',
    port: chrome.port,
  };
  const runnerResult = await lighthouse('http://localhost:1234/login', options);

  // `.report` is the HTML report as a string
  const reportHtml = runnerResult.report;
  fs.writeFileSync('lhreport.html', reportHtml);

  // `.lhr` is the Lighthouse Result as a JS object
  console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);

  chrome.kill();
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
