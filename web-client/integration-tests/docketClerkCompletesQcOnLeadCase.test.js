import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import {
  fakeFile,
  getFormattedDocumentQCSectionInProgress,
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import { formattedCaseDetail } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Complete QC on lead case docket entry', () => {
  const cerebralTest = setupTest();
  const trialLocation = `Boise, Idaho, ${Date.now()}`;
  const overrides = {
    preferredTrialCity: trialLocation,
    trialLocation,
  };

  let leadDocketNumber;
  let caseDetail;

  cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries = [];

  beforeAll(() => {
    jest.setTimeout(30000);
    cerebralTest.draftOrders = [];
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  it('login as a petitioner and create the lead case', async () => {
    caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
      caseDetail.docketNumber;
    leadDocketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);

  it('Docket Clerk adds a docket entry and saves without serving', async () => {
    let caseDetailFormatted = runCompute(
      withAppContextDecorator(formattedCaseDetail),
      {
        state: cerebralTest.getState(),
      },
    );

    const { docketEntryId } = cerebralTest.draftOrders[0];

    const draftOrderDocument = caseDetailFormatted.draftDocuments.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(draftOrderDocument).toBeTruthy();

    await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
      docketEntryId: draftOrderDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('form.eventCode')).toBeUndefined();
    expect(cerebralTest.getState('form.documentType')).toBeUndefined();

    await cerebralTest.runSequence('saveCourtIssuedDocketEntrySequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({
      documentType: 'Select a document type',
    });

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'MISC',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentType',
        value: 'Miscellaneous',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'documentTitle',
        value: '[anything]',
      },
    );

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'scenario',
        value: 'Type A',
      },
    );

    await cerebralTest.runSequence('saveCourtIssuedDocketEntrySequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });

  it('login as a petitioner and create a case to consolidate with', async () => {
    cerebralTest.docketNumberDifferentPlaceOfTrial = null;
    caseDetail = await uploadPetition(cerebralTest, overrides);
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

  it('edits a docket entry in document QC and serves on all consolidated cases in the group', async () => {
    const documentQCSectionInProcess =
      await getFormattedDocumentQCSectionInProgress(cerebralTest);

    const savedDocument = documentQCSectionInProcess.find(
      item => item.docketNumber === leadDocketNumber,
    );

    await cerebralTest.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: savedDocument.docketEntry.docketEntryId,
      docketNumber: cerebralTest.leadDocketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'CourtIssuedDocketEntry',
    );

    await cerebralTest.runSequence(
      'openConfirmInitiateCourtIssuedFilingServiceModalSequence',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmInitiateCourtIssuedFilingServiceModal',
    );

    expect(cerebralTest.getState('consolidatedCaseAllCheckbox')).toBe(true);

    await cerebralTest.runSequence(
      'fileAndServeCourtIssuedDocumentFromDocketEntrySequence',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });

  it('case in consolidated group that is NOT the lead case should also have served docket entry', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const foundDocketEntry = docketEntries.find(
      doc => doc.eventCode === 'MISC',
    );

    expect(foundDocketEntry.servedAt).toBeDefined();
  });
});
