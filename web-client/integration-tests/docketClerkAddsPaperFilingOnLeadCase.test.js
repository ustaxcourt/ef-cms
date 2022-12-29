import { DOCUMENT_SERVED_MESSAGES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsPaperFiledMultiDocketableDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledMultiDocketableDocketEntryAndSavesForLater';
import { docketClerkAddsPaperFiledMultiDocketableDocketEntryAndServes } from './journey/docketClerkAddsPaperFiledMultiDocketableDocketEntryAndServes';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import {
  findWorkItemByDocketNumber,
  loginAs,
  setupTest,
  uploadPetition,
  waitForCondition,
  waitForLoadingComponentToHide,
} from './helpers';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';

describe('Docket clerk adds paper filing on lead case', () => {
  const cerebralTest = setupTest();

  cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  it('login as a petitioner and create the lead case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);

    expect(caseDetail.docketNumber).toBeDefined();

    cerebralTest.docketNumber = cerebralTest.leadDocketNumber =
      caseDetail.docketNumber;
    cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
      cerebralTest.docketNumber,
    );
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  it('login as a petitioner and create a case to consolidate with', async () => {
    const caseDetail = await uploadPetition(cerebralTest);

    expect(caseDetail.docketNumber).toBeDefined();

    cerebralTest.docketNumber = caseDetail.docketNumber;
    cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
      cerebralTest.docketNumber,
    );
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);
  docketClerkOpensCaseConsolidateModal(cerebralTest);
  docketClerkSearchesForCaseToConsolidateWith(cerebralTest);
  docketClerkConsolidatesCases(cerebralTest, 2);

  docketClerkAddsPaperFiledMultiDocketableDocketEntryAndServes(
    cerebralTest,
    'A',
  );

  it('verify multi-docketed document has been filed on every case in the consolidated group', async () => {
    for (const docketNumber of cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries) {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber,
      });

      const multiDocketedDocketEntry = cerebralTest
        .getState('caseDetail.docketEntries')
        .find(
          doc => doc.docketEntryId === cerebralTest.multiDocketedDocketEntryId,
        );

      expect(multiDocketedDocketEntry).toBeDefined();
    }
  });

  it('verify a completed work item exists for each case in the consolidated group that the document was filed on from the document viewer', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
    });

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'WorkQueue',
    });

    const outboxQueue = cerebralTest.getState('workQueue');

    for (const docketNumber of cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries) {
      const outboxWorkItem = findWorkItemByDocketNumber(
        outboxQueue,
        docketNumber,
      );

      expect(outboxWorkItem).toMatchObject({
        docketEntry: {
          docketEntryId: cerebralTest.multiDocketedDocketEntryId,
          eventCode: 'A',
        },
        leadDocketNumber: cerebralTest.leadDocketNumber,
      });
    }
  });

  docketClerkAddsPaperFiledMultiDocketableDocketEntryAndSavesForLater(
    cerebralTest,
    'RPT',
  );

  it('docket clerk serves paper filing from case detail document view', async () => {
    await cerebralTest.runSequence(
      'openConfirmServePaperFiledDocumentSequence',
      {
        docketEntryId: cerebralTest.multiDocketedDocketEntryId,
        redirectUrl: `/case-detail/${cerebralTest.leadDocketNumber}/document-view?docketEntryId=${cerebralTest.multiDocketedDocketEntryId}`,
      },
    );

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmInitiatePaperFilingServiceModal',
    );

    await cerebralTest.runSequence('servePaperFiledDocumentSequence');

    await waitForLoadingComponentToHide({ cerebralTest });

    expect(cerebralTest.getState('alertSuccess')).toEqual({
      message: DOCUMENT_SERVED_MESSAGES.SELECTED_CASES,
      overwritable: false,
    });

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    expect(
      cerebralTest.getState('currentViewMetadata.caseDetail.docketRecordTab'),
    ).toEqual('documentView');
  });

  it('verify multi-docketed document has been filed on every case in the consolidated group', async () => {
    for (const docketNumber of cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries) {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber,
      });

      const multiDocketedDocketEntry = cerebralTest
        .getState('caseDetail.docketEntries')
        .find(
          doc => doc.docketEntryId === cerebralTest.multiDocketedDocketEntryId,
        );

      expect(multiDocketedDocketEntry).toBeDefined();
    }
  });

  it('verify a completed work item exists for each case in the consolidated group that the document was filed on from the document viewer', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence');
    await cerebralTest.runSequence('chooseWorkQueueSequence', {
      box: 'outbox',
      queue: 'my',
    });

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'WorkQueue',
    });

    const outboxQueue = cerebralTest.getState('workQueue');

    for (const docketNumber of cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries) {
      const outboxWorkItem = findWorkItemByDocketNumber(
        outboxQueue,
        docketNumber,
      );

      expect(outboxWorkItem).toMatchObject({
        docketEntry: {
          docketEntryId: cerebralTest.multiDocketedDocketEntryId,
          eventCode: 'RPT',
        },
        leadDocketNumber: cerebralTest.leadDocketNumber,
      });
    }
  });
});
