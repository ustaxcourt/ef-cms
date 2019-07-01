export default (test, createdCases, createdDocketNumbers = []) => {
  return it('Capture Created Case', async () => {
    await test.runSequence('gotoDashboardSequence');
    createdCases.push(`${test.getState('cases.0.caseId')}`);
    createdDocketNumbers.push(`${test.getState('cases.0.docketNumber')}`);
  });
};
