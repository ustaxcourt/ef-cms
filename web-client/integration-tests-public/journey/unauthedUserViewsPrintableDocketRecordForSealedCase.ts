export const unauthedUserViewsPrintableDocketRecordForSealedCase =
  cerebralTest => {
    return it('View printable docket record for a sealed case', async () => {
      await expect(
        cerebralTest.runSequence('gotoPublicPrintableDocketRecordSequence', {
          docketNumber: cerebralTest.docketNumber,
        }),
      ).rejects.toThrow('Unauthorized to view sealed case.');
    });
  };
