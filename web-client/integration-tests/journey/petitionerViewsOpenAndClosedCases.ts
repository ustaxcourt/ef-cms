import { refreshElasticsearchIndex } from '../helpers';

export const petitionerViewsOpenAndClosedCases = cerebralTest => {
  return it('petitioner views open and closed cases', async () => {
    await refreshElasticsearchIndex();

    await cerebralTest.runSequence('gotoDashboardSequence');

    expect(cerebralTest.getState('currentPage')).toEqual('DashboardPetitioner');
    expect(cerebralTest.getState('openCases').length).toBeGreaterThan(0);
    expect(cerebralTest.getState('closedCases')[0]).toMatchObject({
      docketNumber: cerebralTest.docketNumber,
    });
  });
};
