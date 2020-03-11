import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import petitionsClerkCreatesNewCaseAndServesCase from './journey/petitionsClerkCreatesNewCaseAndServesCase';
import petitionsClerkEditsAnExistingCaseAndServesCase from './journey/petitionsClerkEditsAnExistingCaseAndServesCase';

const test = setupTest();

describe('Case (paper) journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreatesNewCaseAndServesCase(test, fakeFile);

  loginAs(test, 'petitioner');
  it('Create case', async () => {
    await uploadPetition(test);

    test.docketNumber = test.getState('cases.0.docketNumber');
    test.documentId = test.getState('cases.0.documents.0.documentId');
    test.caseId = test.getState('cases.0.caseId');
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkEditsAnExistingCaseAndServesCase(test);
});
