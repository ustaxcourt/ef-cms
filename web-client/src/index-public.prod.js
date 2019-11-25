import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { appPublic } from './appPublic';
import { applicationContext } from './applicationContextPublic';

/**
 * Initializes the app with prod environment context
 */
appPublic.initialize(applicationContext);
