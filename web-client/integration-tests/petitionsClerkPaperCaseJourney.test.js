import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkCreatesNewCaseAndSavesForLater } from './journey/petitionsClerkCreatesNewCaseAndSavesForLater';
import { petitionsClerkEditsAnExistingCaseAndServesCase } from './journey/petitionsClerkEditsAnExistingCaseAndServesCase';
import { petitionsClerkVerifiesOrderForOdsCheckbox } from './journey/petitionsClerkVerifiesOrderForOdsCheckbox';

const test = setupTest();

describe('Petitions clerk paper case flow', () => {
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
    test.caseId = test.getState('cases.0.caseId');
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkEditsAnExistingCaseAndServesCase(test);

  petitionsClerkVerifiesOrderForOdsCheckbox(test, fakeFile);
});
