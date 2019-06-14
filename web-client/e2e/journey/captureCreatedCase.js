export default (test, createdCases) => {
  return it('Capture Created Case', async () => {
    await test.runSequence('gotoDashboardSequence');
    createdCases.push(`${test.getState('cases.0.caseId')}`);
  });
};
