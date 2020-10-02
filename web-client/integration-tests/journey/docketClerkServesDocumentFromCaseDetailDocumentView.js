export const docketClerkServesDocumentFromCaseDetailDocumentView = test => {
  return it('Docketclerk serves document from case detail document view', async () => {
    await test.runSequence('openConfirmServeCourtIssuedDocumentSequence', {
      docketEntryId: test.docketEntryId,
      redirectUrl: `/case-detail/${test.docketNumber}/document-view?docketEntryId=${test.docketEntryId}`,
    });

    expect(test.getState('modal.showModal')).toEqual(
      'ConfirmInitiateCourtIssuedDocumentServiceModal',
    );

    await test.runSequence('serveCourtIssuedDocumentSequence');

    expect(test.getState('alertSuccess')).toEqual({
      message: 'Document served. ',
    });

    expect(
      test.getState('currentViewMetadata.caseDetail.docketRecordTab'),
    ).toEqual('documentView');
  });
};
