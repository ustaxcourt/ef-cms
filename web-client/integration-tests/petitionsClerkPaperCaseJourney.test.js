import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
// import { petitionsClerkEditsAnExistingCaseAndServesCase } from './journey/petitionsClerkEditsAnExistingCaseAndServesCase';
import { petitionsClerkEditsPetitionInQCIRSNotice } from './journey/petitionsClerkEditsPetitionInQCIRSNotice';
import { petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox } from './journey/petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox';
import { petitionsClerkVerifiesOrderForOdsCheckbox } from './journey/petitionsClerkVerifiesOrderForOdsCheckbox';
import { petitionsClerkVerifiesPetitionPaymentFeeOptions } from './journey/petitionsClerkVerifiesPetitionPaymentFeeOptions';

const test = setupTest();

describe('Petitions clerk paper case flow', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  loginAs(test, 'petitionsclerk');
  petitionsClerkCreatesNewCaseFromPaper(test, fakeFile);

  loginAs(test, 'petitioner');
  it('Create case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
    test.documentId = caseDetail.documents[0].documentId;
    test.caseId = caseDetail.caseId;
  });

  loginAs(test, 'petitionsclerk');
  // petitionsClerkEditsAnExistingCaseAndServesCase(test);
  petitionsClerkEditsPetitionInQCIRSNotice(test);
  petitionsClerkVerifiesOrderForOdsCheckbox(test, fakeFile);
  petitionsClerkVerifiesOrderDesignatingPlaceOfTrialCheckbox(test, fakeFile);
  petitionsClerkVerifiesPetitionPaymentFeeOptions(test, fakeFile);
});
