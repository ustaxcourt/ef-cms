import { DOCUMENT_SERVED_MESSAGES } from '../../shared/src/business/entities/EntityConstants';
import { confirmInitiatePaperFilingServiceModalHelper } from '../src/presenter/computeds/confirmInitiatePaperFilingServiceModalHelper';
import {
  contactPrimaryFromState,
  fakeFile,
  findWorkItemByDocketNumber,
  loginAs,
  setupTest,
  uploadPetition,
  waitForCondition,
} from './helpers';
import { docketClerkConsolidatesCases } from './journey/docketClerkConsolidatesCases';
import { docketClerkOpensCaseConsolidateModal } from './journey/docketClerkOpensCaseConsolidateModal';
import { docketClerkSearchesForCaseToConsolidateWith } from './journey/docketClerkSearchesForCaseToConsolidateWith';
import { docketClerkUpdatesCaseStatusToReadyForTrial } from './journey/docketClerkUpdatesCaseStatusToReadyForTrial';
import { petitionsClerkServesElectronicCaseToIrs } from './journey/petitionsClerkServesElectronicCaseToIrs';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Docket Clerk edits and multi-dockets a paper filing journey', () => {
  const cerebralTest = setupTest();

  cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  it('login as a petitioner and create the lead case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = cerebralTest.leadDocketNumber = docketNumber;
    cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries.push(
      cerebralTest.docketNumber,
    );
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesElectronicCaseToIrs(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUpdatesCaseStatusToReadyForTrial(cerebralTest);

  it('login as a petitioner and create a case to consolidate with', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
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

  it('create a paper-filed docket entry on the lead case', async () => {
    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.leadDocketNumber,
    });

    await cerebralTest.runSequence('setDocumentForUploadSequence', {
      documentType: 'primaryDocumentFile',
      documentUploadMode: 'preview',
      file: fakeFile,
    });

    const formValues = {
      additionalInfo: 'Marvelous multidocket memo',
      dateReceivedDay: 1,
      dateReceivedMonth: 1,
      dateReceivedYear: 2018,
      eventCode: 'A',
      trialLocation: 'Little Rock, AR',
    };

    for (let [key, value] of Object.entries(formValues)) {
      await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
        key,
        value,
      });
    }

    const { contactId } = contactPrimaryFromState(cerebralTest);
    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');

    const { docketEntries } = cerebralTest.getState('caseDetail');
    const foundDocketEntry = docketEntries.find(
      doc => doc.additionalInfo === 'Marvelous multidocket memo',
    );
    expect(foundDocketEntry).toMatchObject({
      documentTitle: 'Answer',
      documentType: 'Answer',
      eventCode: formValues.eventCode,
      isFileAttached: true,
    });

    cerebralTest.multiDocketedDocketEntryId = foundDocketEntry.docketEntryId;
  });

  it('edit paper-filed docket entry, changing event code', async () => {
    await cerebralTest.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId: cerebralTest.multiDocketedDocketEntryId,
      docketNumber: cerebralTest.leadDocketNumber,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'ADMR',
    });
  });

  it('serve paper filing, multi-docketing on all cases in consolidated group', async () => {
    await cerebralTest.runSequence('openConfirmPaperServiceModalSequence', {
      docketEntryId: cerebralTest.multiDocketedDocketEntryId,
    });

    const modalHelper = runCompute(
      withAppContextDecorator(confirmInitiatePaperFilingServiceModalHelper),
      {
        state: cerebralTest.getState(),
      },
    );

    expect(modalHelper.showConsolidatedCasesForService).toBe(true);
    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'ConfirmInitiatePaperFilingServiceModal',
    );

    await cerebralTest.runSequence('submitPaperFilingSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    expect(cerebralTest.getState('alertSuccess')).toEqual({
      message: DOCUMENT_SERVED_MESSAGES.SELECTED_CASES,
      overwritable: false,
    });
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

    const myOutboxMessages = cerebralTest.getState('workQueue');
    for (const docketNumber of cerebralTest.consolidatedCasesThatShouldReceiveDocketEntries) {
      const outboxWorkItem = findWorkItemByDocketNumber(
        myOutboxMessages,
        docketNumber,
      );

      expect(outboxWorkItem).toMatchObject({
        docketEntry: {
          docketEntryId: cerebralTest.multiDocketedDocketEntryId,
          eventCode: 'ADMR',
        },
        leadDocketNumber: cerebralTest.leadDocketNumber,
      });
    }
  });
});
