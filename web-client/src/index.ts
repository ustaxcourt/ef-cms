import { app } from './app';
import { applicationContext } from './applicationContext';

/**
 * Initializes the app with prod environment context
 */
// eslint-disable-next-line @typescript-eslint/no-floating-promises
app.initialize(applicationContext);
