export const unauthedUserAttemptsToViewStrickenDocumentUnsuccessfully = test => {
  return it('View printable docket record for a sealed case', async () => {
    await expect(
      test.runSequence('openCaseDocumentDownloadUrlSequence', {
        docketEntryId: test.docketEntryId,
        docketNumber: test.docketNumber,
        isPublic: true,
      }),
    ).rejects.toThrow('Unauthorized to access private document');
  });
};
