import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { appPublic } from './appPublic';
import { applicationContextPublic } from './applicationContextPublic';

/**
 * Initializes the app with prod environment context
 */
appPublic.initialize(applicationContextPublic);
