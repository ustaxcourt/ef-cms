import { app } from './app';
import { applicationContext } from './applicationContext';

/**
 * Initializes the app with dev environment context
 */
const options = {
  returnSequencePromise: true,
};

app.initialize(applicationContext, options);
