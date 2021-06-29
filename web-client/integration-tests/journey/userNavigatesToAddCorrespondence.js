export const userNavigatesToAddCorrespondence = (test, user) =>
  it(`${user} navigates to add correspondence page`, async () => {
    await test.runSequence('gotoUploadCorrespondenceDocumentSequence');

    expect(test.getState('currentPage')).toEqual(
      'UploadCorrespondenceDocument',
    );
  });
