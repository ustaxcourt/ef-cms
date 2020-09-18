export const petitionsClerkNavigatesBackAfterViewSignDraftDocument = test => {
  return it('Petitions clerk views sign draft document and navigates back to draft documents', async () => {
    await test.runSequence('gotoSignOrderSequence', {
      docketEntryId: test.docketEntryId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('SignOrder');

    await test.runSequence('navigateToCaseDetailWithDraftDocumentSequence', {
      primaryTab: 'draftDocuments',
      viewerDraftDocumentToDisplay: { docketEntryId: test.docketEntryId },
    });

    expect(test.getState('currentViewMetadata.caseDetail.primaryTab')).toEqual(
      'drafts',
    );
  });
};
