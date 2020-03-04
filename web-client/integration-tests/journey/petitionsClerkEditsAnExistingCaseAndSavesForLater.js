export default test => {
  return it('Petitions clerk edits an case and saves for later', async () => {
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: '140-20',
      documentId: 'f5a9aeda-7c65-4b0c-bc07-1646facacb68',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'partyType',
      value: 'Guardian',
    });

    await test.runSequence('validatePetitionFromPaperSequence');

    expect(test.getState('alertError')).toBeUndefined();
    expect(test.getState('validationErrors')).toEqual({});

    await test.runSequence('navigateToReviewPetitionFromPaperSequence');
    await test.runSequence('gotoReviewPetitionFromPaperSequence');

    expect(test.getState('currentPage')).toEqual('ReviewPetitionFromPaper');

    await test.runSequence('saveSavedCaseForLaterSequence');

    expect(test.getState('currentPage')).toEqual('Messages');
  });
};
