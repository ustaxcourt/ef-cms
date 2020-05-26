export const docketClerkNavigatesToAddCorrespondence = test =>
  it('docketclerk navigates to add correspondence page', async () => {
    await test.runSequence('gotoUploadCorrespondenceDocumentSequence');

    expect(test.getState('currentPage')).toEqual(
      'UploadCorrespondenceDocument',
    );
  });
