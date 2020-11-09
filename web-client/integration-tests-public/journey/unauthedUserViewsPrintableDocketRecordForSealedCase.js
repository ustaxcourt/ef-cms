export const unauthedUserViewsPrintableDocketRecordForSealedCase = test => {
  return it('View printable docket record for a sealed case', async () => {
    await expect(
      test.runSequence('gotoPublicPrintableDocketRecordSequence', {
        docketNumber: test.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized to view sealed case.');
  });
};
