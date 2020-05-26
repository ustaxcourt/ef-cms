const fs = require('fs');
const glob = require('glob');

let errorsFound = 0;

glob('web-api/serverless-*.yml', pathMethodLint);

/**
 *
 */
function pathMethodLint(err, files) {
  if (err) {
    console.error(err);
    return;
  }
  for (const file of files) {
    let endpointCollection = {};
    let endpoint = {};
    const lines = fs.readFileSync(file).toString().split('\n');

    lines.forEach(line => {
      let matches;
      if ((matches = line.match(/(path|method|handler):\s(\S+)/))) {
        endpoint[matches[1]] = matches[2];
      }
      if (endpoint.method && endpoint.path) {
        const simplified = `${endpoint.method} ${endpoint.path.replace(
          /\{\w+\}/,
          '{var}',
        )}`;
        endpointCollection[simplified] = endpointCollection[simplified] || [];
        endpointCollection[simplified].push(endpoint);
        endpoint = {};
      }
    });

    Object.entries(endpointCollection).forEach(endpointIsUnique);
  }

  if (errorsFound > 0) {
    console.error(
      `FAIL: Serverless configuration linting - ${errorsFound} errors`,
    );
    process.exit(1);
  } else {
    console.info('PASS: Serverless configuration linting');
    process.exit();
  }
}

/**
 *
 */
function endpointIsUnique([simplifiedPath, endpointsWithin]) {
  if (endpointsWithin.length > 1) {
    errorsFound++;
    console.error(
      `Likely endpoint conflict on ${simplifiedPath}:\n`,
      JSON.stringify(endpointsWithin, null, 2),
    );
  }
}
