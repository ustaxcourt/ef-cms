import { refreshElasticsearchIndex } from '../helpers';

export const practitionerViewsDashboard = cerebralTest => {
  return it('Practitioner views dashboard', async () => {
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoDashboardSequence');
    expect(cerebralTest.getState('currentPage')).toEqual(
      'DashboardPractitioner',
    );
    expect(cerebralTest.getState('openCases').length).toBeGreaterThan(0);
    const latestDocketNumber = cerebralTest.getState(
      'openCases.0.docketNumber',
    );
    expect(cerebralTest.docketNumber).toEqual(latestDocketNumber);
  });
};
