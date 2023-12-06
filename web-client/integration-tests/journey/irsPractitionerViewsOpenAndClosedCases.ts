export const irsPractitionerViewsOpenAndClosedCases = cerebralTest => {
  return it('irs practitoner views open and closed cases', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('DashboardRespondent');
    expect(cerebralTest.getState('openCases').length).toBeGreaterThan(0);
    expect(cerebralTest.getState('closedCases').length).toBeGreaterThan(0);
  });
};
