export const captureCreatedCase = (
  test,
  createdCases,
  createdDocketNumbers = [],
) => {
  return it('Capture Created Case', async () => {
    await test.runSequence('gotoDashboardSequence');
    createdCases.push(`${test.getState('openCases.0.caseId')}`);
    createdDocketNumbers.push(`${test.getState('openCases.0.docketNumber')}`);
  });
};
