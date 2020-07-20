export const docketClerkServesDocumentFromCaseDetailDocumentView = test => {
  return it('Docketclerk serves document from case detail document view', async () => {
    await test.runSequence('openConfirmServeCourtIssuedDocumentSequence', {
      documentId: test.documentId,
      redirectUrl: `/case-detail/${test.docketNumber}/document-view?documentId=${test.documentId}`,
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
