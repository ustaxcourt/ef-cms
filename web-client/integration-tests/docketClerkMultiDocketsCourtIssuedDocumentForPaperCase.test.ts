import { confirmInitiateServiceModalHelper } from '../src/presenter/computeds/confirmInitiateServiceModalHelper';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import {
  getFormattedDocketEntriesForTest,
  loginAs,
  setupTest,
  uploadPetition,
  waitForCondition,
} from './helpers';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { runCompute } from '@web-client/presenter/test.cerebral';
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

  it('login as a petitioner and create an electronic case', async () => {
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
  petitionsClerkCreatesNewCase(cerebralTest, overrides);

  it('add paper case docket number to tracked consolidated cases', () => {
    cerebralTest.consolidatedCases.push(cerebralTest.docketNumber);
  });

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
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);

  it('serve and multi-dockets court issued docket entry on group with paper service', async () => {
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
      withAppContextDecorator(confirmInitiateServiceModalHelper),
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
    expect(modalHelper.showConsolidatedCasesForService).toEqual(true);

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

  it('verify multi-docketed docket entry has been filed on every case in the consolidated group', async () => {
    for (const docketNumber of cerebralTest.consolidatedCases) {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber,
      });

      const multiDocketedDocketEntry = cerebralTest
        .getState('caseDetail.docketEntries')
        .find(doc => doc.docketEntryId === cerebralTest.docketEntryId);

      expect(multiDocketedDocketEntry).toBeDefined();
    }
  });
});
