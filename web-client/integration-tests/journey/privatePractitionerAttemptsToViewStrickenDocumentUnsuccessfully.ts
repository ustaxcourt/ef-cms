export const privatePractitionerAttemptsToViewStrickenDocumentUnsuccessfully =
  cerebralTest => {
    return it('private practitioner views stricken document unsuccessfully', async () => {
      await expect(
        cerebralTest.runSequence('openCaseDocumentDownloadUrlSequence', {
          docketEntryId: cerebralTest.docketEntryId,
          docketNumber: cerebralTest.docketNumber,
        }),
      ).rejects.toThrow('Unauthorized to view document at this time.');
    });
  };
