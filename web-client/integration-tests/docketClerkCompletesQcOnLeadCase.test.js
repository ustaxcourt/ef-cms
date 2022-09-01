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
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import {
  fakeFile,
  getFormattedDocumentQCSectionInProgress,
  loginAs,
  setConsolidatedCasesPropagateEntriesFlag,
  setupTest,
  uploadPetition,
} from './helpers';
import { formattedCaseDetail } from '../src/presenter/computeds/formattedCaseDetail';
import { petitionerVerifiesConsolidatedCases } from './journey/petitionerVerifiesConsolidatedCases';
import { petitionerVerifiesUnconsolidatedCases } from './journey/petitionerVerifiesUnconsolidatedCases';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

const cerebralTest = setupTest();
const trialLocation = `Boise, Idaho, ${Date.now()}`;
cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries = [];

const overrides = {
  preferredTrialCity: trialLocation,
  trialLocation,
};

let leadDocketNumber;
let caseDetail;

//DRY up this code
describe('Complete QC on lead case docket entry', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    cerebralTest.draftOrders = [];
  });

  afterAll(async () => {
    cerebralTest.closeSocket();
  });

  it('login as a petitioner and create the lead case', async () => {
    caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
      caseDetail.docketNumber;
    leadDocketNumber = caseDetail.docketNumber;
  });

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

    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: 'MISC',
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

    await cerebralTest.runSequence('openConfirmInitiateServiceModalSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmInitiateServiceModal',
    );

    expect(cerebralTest.getState('state.consolidatedCaseAllCheckbox')).toBe(
      true,
    );

    await cerebralTest.runSequence(
      'fileAndServeCourtIssuedDocumentFromDocketEntrySequence',
    );

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });
  //expect modal to have checkbox or something for the consolidated case
  //serve/submit
  // saveCourtIssuedDocketEntrySequence
  //expect the doc shows up on docket record for non lead case as well as lead case
});
