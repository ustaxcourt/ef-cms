export const unauthedUserAttemptsToViewStrickenDocumentUnsuccessfully =
  cerebralTest => {
    return it('View stricken document unsuccessfully', async () => {
      await expect(
        cerebralTest.runSequence('openCaseDocumentDownloadUrlSequence', {
          docketEntryId: cerebralTest.docketEntryId,
          docketNumber: cerebralTest.docketNumber,
          isPublic: true,
        }),
      ).rejects.toThrow('Unauthorized to access private document');
    });
  };
