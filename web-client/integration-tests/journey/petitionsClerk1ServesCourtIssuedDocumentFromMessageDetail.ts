import { DOCUMENT_SERVED_MESSAGES } from '../../../shared/src/business/entities/EntityConstants';
import { waitForLoadingComponentToHide } from '../helpers';

export const petitionsClerk1ServesCourtIssuedDocumentFromMessageDetail =
  cerebralTest => {
    return it('petitions clerk 1 serves court issued document from message detail', async () => {
      await cerebralTest.runSequence(
        'openConfirmServeCourtIssuedDocumentSequence',
        {
          docketEntryId: cerebralTest.docketEntryId,
          redirectUrl: `/messages/${cerebralTest.docketNumber}/message-detail/${cerebralTest.parentMessageId}`,
        },
      );

      expect(cerebralTest.getState('redirectUrl')).toBe(
        `/messages/${cerebralTest.docketNumber}/message-detail/${cerebralTest.parentMessageId}`,
      );
      expect(cerebralTest.getState('docketEntryId')).toBe(
        cerebralTest.docketEntryId,
      );
      expect(cerebralTest.getState('modal.showModal')).toBe(
        'ConfirmInitiateCourtIssuedFilingServiceModal',
      );

      await cerebralTest.setState('iframeSrc', undefined);

      await cerebralTest.runSequence('serveCourtIssuedDocumentSequence', {});

      await waitForLoadingComponentToHide({ cerebralTest });

      expect(cerebralTest.getState('alertSuccess')).toMatchObject({
        message: DOCUMENT_SERVED_MESSAGES.GENERIC,
        overwritable: false,
      });
      expect(cerebralTest.getState('currentPage')).toBe('MessageDetail');
      expect(cerebralTest.getState('iframeSrc')).not.toBeUndefined();
    });
  };
