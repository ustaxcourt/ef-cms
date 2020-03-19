export default test => {
  it('practitioner sees the procedure types and case types', async () => {
    await test.runSequence('gotoStartCaseWizardSequence');
  });
};
