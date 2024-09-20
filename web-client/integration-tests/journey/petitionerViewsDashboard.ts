import { refreshElasticsearchIndex } from '../helpers';

export const petitionerViewsDashboard = cerebralTest => {
  return it('petitioner views dashboard', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoDashboardSequence');

    expect(cerebralTest.getState('currentPage')).toEqual(
      'DashboardExternalUser',
    );
    expect(cerebralTest.getState('openCases').length).toBeGreaterThan(0);
    cerebralTest.docketNumber = cerebralTest.getState(
      'openCases.0.docketNumber',
    );
  });
};
