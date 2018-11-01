import '@babel/polyfill';
import Devtools from 'cerebral/devtools';

import app from './app';
import dev from './environments/dev';

/**
 * Initializes the app with dev environment context
 */
let debugTools = null;
if (process.env.USTC_DEBUG) {
  debugTools = {
    devtools: Devtools({
      host: 'localhost:8585',
      allowedTypes: [Blob],
    }),
  };
}

app.initialize(dev, debugTools);
