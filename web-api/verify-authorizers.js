const axios = require('axios');
const fs = require('fs');
const yaml = require('js-yaml');
const env = process.env.ENV;

axios.interceptors.request.use(function (config) {
  config.headers['Content-Type'] = 'application/json';
  return config;
});

(async () => {
  const serverlessYmlFiles = process.argv
    .slice(2)
    .filter(path => !path.includes('public-api'));

  const serverlessConfigs = serverlessYmlFiles.map(path =>
    yaml.safeLoad(fs.readFileSync(path, 'utf8')),
  );

  const missingAuthorizers = [];
  const no403Response = [];

  console.log('verifying the follwing urls:');

  for (const config of serverlessConfigs) {
    if (!config.custom.customDomain) continue;

    const { basePath } = config.custom.customDomain;
    const { functions } = config;

    for (const [funName, funConfig] of Object.entries(functions)) {
      // console.log('funConfig', funConfig);
      const event = funConfig.events[0];
      const def = event.http;
      if (!def) continue;

      const { authorizer, method, path } = def;

      if (!authorizer) {
        missingAuthorizers.push(funName);
      }

      const urlToVerify = `https://efcms-${env}.${process.env.EFCMS_DOMAIN}/${basePath}${path}`;
      let responseStatus = null;
      try {
        console.log(`  ${urlToVerify}`);
        await axios[method.toLowerCase()](urlToVerify);
      } catch (err) {
        responseStatus = err.response.status;
      }
      if (responseStatus !== 401) {
        no403Response.push(urlToVerify);
      }
    }
  }

  if (missingAuthorizers.length) {
    console.log(
      `\n\nThe following http functions are missing authorizers: ${missingAuthorizers.join(
        ', ',
      )}`,
    );
  }

  if (no403Response.length) {
    console.log(
      `\n\nThe following urls functions are missing authorizers:\n${no403Response.join(
        '\n',
      )}`,
    );
  }
})();
