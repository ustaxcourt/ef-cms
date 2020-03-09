import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { app } from './app';
import { applicationContext } from './applicationContext';

let options = {
  returnSequencePromise: true,
};

/**
 * Initializes the app with prod environment context
 */
app.initialize(applicationContext, options);
