export const unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument = test => {
  return it('unassociated user views case detail for a case with a legacy sealed document', async () => {
    await expect(
      test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.docketNumber,
      }),
    ).rejects.toThrow();

    // try and get documentDownloadUrl, should throw an error
    await expect(
      test.runSequence('openCaseDocumentDownloadUrlSequence', {
        docketEntryId: test.docketEntryId,
        docketNumber: test.docketNumber,
        isPublic: false,
      }),
    ).rejects.toThrow('Unauthorized to view document at this time.');
  });
};
