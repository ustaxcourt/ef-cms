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

    test.docketNumber = test.getState('cases.0.docketNumber');
    test.documentId = test.getState('cases.0.documents.0.documentId');
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkEditsAnExistingCaseAndSavesForLater(test);
});
