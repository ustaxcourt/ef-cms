import { waitForCondition } from '../helpers';

export const docketClerkServesASavedCourtIssuedDocumentFromDocumentView =
  cerebralTest => {
    return it('docket clerks serves a saved court issued document from document view', async () => {
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

      await waitForCondition({
        booleanExpressionCondition: () =>
          cerebralTest.getState('currentPage') === 'PrintPaperService',
      });

      expect(cerebralTest.getState('currentPage')).toEqual('PrintPaperService');
    });
  };
