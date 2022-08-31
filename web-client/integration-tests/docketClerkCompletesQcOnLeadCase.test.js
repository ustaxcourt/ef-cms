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
import {
  fakeFile,
  loginAs,
  setConsolidatedCasesPropagateEntriesFlag,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionerVerifiesConsolidatedCases } from './journey/petitionerVerifiesConsolidatedCases';
import { petitionerVerifiesUnconsolidatedCases } from './journey/petitionerVerifiesUnconsolidatedCases';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);
//DRY up this code
export const docketClerkCompletesQcOnLeadCase = cerebralTest => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(async () => {
    await setConsolidatedCasesPropagateEntriesFlag(true);
    cerebralTest.closeSocket();
  });

  it('login as a petitioner and create the lead case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
      caseDetail.docketNumber;
  });

  it('login as a petitioner and create a case to consolidate with', async () => {
    cerebralTest.docketNumberDifferentPlaceOfTrial = null;
    const caseDetail = await uploadPetition(cerebralTest, overrides);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 1);
  // maybe create 2 cases?
  //consolidate them
  //upload pdf on lead case
  docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);
  //add docket entry for pdf save for later
  //go to document qc and edit docket entry
  //expect modal to have checkbox or something for the consolidated case
  //serve/submit
  //expect the doc shows up on docket record for non lead case as well as lead case
};
