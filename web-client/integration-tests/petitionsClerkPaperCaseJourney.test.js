import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkCreatesNewCaseAndSavesForLater } from './journey/petitionsClerkCreatesNewCaseAndSavesForLater';
import { petitionsClerkEditsAnExistingCaseAndServesCase } from './journey/petitionsClerkEditsAnExistingCaseAndServesCase';
import { petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox } from './journey/petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox';
import { petitionsClerkVerifiesOrderForOdsCheckbox } from './journey/petitionsClerkVerifiesOrderForOdsCheckbox';
import { petitionsClerkVerifiesPetitionPaymentFeeOptions } from './journey/petitionsClerkVerifiesPetitionPaymentFeeOptions';

const test = setupTest();

describe('Petitions clerk paper case flow', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreatesNewCaseAndSavesForLater(test, fakeFile);

  loginAs(test, 'petitioner');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test);

    test.docketNumber = caseDetail.docketNumber;
    test.documentId = caseDetail.documents[0].documentId;
    test.caseId = caseDetail.caseId;
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkEditsAnExistingCaseAndServesCase(test);

  petitionsClerkVerifiesOrderForOdsCheckbox(test, fakeFile);
  petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox(test, fakeFile);
  petitionsClerkVerifiesPetitionPaymentFeeOptions(test);
});
