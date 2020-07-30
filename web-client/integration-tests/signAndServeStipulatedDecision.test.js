import { adcsSignsProposedStipulatedDecisionFromMessage } from './journey/adcsSignsProposedStipulatedDecisionFromMessage';
import { docketClerkCompletesDocketEntryQcAndSendsMessage } from './journey/docketClerkCompletesDocketEntryQcAndSendsMessage';
import { docketClerkCreatesDocketEntryForSignedStipulatedDecision } from './journey/docketClerkCreatesDocketEntryForSignedStipulatedDecision';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { respondentUploadsProposedStipulatedDecision } from './journey/respondentUploadsProposedStipulatedDecision';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => {
      return new Promise(resolve => {
        resolve(null);
      });
    },
  },
});

describe('a user signs and serves a stipulated decision', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'irsPractitioner@example.com');
  respondentUploadsProposedStipulatedDecision(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkCompletesDocketEntryQcAndSendsMessage(test);

  loginAs(test, 'adc@example.com');
  adcsSignsProposedStipulatedDecisionFromMessage(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesDocketEntryForSignedStipulatedDecision(test);
});
