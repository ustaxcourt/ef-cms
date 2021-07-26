export const docketClerkServesDocumentFromCaseDetailDocumentView =
  cerebralTest => {
    return it('Docketclerk serves document from case detail document view', async () => {
      await cerebralTest.runSequence(
        'openConfirmServeCourtIssuedDocumentSequence',
        {
          docketEntryId: cerebralTest.docketEntryId,
          redirectUrl: `/case-detail/${cerebralTest.docketNumber}/document-view?docketEntryId=${cerebralTest.docketEntryId}`,
        },
      );

      expect(cerebralTest.getState('modal.showModal')).toEqual(
        'ConfirmInitiateCourtIssuedDocumentServiceModal',
      );

      await cerebralTest.runSequence('serveCourtIssuedDocumentSequence');

      expect(cerebralTest.getState('alertSuccess')).toEqual({
        message: 'Document served. ',
      });

      expect(
        cerebralTest.getState('currentViewMetadata.caseDetail.docketRecordTab'),
      ).toEqual('documentView');
    });
  };
