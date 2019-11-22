import { appPublic } from './appPublic';
import { applicationContext } from './applicationContextPublic';
import Devtools from 'cerebral/devtools';

/**
 * Initializes the app with dev environment context
 */
let debugTools = null;
if (process.env.USTC_DEBUG) {
  debugTools = {
    devtools: Devtools({
      host: 'localhost:8585',
    }),
  };
}

appPublic.initialize(applicationContext, debugTools);
