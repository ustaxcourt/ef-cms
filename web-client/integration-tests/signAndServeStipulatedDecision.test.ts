import { adcsSignsProposedStipulatedDecisionFromMessage } from './journey/adcsSignsProposedStipulatedDecisionFromMessage';
import { docketClerkAssignWorkItemToSelf } from './journey/docketClerkAssignWorkItemToSelf';
import { docketClerkCompletesDocketEntryQcAndSendsMessage } from './journey/docketClerkCompletesDocketEntryQcAndSendsMessage';
import { docketClerkCreatesDocketEntryForSignedStipulatedDecision } from './journey/docketClerkCreatesDocketEntryForSignedStipulatedDecision';
import { docketClerkTriesToCompleteSameEntry } from './journey/docketClerkTriesToCompleteSameEntry';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import { respondentUploadsProposedStipulatedDecision } from './journey/respondentUploadsProposedStipulatedDecision';

describe('a user signs and serves a stipulated decision', () => {
  const cerebralTest = setupTest({
    useCases: {
      loadPDFForSigningInteractor: () => {
        return new Promise(resolve => {
          resolve(null);
        });
      },
    },
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('login as a petitioner and create a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesPetitionFromDocumentView(cerebralTest);

  loginAs(cerebralTest, 'irspractitioner@example.com');
  respondentUploadsProposedStipulatedDecision(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkAssignWorkItemToSelf(cerebralTest);
  docketClerkCompletesDocketEntryQcAndSendsMessage(cerebralTest);
  docketClerkTriesToCompleteSameEntry(cerebralTest);

  loginAs(cerebralTest, 'adc@example.com');
  adcsSignsProposedStipulatedDecisionFromMessage(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesDocketEntryForSignedStipulatedDecision(cerebralTest);
});
