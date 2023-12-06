import { waitForLoadingComponentToHide } from '../helpers';

export const petitionsClerk1ServesPaperFilingFromMessageDetail =
  cerebralTest => {
    return it('petitions clerk 1 serves paper filing from message detail', async () => {
      await cerebralTest.runSequence(
        'openConfirmServePaperFiledDocumentSequence',
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
        'ConfirmInitiatePaperFilingServiceModal',
      );

      await cerebralTest.setState('iframeSrc', undefined);

      await cerebralTest.runSequence('servePaperFiledDocumentSequence');

      await waitForLoadingComponentToHide({ cerebralTest });

      expect(cerebralTest.getState('alertSuccess')).toMatchObject({
        message: 'Your entry has been added to the docket record.',
        overwritable: false,
      });
      expect(cerebralTest.getState('currentPage')).toBe('MessageDetail');

      expect(cerebralTest.getState('iframeSrc')).not.toBeUndefined();
    });
  };
