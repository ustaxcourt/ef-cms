export const petitionsClerkNavigatesBackAfterViewSignDraftDocument = test => {
  return it('Petitions clerk views sign draft document and navigates back to draft documents', async () => {
    await test.runSequence('gotoSignOrderSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
    });

    expect(test.getState('currentPage')).toEqual('SignOrder');

    await test.runSequence('navigateToCaseDetailWithDraftDocumentSequence', {
      primaryTab: 'draftDocuments',
      viewerDraftDocumentToDisplay: { documentId: test.documentId },
    });

    expect(test.getState('currentViewMetadata.caseDetail.primaryTab')).toEqual(
      'drafts',
    );
  });
};
