import '@babel/polyfill';
import Devtools from 'cerebral/devtools';

import app from './app';
import applicationContext from './applicationContexts/dev';
import Case from '../../../business/src/entities/Case';
import User from '../../../business/src/entities/User';

/**
 * Initializes the app with dev environment context
 */
let debugTools = null;
if (process.env.USTC_DEBUG) {
  debugTools = {
    devtools: Devtools({
      host: 'localhost:8585',
      allowedTypes: [Blob, User, Case],
    }),
  };
}

app.initialize(applicationContext, debugTools);
