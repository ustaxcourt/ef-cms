import { refreshElasticsearchIndex } from '../helpers';

export const petitionerViewsOpenAndClosedCases = test => {
  return it('petitioner views open and closed cases', async () => {
    await refreshElasticsearchIndex();

    await test.runSequence('gotoDashboardSequence');

    expect(test.getState('currentPage')).toEqual('DashboardPetitioner');
    expect(test.getState('openCases').length).toBeGreaterThan(0);
    expect(test.getState('closedCases')[0]).toMatchObject({
      docketNumber: test.docketNumber,
    });
  });
};
