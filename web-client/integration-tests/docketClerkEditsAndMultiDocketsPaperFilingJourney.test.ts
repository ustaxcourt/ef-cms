import {
  DOCUMENT_SERVED_MESSAGES,
  SERVICE_INDICATOR_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { FORMATS } from '@shared/business/utilities/DateHandler';
import { confirmInitiateServiceModalHelper } from '../src/presenter/computeds/confirmInitiateServiceModalHelper';
import {
  contactPrimaryFromState,
  fakeFile,
  findWorkItemByDocketNumber,
  setupTest,
  waitForCondition,
} from './helpers';
import { createConsolidatedGroup } from './journey/consolidation/createConsolidatedGroup';
import { docketClerkEditsServiceIndicatorForPetitioner } from './journey/docketClerkEditsServiceIndicatorForPetitioner';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Docket Clerk edits and multi-dockets a paper filing journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Create a consolidated group', () => {
    createConsolidatedGroup(cerebralTest);
  });

  describe('Create a paper filing, save for later, then serve and multi-docket', () => {
    docketClerkEditsServiceIndicatorForPetitioner(
      cerebralTest,
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    );

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
        eventCode: 'A',
        trialLocation: 'Little Rock, AR',
      };

      for (let [key, value] of Object.entries(formValues)) {
        await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
          key,
          value,
        });
      }

      await cerebralTest.runSequence(
        'formatAndUpdateDateFromDatePickerSequence',
        {
          key: 'receivedAt',
          toFormat: FORMATS.ISO,
          value: '1/1/2018',
        },
      );

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

      expect(cerebralTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );

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
        withAppContextDecorator(confirmInitiateServiceModalHelper),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(modalHelper.showPaperAlert).toBe(true);
      expect(modalHelper.showConsolidatedCasesForService).toBe(true);
      expect(cerebralTest.getState('modal.showModal')).toEqual(
        'ConfirmInitiatePaperFilingServiceModal',
      );

      await cerebralTest.runSequence('submitPaperFilingSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      await waitForCondition({
        booleanExpressionCondition: () =>
          cerebralTest.getState('currentPage') === 'PrintPaperService',
      });

      expect(cerebralTest.getState('currentPage')).toEqual('PrintPaperService');
      expect(cerebralTest.getState('alertSuccess')).toMatchObject({
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
            doc =>
              doc.docketEntryId === cerebralTest.multiDocketedDocketEntryId,
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
});
