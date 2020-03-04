import { fakeFile, loginAs, setupTest } from './helpers';
import petitionsClerkCreatesNewCaseAndSavesForLater from './journey/petitionsClerkCreatesNewCaseAndSavesForLater';
import petitionsClerkEditsAnExistingCaseAndSavesForLater from './journey/petitionsClerkEditsAnExistingCaseAndSavesForLater';

const test = setupTest();

describe('Case journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreatesNewCaseAndSavesForLater(test, fakeFile);

  petitionsClerkEditsAnExistingCaseAndSavesForLater(test);
});
