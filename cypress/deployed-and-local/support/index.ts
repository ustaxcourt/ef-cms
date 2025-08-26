import { mockDynamsoftLibrary } from 'cypress/helpers/authentication/dynamsoft';
import '../../support/commands';
import 'cypress-fail-fast/src/support.js';

beforeEach(() => {
  mockDynamsoftLibrary();
});
