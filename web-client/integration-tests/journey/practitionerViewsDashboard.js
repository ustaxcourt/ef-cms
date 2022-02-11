import { refreshElasticsearchIndex } from '../helpers';

export const practitionerViewsDashboard = cerebralTest => {
  return it('Practitioner views dashboard', async () => {
    await refreshElasticsearchIndex();
    await cerebralTest.runSequence('gotoDashboardSequence');
    expect(cerebralTest.getState('currentPage')).toEqual(
      'DashboardPractitioner',
    );

    expect(cerebralTest.getState('openCases').length).toBeGreaterThan(0);
    const allOpenCases = cerebralTest.getState('openCases');
    expect(allOpenCases).toContainEqual(
      expect.objectContaining({ docketNumber: cerebralTest.docketNumber }),
    );
  });
};
