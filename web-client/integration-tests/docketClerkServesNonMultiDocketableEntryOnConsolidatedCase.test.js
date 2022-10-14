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
  loginAs,
  setConsolidatedCasesPropagateEntriesFlag,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionerVerifiesConsolidatedCases } from './journey/petitionerVerifiesConsolidatedCases';
import { petitionerVerifiesUnconsolidatedCases } from './journey/petitionerVerifiesUnconsolidatedCases';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';

describe('Docket Clerk serves non multi-docketable entry on consolidated case', () => {
  const cerebralTest = setupTest();
  const trialLocation = `Boise, Idaho, ${Date.now()}`;

  cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries = [];

  const overrides = {
    preferredTrialCity: trialLocation,
    trialLocation,
  };

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

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

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
  docketClerkConsolidatesCases(cerebralTest, 2);

  //add paper filing (of type caseDecision === true) on lead case
  //save for later
  //serve paper filing from document viewer
  //verify modal does not have consolidated case checkboxes
  //fix me
  const documentFormValues = {
    dateReceivedDay: 1,
    dateReceivedMonth: 1,
    dateReceivedYear: 2018,
    eventCode: 'M115',
    objections: OBJECTIONS_OPTIONS_MAP.NO,
    primaryDocumentFile: fakeFile,
    primaryDocumentFileSize: 100,
    'secondaryDocument.addToCoversheet': true,
    'secondaryDocument.additionalInfo': 'Test Secondary Additional Info',
    'secondaryDocument.eventCode': 'APPW',
    secondaryDocumentFile: fakeFile,
    secondaryDocumentFileSize: 100,
  };

  docketClerkAddsPaperFiledDocketEntryAndSavesForLater({
    cerebralTest,
    documentFormValues,
  });
});
