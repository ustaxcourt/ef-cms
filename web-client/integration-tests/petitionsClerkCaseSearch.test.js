import { fakeFile, setupTest } from './helpers';
import petitionsClerkAdvancedSearchForCase from './journey/petitionsClerkAdvancedSearchForCase';
import petitionsClerkCreatesNewCase from './journey/petitionsClerkCreatesNewCase';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import userSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('petitions clerk case search', () => {
  petitionsClerkLogIn(test);
  petitionsClerkCreatesNewCase(test, fakeFile);
  petitionsClerkAdvancedSearchForCase(test);
  userSignsOut(test);
});
