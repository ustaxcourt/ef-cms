import { applicationContextForClient as applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { waitForLoadingComponentToHide } from '../helpers';

export const docketClerkServesDocumentFromCaseDetailDocumentView =
  cerebralTest => {
    return it('Docket clerk serves document from case detail document view', async () => {
      const { DOCUMENT_SERVED_MESSAGES } = applicationContext.getConstants();

      await cerebralTest.runSequence(
        'openConfirmServeCourtIssuedDocumentSequence',
        {
          docketEntryId: cerebralTest.docketEntryId,
          redirectUrl: `/case-detail/${cerebralTest.docketNumber}/document-view?docketEntryId=${cerebralTest.docketEntryId}`,
        },
      );

      expect(cerebralTest.getState('modal.showModal')).toEqual(
        'ConfirmInitiateCourtIssuedFilingServiceModal',
      );

      await cerebralTest.runSequence('serveCourtIssuedDocumentSequence');

      await waitForLoadingComponentToHide({ cerebralTest });

      expect(cerebralTest.getState('alertSuccess')).toEqual({
        message: DOCUMENT_SERVED_MESSAGES.GENERIC,
        overwritable: false,
      });

      expect(
        cerebralTest.getState('currentViewMetadata.caseDetail.docketRecordTab'),
      ).toEqual('documentView');
    });
  };
