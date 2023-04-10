export const privatePractitionerViewsOpenAndClosedCases = cerebralTest => {
  return it('private practitioner views open and closed cases', async () => {
    await cerebralTest.runSequence('gotoDashboardSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'DashboardPractitioner',
    );
    expect(cerebralTest.getState('openCases').length).toBeGreaterThan(0);
    expect(cerebralTest.getState('closedCases').length).toBeGreaterThan(0);
  });
};
