export default test => {
  it('user sees the case confirmation pdf', async () => {
    await test.runSequence('gotoPrintableCaseConfirmationSequence', {
      docketNumber: props.docketNumber,
    });
    const pdfPreviewUrl = test.getState('pdfPreviewUrl');
    expect(pdfPreviewUrl).not.toBeNull;
  });
};
