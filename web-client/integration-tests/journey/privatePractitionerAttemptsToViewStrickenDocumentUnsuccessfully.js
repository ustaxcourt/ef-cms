export const privatePractitionerAttemptsToViewStrickenDocumentUnsuccessfully =
  test => {
    return it('private practitioner views stricken document unsuccessfully', async () => {
      await expect(
        test.runSequence('openCaseDocumentDownloadUrlSequence', {
          docketEntryId: test.docketEntryId,
          docketNumber: test.docketNumber,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  };
