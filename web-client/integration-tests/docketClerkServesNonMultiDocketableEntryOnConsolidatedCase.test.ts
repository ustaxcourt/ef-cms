import {
  OBJECTIONS_OPTIONS_MAP,
  SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES,
} from '../../shared/src/business/entities/EntityConstants';
import { confirmInitiateServiceModalHelper } from '../src/presenter/computeds/confirmInitiateServiceModalHelper';
import { createConsolidatedGroup } from './journey/consolidation/createConsolidatedGroup';
import { docketClerkAddsPaperFiledDocketEntryAndSavesForLater } from './journey/docketClerkAddsPaperFiledDocketEntryAndSavesForLater';
import { fakeFile } from '../integration-tests-public/helpers';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { setupTest } from './helpers';
import { withAppContextDecorator } from '../src/withAppContext';

describe('Docket Clerk serves non multi-docketable entry on consolidated case', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  describe('Create a consolidated group', () => {
    createConsolidatedGroup(cerebralTest);
  });

  describe('Create a non-multidocketable docket entry on the lead case and serve', () => {
    const documentFormValues = {
      dateReceivedDay: 1,
      dateReceivedMonth: 1,
      dateReceivedYear: 2018,
      eventCode: SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES[0],
      objections: OBJECTIONS_OPTIONS_MAP.NO,
      primaryDocumentFile: fakeFile,
      primaryDocumentFileSize: 100,
    };

    it('setup docket number', () => {
      cerebralTest.docketNumber = cerebralTest.leadDocketNumber;
    });

    docketClerkAddsPaperFiledDocketEntryAndSavesForLater({
      cerebralTest,
      documentFormValues,
      expectedDocumentType: 'Agreed Computation for Entry of Decision',
    });

    it('docket clerk serves decision document from document viewer', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.leadDocketNumber,
      });

      await cerebralTest.runSequence(
        'openConfirmServePaperFiledDocumentSequence',
        {
          docketEntryId: cerebralTest.docketEntryId,
          redirectUrl: `/case-detail/${cerebralTest.leadDocketNumber}/document-view?docketEntryId=${cerebralTest.docketEntryId}`,
        },
      );

      expect(cerebralTest.getState('modal.showModal')).toEqual(
        'ConfirmInitiatePaperFilingServiceModal',
      );
    });

    it('docket clerk verifies consolidated case checkboxes do NOT display for case decision service', () => {
      const modalHelper = runCompute(
        withAppContextDecorator(confirmInitiateServiceModalHelper),
        {
          state: cerebralTest.getState(),
        },
      );

      expect(modalHelper.showConsolidatedCasesForService).toBe(false);
    });
  });
});
