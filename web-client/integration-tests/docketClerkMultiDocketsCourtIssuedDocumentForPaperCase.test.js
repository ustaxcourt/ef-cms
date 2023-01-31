import { confirmInitiateCourtIssuedFilingServiceModalHelper } from '../src/presenter/computeds/confirmInitiateCourtIssuedFilingServiceModalHelper';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import {
  fakeFile,
  getFormattedDocketEntriesForTest,
  loginAs,
  setupTest,
  uploadPetition,
  waitForCondition,
} from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { petitionsClerkSubmitsPaperCaseToIrs } from './journey/petitionsClerkSubmitsPaperCaseToIrs';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Docket Clerk Multi-Dockets a Court Issued Order in a Consolidated Group with Paper Service', () => {
  const cerebralTest = setupTest();

  cerebralTest.consolidatedCases = [];

  const trialLocation = `Houston, Texas, ${Date.now()}`;
  const overrides = {
    preferredTrialCity: trialLocation,
    procedureType: 'Small',
    trialLocation,
  };

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  it('login as a petitioner and create the lead case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest, overrides);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = cerebralTest.leadDocketNumber = docketNumber;
    cerebralTest.consolidatedCases.push(cerebralTest.docketNumber);
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(
    cerebralTest,
    fakeFile,
    overrides.trialLocation,
    false,
    overrides,
  );
  petitionsClerkSubmitsPaperCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 2);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);

  it('Docket Clerk serves the order after the docket entry has been created (with parties with paper service)', async () => {
    const { docketEntryId } = cerebralTest.draftOrders[0];
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const orderDocument = formattedDocketEntriesOnDocketRecord.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(orderDocument).toBeTruthy();

    await cerebralTest.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
      docketEntryId: orderDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'CourtIssuedDocketEntry',
    );

    await cerebralTest.runSequence(
      'openConfirmInitiateCourtIssuedFilingServiceModalSequence',
    );

    const modalHelper = runCompute(
      withAppContextDecorator(
        confirmInitiateCourtIssuedFilingServiceModalHelper,
      ),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(modalHelper.showPaperAlert).toEqual(true);
    expect(modalHelper.contactsNeedingPaperService).toEqual([
      {
        name: 'Daenerys Stormborn, Petitioner',
      },
    ]);

    await cerebralTest.runSequence(
      'fileAndServeCourtIssuedDocumentFromDocketEntrySequence',
    );

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'PrintPaperService',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PrintPaperService');
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();
  });
});
