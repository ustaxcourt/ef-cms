exports.initHoneybadger = useOnError => {
  const Honeybadger = require('honeybadger');
  const devApiKey = '5299c7e0';

  const config = {
    apiKey: devApiKey, // TODO: should be set elsewhere
    environment: 'dev',
  };
  if (useOnError) {
    Honeybadger.configure(config);
  } else {
    Honeybadger.factory(config);
  }

  return Honeybadger;
};
