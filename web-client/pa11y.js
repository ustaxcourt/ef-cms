'use strict';

const pa11y = require('pa11y');

runPa11y();

// Async function required for us to use await
async function runPa11y() {
  try {

    // Put together some options to use in each test
    const options = {
      standard: 'WCAG2AA',
      chromeLaunchConfig: {
        "args": ["--no-sandbox"]
      },
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    };

    // Run tests against multiple URLs
    const results = await Promise.all([
      pa11y('http://localhost:1234/', options)
      //add more urls here
    ]);

    // Output the raw result objects
    console.log(results[0]); // Results for the first URL
    const failed = results.some(result => result.issues.length > 0);
    if (failed) {
      process.exit(2);
    }

  } catch (error) {

    // Output an error if it occurred
    console.error(error.message);
    process.exit(2);

  }
}
