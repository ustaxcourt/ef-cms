import { createConsolidatedGroup } from './journey/consolidation/createConsolidatedGroup';
import {
  fakeFile,
  getFormattedDocumentQCSectionInProgress,
  refreshElasticsearchIndex,
  setupTest,
} from './helpers';
import { formattedCaseDetail } from '../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Docket clerk multi-dockets court issued document journey', () => {
  const cerebralTest = setupTest();

  beforeAll(() => {
    cerebralTest.draftOrders = [];
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Create a consolidated group', () => {
    createConsolidatedGroup(cerebralTest);
  });

  describe('Create a court issued document, serve and multi-docket', () => {
    it('Docket Clerk uploads a court issued document', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.leadDocketNumber,
      });

      await cerebralTest.runSequence('gotoUploadCourtIssuedDocumentSequence');

      await cerebralTest.runSequence('uploadCourtIssuedDocumentSequence');

      expect(cerebralTest.getState('validationErrors')).toEqual({
        freeText: 'Enter a description',
        primaryDocumentFile: 'Upload a document',
      });

      await cerebralTest.runSequence('updateFormValueSequence', {
        key: 'freeText',
        value: 'Some order content',
      });

      await cerebralTest.runSequence('updateFormValueSequence', {
        key: 'primaryDocumentFile',
        value: fakeFile,
      });
      await cerebralTest.runSequence(
        'validateUploadCourtIssuedDocumentSequence',
      );

      expect(cerebralTest.getState('validationErrors')).toEqual({});

      await cerebralTest.runSequence('uploadCourtIssuedDocumentSequence');

      const caseDetailFormatted = runCompute(
        withAppContextDecorator(formattedCaseDetail),
        {
          state: cerebralTest.getState(),
        },
      );

      const caseDraftDocuments = caseDetailFormatted.draftDocuments;
      const newDraftOrder = caseDraftDocuments.reduce((prev, current) =>
        prev.createdAt > current.createdAt ? prev : current,
      );

      cerebralTest.docketEntryId = newDraftOrder.docketEntryId;

      expect(newDraftOrder).toBeTruthy();
      cerebralTest.draftOrders = [
        ...(cerebralTest.draftOrders || []),
        newDraftOrder,
      ];
    });

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
        docketNumber: cerebralTest.leadDocketNumber,
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

    it('edits a docket entry in document QC and serves on all consolidated cases in the group', async () => {
      await refreshElasticsearchIndex();

      const documentQCSectionInProcess =
        await getFormattedDocumentQCSectionInProgress(cerebralTest);

      const savedDocument = documentQCSectionInProcess.find(
        item => item.docketNumber === cerebralTest.leadDocketNumber,
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

      expect(
        cerebralTest.getState('modal.form.consolidatedCaseAllCheckbox'),
      ).toBe(true);

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
});
