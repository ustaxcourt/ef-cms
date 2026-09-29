import { appPublic } from './appPublic';
import { applicationContextPublic } from './applicationContextPublic';

/**
 * Initializes the app with dev environment context
 */
const options = {};

void (async (): Promise<void> => {
  try {
    await appPublic.initialize(applicationContextPublic, options);
  } catch (error) {
    console.error('Failed to initialize the public app:', error);
  }
})();
