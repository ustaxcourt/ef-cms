export const initHoneybadger = () => {
  const Honeybadger = require('path/to/honeybadger');
  Honeybadger.configure({
    apiKey: 'e1d0cf5a',
    environment: 'production',
    onerror: true, // do not use window.onerror for reporting
  });

  window.Honeybadger = Honeybadger; // TODO: Maybe do not?
};
