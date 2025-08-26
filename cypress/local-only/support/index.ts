import './commands';
import '@cypress/puppeteer/support';
import 'cypress-axe';
import 'cypress-fail-fast/src/support.js';
import { mockDynamsoftLibrary } from 'cypress/helpers/authentication/dynamsoft';

beforeEach(() => {
  mockDynamsoftLibrary();
});
