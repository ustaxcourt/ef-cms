export const initHoneybadger = config => {
  const devApiKey = '5299c7e0';
  const Honeybadger = require('path/to/honeybadger');
  Honeybadger.configure({
    apiKey: devApiKey, // TODO: should be set elsewhere
    environment: 'dev',
    onerror: true, // do not use window.onerror for reporting
    ...config,
  });

  return Honeybadger;
};
