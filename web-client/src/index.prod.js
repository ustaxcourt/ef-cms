import '@babel/polyfill';

import app from './app';
import applicationContext from './applicationContexts/prod';

/**
 * Initializes the app with prod environment context
 */
app.initialize(applicationContext);
