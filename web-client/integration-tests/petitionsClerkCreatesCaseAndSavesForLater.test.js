import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import petitionsClerkCreatesNewCaseAndSavesForLater from './journey/petitionsClerkCreatesNewCaseAndSavesForLater';
import petitionsClerkEditsAnExistingCaseAndSavesForLater from './journey/petitionsClerkEditsAnExistingCaseAndSavesForLater';

const test = setupTest();

describe('Case journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreatesNewCaseAndSavesForLater(test, fakeFile);

  loginAs(test, 'petitioner');
  it('Create case', async () => {
    await uploadPetition(test);
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkEditsAnExistingCaseAndSavesForLater(test);
});
