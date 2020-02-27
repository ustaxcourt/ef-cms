import { fakeFile, setupTest } from './helpers';
import petitionsClerkCreatesNewCaseAndSavesForLater from './journey/petitionsClerkCreatesNewCaseAndSavesForLater';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';

const test = setupTest();

describe('Case journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  petitionsClerkLogIn(test);
  petitionsClerkCreatesNewCaseAndSavesForLater(test, fakeFile);
});
