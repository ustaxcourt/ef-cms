import '@babel/polyfill';
import Devtools from 'cerebral/devtools';

import app from './app';
import dev from './environments/dev';

/**
 * Initializes the app with dev environment context
 */

const debugTools = {
  devtools: Devtools({
    host: 'localhost:8585',
  }),
};

app.initialize(dev, debugTools);
