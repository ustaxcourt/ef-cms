export const userNavigatesToAddCorrespondence = (cerebralTest, user) =>
  it(`${user} navigates to add correspondence page`, async () => {
    await cerebralTest.runSequence('gotoUploadCorrespondenceDocumentSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'UploadCorrespondenceDocument',
    );
  });
