import { fakeFile, setupTest } from './helpers';

// Petitioner
import petitionerChoosesCaseType from '../integration-tests/journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from '../integration-tests/journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from '../integration-tests/journey/petitionerCreatesNewCase';
import petitionerLogin from '../integration-tests/journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from '../integration-tests/journey/petitionerCancelsCreateCase';
import userSignsOut from '../integration-tests/journey/petitionerSignsOut';

// Public User
import unauthedUserNavigatesToPublicSite from './journey/unauthedUserNavigatesToPublicSite';
import unauthedUserSearchesByMeta from './journey/unauthedUserSearchesByMeta';

const test = setupTest();

describe('Petitioner creates cases to search for', () => {
  petitionerLogin(test);
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  userSignsOut(test);
});

describe('Unauthed user searches for a case', () => {
  unauthedUserNavigatesToPublicSite(test);
  unauthedUserSearchesByMeta(test);
});
