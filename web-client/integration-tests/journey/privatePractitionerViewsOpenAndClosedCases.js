export const privatePractitionerViewsOpenAndClosedCases = test => {
  return it('private practitioner views open and closed cases', async () => {
    await test.runSequence('gotoDashboardSequence');

    expect(test.getState('currentPage')).toEqual('DashboardPractitioner');
    expect(test.getState('openCases').length).toBeGreaterThan(0);
    expect(test.getState('closedCases').length).toBeGreaterThan(0);
  });
};
