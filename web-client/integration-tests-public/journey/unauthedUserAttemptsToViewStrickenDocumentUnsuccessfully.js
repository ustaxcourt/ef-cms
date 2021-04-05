export const unauthedUserAttemptsToViewStrickenDocumentUnsuccessfully = test => {
  return it('View stricken document unsuccessfully', async () => {
    await expect(
      test.runSequence('openCaseDocumentDownloadUrlSequence', {
        docketEntryId: test.docketEntryId,
        docketNumber: test.docketNumber,
        isPublic: true,
      }),
    ).rejects.toThrow('Unauthorized to access private document');
  });
};
