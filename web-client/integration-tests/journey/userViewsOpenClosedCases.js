export const userViewsOpenClosedCases = (
  test,
  expectedDashboardName,
  expectedClosedCases,
  caseType,
) => {
  return it('petitioner views dashboard', async () => {
    await test.runSequence('gotoDashboardSequence');

    expect(test.getState('currentPage')).toEqual(expectedDashboardName);
    expect(test.getState('openCases').length).toBeGreaterThan(0);
    expect(test.getState('closedCases').length).toBe(expectedClosedCases);

    test.docketNumber = test.getState(caseType)[0].docketNumber;
  });
};
