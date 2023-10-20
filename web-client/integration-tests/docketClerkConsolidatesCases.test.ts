import { DOCUMENT_SERVED_MESSAGES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsAndServesDocketEntryFromOrder } from './journey/docketClerkAddsAndServesDocketEntryFromOrder';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkConsolidatesCaseThatCannotBeConsolidated } from './journey/docketClerkConsolidatesCaseThatCannotBeConsolidated';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkFilesAndServesDocumentOnLeadCase } from './journey/docketClerkFilesAndServesDocumentOnLeadCase';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkServesDocumentOnLeadCase } from './journey/docketClerkServesDocumentOnLeadCase';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkUnconsolidatesLeadCase } from './journey/docketClerkUnconsolidatesLeadCase';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerVerifiesConsolidatedCases } from './journey/petitionerVerifiesConsolidatedCases';
import { petitionerVerifiesUnconsolidatedCases } from './journey/petitionerVerifiesUnconsolidatedCases';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe('Case Consolidation Journey', () => {
  const cerebralTest = setupTest();

  cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries = [];

  const trialLocation = `Boise, Idaho, ${Date.now()}`;
  const overrides = {
    preferredTrialCity: trialLocation,
    trialLocation,
  };

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('petitioner creates electronic lead case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest, overrides);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = cerebralTest.leadDocketNumber = docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  it('login as a petitioner and create a case that cannot be consolidated with the lead case', async () => {
    // Not passing in overrides to preferredTrialCity to ensure case cannot be consolidated because they have different requested trial locations
    const { docketNumber } = await uploadPetition(cerebralTest);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumberDifferentPlaceOfTrial = docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCaseThatCannotBeConsolidated(cerebralTest);

  it('login as a petitioner and create a case to consolidate with', async () => {
    cerebralTest.docketNumberDifferentPlaceOfTrial = null;
    const caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 2);

  it('login as a petitioner and create another case to consolidate with', async () => {
    cerebralTest.docketNumberDifferentPlaceOfTrial = null;
    const caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 3);

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerViewsDashboard(cerebralTest);
  petitionerVerifiesConsolidatedCases(cerebralTest, 3);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkFilesAndServesDocumentOnLeadCase(cerebralTest, 0);

  it('should have a success message that mentions serving multiple cases', () => {
    const alertSuccess = cerebralTest.getState('alertSuccess');

    expect(alertSuccess.message).toEqual(
      DOCUMENT_SERVED_MESSAGES.SELECTED_CASES,
    );
    expect(alertSuccess.overwritable).toEqual(false);
  });

  it('should verify that document is filed and served on all checked consolidated cases', async () => {
    const consolidatedCases = cerebralTest.getState(
      'caseDetail.consolidatedCases',
    );

    for (let consolidatedCase of consolidatedCases) {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: consolidatedCase.docketNumber,
      });

      const { docketEntryId } = cerebralTest.docketRecordEntry;

      const documents = cerebralTest.getState('caseDetail.docketEntries');
      const orderDocument = documents.find(
        doc => doc.docketEntryId === docketEntryId,
      );

      if (
        cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.includes(
          consolidatedCase.docketNumber,
        )
      ) {
        expect(orderDocument.servedAt).toBeDefined();
        expect(orderDocument.workItem.docketEntry.docketEntryId).toEqual(
          orderDocument.docketEntryId,
        );
        expect(orderDocument.workItem.docketNumber).toEqual(
          consolidatedCase.docketNumber,
        );
        expect(orderDocument.workItem.completedBy).toEqual('Test Docketclerk');
        expect(orderDocument.workItem.completedMessage).toEqual('completed');
        expect(orderDocument.workItem.completedAt).toBeDefined();
        expect(orderDocument.workItem.inProgress).toBeUndefined();
      } else {
        expect(orderDocument).toBeUndefined();
      }
    }
    cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries = [];
  });

  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to test story 9513',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);
  docketClerkServesDocumentOnLeadCase(cerebralTest);

  it('should verify that document is served on all checked consolidated cases', async () => {
    const consolidatedCases = cerebralTest.getState(
      'caseDetail.consolidatedCases',
    );

    for (let consolidatedCase of consolidatedCases) {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: consolidatedCase.docketNumber,
      });

      const { docketEntryId } = cerebralTest.docketRecordEntry;

      const documents = cerebralTest.getState('caseDetail.docketEntries');
      const orderDocument = documents.find(
        doc => doc.docketEntryId === docketEntryId,
      );

      if (
        cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.includes(
          consolidatedCase.docketNumber,
        )
      ) {
        expect(orderDocument.servedAt).toBeDefined();
        expect(orderDocument.workItem.docketEntry.docketEntryId).toEqual(
          orderDocument.docketEntryId,
        );
        expect(orderDocument.workItem.docketNumber).toEqual(
          consolidatedCase.docketNumber,
        );
        expect(orderDocument.workItem.completedBy).toEqual('Test Docketclerk');
        expect(orderDocument.workItem.completedMessage).toEqual('completed');
        expect(orderDocument.workItem.completedAt).toBeDefined();
        expect(orderDocument.workItem.inProgress).toBeUndefined();
      } else {
        expect(orderDocument).toBeUndefined();
      }
    }
    cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries = [];
  });

  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something only on the lead case',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsAndServesDocketEntryFromOrder(cerebralTest, 0, false);

  it('should have a success message that mentions the document was served (and not on multiple cases)', () => {
    const alertSuccess = cerebralTest.getState('alertSuccess');

    expect(alertSuccess.message).toEqual(DOCUMENT_SERVED_MESSAGES.GENERIC);
    expect(alertSuccess.overwritable).toEqual(false);
  });

  docketClerkUnconsolidatesLeadCase(cerebralTest);
  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerViewsDashboard(cerebralTest);
  petitionerVerifiesConsolidatedCases(cerebralTest, 2);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUnconsolidatesLeadCase(cerebralTest);
  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerViewsDashboard(cerebralTest);
  petitionerVerifiesUnconsolidatedCases(cerebralTest);
});
