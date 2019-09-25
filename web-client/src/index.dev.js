import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'wicg-inert';
import { Case } from '../../shared/src/business/entities/cases/Case';
import { User } from '../../shared/src/business/entities/User';
import { app } from './app';
import { applicationContext } from './applicationContext';
import Devtools from 'cerebral/devtools';

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
