export const unauthedUserViewsPrintableDocketRecord = test => {
  return it('View printable docket record', async () => {
    await test.runSequence('gotoPublicPrintableDocketRecordSequence', {
      docketNumber: test.docketNumber,
    });
    expect(test.getState('pdfPreviewUrl')).toBeDefined();
  });
};
