export const unauthedUserViewsPrintableDocketRecord = cerebralTest => {
  return it('View printable docket record', async () => {
    await cerebralTest.runSequence('gotoPublicPrintableDocketRecordSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    expect(cerebralTest.getState('pdfPreviewUrl')).toBeDefined();
  });
};
