import { waitForLoadingComponentToHide } from '../helpers';

export const docketClerkServesDocumentFromCaseDetailDocumentView =
  cerebralTest => {
    return it('Docket clerk serves document from case detail document view', async () => {
      const docketEntryId =
        cerebralTest.multiDocketedDocketEntryId || cerebralTest.docketEntryId;

      const docketNumber =
        cerebralTest.docketNumber || cerebralTest.leadDocketNumber;

      await cerebralTest.runSequence(
        'openConfirmServeCourtIssuedDocumentSequence',
        {
          docketEntryId,
          redirectUrl: `/case-detail/${docketNumber}/document-view?docketEntryId=${docketEntryId}`,
        },
      );

      expect(cerebralTest.getState('modal.showModal')).toEqual(
        'ConfirmInitiateCourtIssuedDocumentServiceModal',
      );

      await cerebralTest.runSequence('serveCourtIssuedDocumentSequence');

      await waitForLoadingComponentToHide({ cerebralTest });

      expect(cerebralTest.getState('alertSuccess')).toEqual({
        message: 'Document served. ',
        overwritable: false,
      });

      expect(
        cerebralTest.getState('currentViewMetadata.caseDetail.docketRecordTab'),
      ).toEqual('documentView');
    });
  };
