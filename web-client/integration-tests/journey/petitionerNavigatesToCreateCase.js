export default test => {
  it('petitioner sees the procedure types and case types', async () => {
    await test.runSequence('gotoStartCaseWizardSequence');
  });
};
