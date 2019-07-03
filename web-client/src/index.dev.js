import '@babel/polyfill';
import Devtools from 'cerebral/devtools';

import { Case } from '../../shared/src/business/entities/cases/Case';
import { User } from '../../shared/src/business/entities/User';
import { app } from './app';
import { applicationContext } from './applicationContext';

/**
 * Initializes the app with dev environment context
 */
let debugTools = null;
if (process.env.USTC_DEBUG) {
  debugTools = {
    devtools: Devtools({
      allowedTypes: [Blob, User, Case],
      host: 'localhost:8585',
    }),
  };
}

app.initialize(applicationContext, debugTools);
