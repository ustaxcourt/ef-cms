import { refreshElasticsearchIndex } from '../helpers';

export const petitionerViewsDashboard = test => {
  return it('petitioner views dashboard', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoDashboardSequence');

    expect(test.getState('currentPage')).toEqual('DashboardPetitioner');
    expect(test.getState('openCases').length).toBeGreaterThan(0);
    test.docketNumber = test.getState('openCases.0.docketNumber');
  });
};
