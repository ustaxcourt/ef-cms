import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'wicg-inert';
import { app } from './app';
import { applicationContext } from './applicationContext';

/**
 * Initializes the app with prod environment context
 */
app.initialize(applicationContext);
