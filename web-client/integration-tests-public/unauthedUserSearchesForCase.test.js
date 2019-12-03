import { fakeFile, setupTest } from './helpers';

import { setupTest as setupTestClient } from '../integration-tests/helpers';

// Petitioner
import petitionerChoosesCaseType from '../integration-tests/journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from '../integration-tests/journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from '../integration-tests/journey/petitionerCreatesNewCase';
import petitionerLogin from '../integration-tests/journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from '../integration-tests/journey/petitionerCancelsCreateCase';
import userSignsOut from '../integration-tests/journey/petitionerSignsOut';

// Public User
import unauthedUserNavigatesToPublicSite from './journey/unauthedUserNavigatesToPublicSite';
import unauthedUserSearchesByDocketNumber from './journey/unauthedUserSearchesByDocketNumber';
import unauthedUserSearchesByMeta from './journey/unauthedUserSearchesByMeta';

const test = setupTest();
const testClient = setupTestClient();

describe('Petitioner creates cases to search for', () => {
  petitionerLogin(testClient);
  petitionerNavigatesToCreateCase(testClient);
  petitionerChoosesProcedureType(testClient);
  petitionerChoosesCaseType(testClient);
  petitionerCreatesNewCase(testClient, fakeFile);
  userSignsOut(testClient);
});

describe('Unauthed user searches for a case', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserSearchesByMeta(test);
  unauthedUserSearchesByDocketNumber(test, testClient);
});
